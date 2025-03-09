const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Importa multer para subir archivos


const app = express();
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET || "mi_clave_secreta"; // Usa una variable de entorno en producción

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));


// Aumentar el límite del JSON a 50MB
app.use(express.json({ limit: '50mb' }));



// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024, // 40MB (ajusta según sea necesario)
  },
});




// Conectar con MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',       
  database: 'snap_story'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // Se espera el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token mal formado' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    req.user = decoded; // Guarda la info decodificada en req.user
    next();
  });
}

// ➤ Ruta para registrar un nuevo usuario (incluye "username")
app.post('/api/register', (req, res) => {
  const { username, full_name, email, password } = req.body;

  if (!username || !full_name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos (username, full_name, email, password) son requeridos' });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('❌ Error al hashear la contraseña:', err);
      return res.status(500).json({ message: 'Error al procesar la contraseña' });
    }

    const query = 'INSERT INTO users (username, full_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(query, [username, full_name, email, hash], (err, results) => {
      if (err) {
        console.error('❌ Error insertando el usuario:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }
      console.log('✅ Usuario registrado correctamente:', results);
      res.json({ message: 'Usuario registrado correctamente', user_id: results.insertId });
    });
  });
});

// ➤ Ruta de autenticación de usuario usando username y contraseña con JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      console.log('⚠️ Usuario no encontrado en la base de datos:', username);
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Compara la contraseña ingresada con el hash almacenado usando bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('❌ Error al comparar contraseñas:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }

      if (!isMatch) {
        console.log('⛔ Contraseña incorrecta para el usuario:', username);
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Si la autenticación es correcta, genera un token JWT
      const token = jwt.sign(
        { id: user.user_id, username: user.username },
        secretKey,
        { expiresIn: '1h' }
      );

      console.log('✅ Usuario autenticado correctamente:', user);
      res.json({
        message: 'ok',
        token, // Se envía el token en la respuesta
        user: {
          id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          email: user.email
        }
      });
    });
  });
});

// ➤ Ruta protegida: Solo accesible con un token válido
app.get('/api/profile', verifyToken, (req, res) => {
  // En req.user tienes los datos decodificados del token (p.ej. id y username)
  res.json({
    message: 'Perfil accedido correctamente',
    user: req.user
  });
});



// app.get('/api/posts',(req,res)=>{
//   const query = 'SELECT * FROM posts';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('❌ Error en la consulta:', err);
//       return res.status(500).json({ message: 'Error del servidor' });
//     }
//     res.json(results);
//   });
// })

 // ➤ Ruta para recuperar los posts
app.get('/api/posts', (req, res) => {
  const query = `
    SELECT posts.*, users.username 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    res.json(results);
  });
});

// ➤ Ruta para crear un nuevo post (requiere token válido)
app.post('/api/posts', verifyToken, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.id;

  if (!title || !description || !req.file) { // Verifica si el archivo se cargó
    return res.status(400).json({ message: 'Faltan campos obligatorios o la imagen' });
  }

  const image = 'uploads/' + req.file.filename; // Genera la URL de la imagen

  const query = 'INSERT INTO posts (title, description, source, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, image, user_id], (err, results) => {
    if (err) {
      console.error('❌ Error insertando el post:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    console.log('✅ Post creado correctamente:', results);
    res.json({ message: 'Post creado correctamente', postId: results.insertId });
  });
});



// ➤ Ruta para recuperar las publicaciones del usuario logueado (requiere token)
app.get('/api/myposts', verifyToken, (req, res) => {
  const userId = req.user.id; // Obtenido del token verificado
  const query = `
    SELECT posts.*, users.username 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.user_id
    WHERE posts.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    res.json(results);
  });
});



// ➤ Ruta para eliminar un post (requiere token válido)
app.delete('/api/posts/:postId', verifyToken, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Obtenido del token

  // Primero, verifica que el post pertenezca al usuario
  const selectQuery = 'SELECT * FROM posts WHERE post_id = ? AND user_id = ?';
  db.query(selectQuery, [postId, userId], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar el post:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    if (results.length === 0) {
      // El post no existe o no pertenece al usuario
      return res.status(403).json({ message: 'No autorizado para eliminar este post' });
    }
    // Si la verificación es exitosa, elimina el post
    const deleteQuery = 'DELETE FROM posts WHERE post_id = ?';
    db.query(deleteQuery, [postId], (err, results) => {
      if (err) {
        console.error('❌ Error eliminando el post:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }
      console.log('✅ Post eliminado correctamente:', results);
      res.json({ message: 'Post eliminado correctamente' });
    });
  });
});



// ➤ Ruta para actualizar el título de un post (requiere token válido)
app.put('/api/posts/:postId', verifyToken, (req, res) => {
  const postId = req.params.postId;
  const { title } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  // Verifica que el post pertenezca al usuario
  const selectQuery = 'SELECT * FROM posts WHERE post_id = ? AND user_id = ?';
  db.query(selectQuery, [postId, userId], (err, results) => {
    if (err) {
      console.error('Error al verificar el post:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    if (results.length === 0) {
      return res.status(403).json({ message: 'No autorizado para modificar este post' });
    }

    // Actualiza el título
    const updateQuery = 'UPDATE posts SET title = ? WHERE post_id = ?';
    db.query(updateQuery, [title, postId], (err, results) => {
      if (err) {
        console.error('Error al actualizar el post:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }
      res.json({ message: 'Título actualizado correctamente' });
    });
  });
});


// ➤ Ruta para actualizar la descripción de un post (requiere token válido)
app.put('/api/posts/:postId/description', verifyToken, (req, res) => {
  const postId = req.params.postId;
  const { description } = req.body;
  const userId = req.user.id;

  if (!description) {
    return res.status(400).json({ message: 'La descripción es obligatoria' });
  }

  // Verifica que el post pertenezca al usuario
  const selectQuery = 'SELECT * FROM posts WHERE post_id = ? AND user_id = ?';
  db.query(selectQuery, [postId, userId], (err, results) => {
    if (err) {
      console.error('Error al verificar el post:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
    if (results.length === 0) {
      return res.status(403).json({ message: 'No autorizado para modificar este post' });
    }

    // Actualiza la descripción
    const updateQuery = 'UPDATE posts SET description = ? WHERE post_id = ?';
    db.query(updateQuery, [description, postId], (err, results) => {
      if (err) {
        console.error('Error al actualizar el post:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }
      res.json({ message: 'Descripción actualizada correctamente' });
    });
  });
});




app.listen(4000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:4000');
});
