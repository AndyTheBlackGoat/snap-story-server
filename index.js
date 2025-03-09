// const express = require('express');
// const cors = require('cors'); // Asegurar que Vue pueda acceder al backend
// const app = express();

// app.use(cors());
// app.use(express.json()); // Permite recibir JSON en las solicitudes

// // Ruta corregida para obtener usuarios
// app.post('/api/users', (req, res) => {
//   res.json([{ id: 1, name: "Usuario de prueba" }]);
// });

// app.listen(4000, () => {
//   console.log('Server is running on port 4000');
// });









//ESTE SI FUNCIONA

// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();
// const saltRounds = 10;

// app.use(cors({
//   origin: 'http://localhost:8080',
//   credentials: true
// }));

// app.use(express.json());

// // Conectar con MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       
//   password: '',       
//   database: 'snap_story'
// });

// db.connect(err => {
//   if (err) {
//     console.error('❌ Error conectando a MySQL:', err);
//     return;
//   }
//   console.log('✅ Conectado a MySQL');
// });

// // ➤ Ruta para registrar un nuevo usuario (incluye "username")
// app.post('/api/register', (req, res) => {
//   const { username, full_name, email, password } = req.body;

//   if (!username || !full_name || !email || !password) {
//     return res.status(400).json({ message: 'Todos los campos (username, full_name, email, password) son requeridos' });
//   }

//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       console.error('❌ Error al hashear la contraseña:', err);
//       return res.status(500).json({ message: 'Error al procesar la contraseña' });
//     }

//     const query = 'INSERT INTO users (username, full_name, email, password) VALUES (?, ?, ?, ?)';
//     db.query(query, [username, full_name, email, hash], (err, results) => {
//       if (err) {
//         console.error('❌ Error insertando el usuario:', err);
//         return res.status(500).json({ message: 'Error del servidor' });
//       }
//       console.log('✅ Usuario registrado correctamente:', results);
//       res.json({ message: 'Usuario registrado correctamente', user_id: results.insertId });
//     });
//   });
// });

// // ➤ Ruta de autenticación de usuario usando username y contraseña
// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username y contraseña son requeridos' });
//   }

//   const query = 'SELECT * FROM users WHERE username = ?';
//   db.query(query, [username], (err, results) => {
//     if (err) {
//       console.error('❌ Error en la consulta:', err);
//       return res.status(500).json({ message: 'Error del servidor' });
//     }

//     if (results.length === 0) {
//       console.log('⚠️ Usuario no encontrado en la base de datos:', username);
//       return res.status(401).json({ message: 'Usuario no encontrado' });
//     }

//     const user = results[0];

//     // Compara la contraseña ingresada con el hash almacenado usando bcrypt
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) {
//         console.error('❌ Error al comparar contraseñas:', err);
//         return res.status(500).json({ message: 'Error del servidor' });
//       }

//       if (!isMatch) {
//         console.log('⛔ Contraseña incorrecta para el usuario:', username);
//         return res.status(401).json({ message: 'Contraseña incorrecta' });
//       }

//       console.log('✅ Usuario autenticado correctamente:', user);
//       res.json({
//         message: 'ok',
//         user: {
//           id: user.user_id,
//           username: user.username,
//           full_name: user.full_name,
//           email: user.email
//         }
//       });
//     });
//   });
// });

// app.listen(4000, () => {
//   console.log('🚀 Servidor corriendo en http://localhost:4000');
// });





//ESTE SI FUNCIONA


// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const app = express();
// const saltRounds = 10;
// const secretKey = process.env.JWT_SECRET || "mi_clave_secreta"; // Usa una variable de entorno en producción

// app.use(cors({
//   origin: 'http://localhost:8080',
//   credentials: true
// }));

// app.use(express.json());

// // Conectar con MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       
//   password: '',       
//   database: 'snap_story'
// });

// db.connect(err => {
//   if (err) {
//     console.error('❌ Error conectando a MySQL:', err);
//     return;
//   }
//   console.log('✅ Conectado a MySQL');
// });

// // ➤ Ruta para registrar un nuevo usuario (incluye "username")
// app.post('/api/register', (req, res) => {
//   const { username, full_name, email, password } = req.body;

//   if (!username || !full_name || !email || !password) {
//     return res.status(400).json({ message: 'Todos los campos (username, full_name, email, password) son requeridos' });
//   }

//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       console.error('❌ Error al hashear la contraseña:', err);
//       return res.status(500).json({ message: 'Error al procesar la contraseña' });
//     }

//     const query = 'INSERT INTO users (username, full_name, email, password) VALUES (?, ?, ?, ?)';
//     db.query(query, [username, full_name, email, hash], (err, results) => {
//       if (err) {
//         console.error('❌ Error insertando el usuario:', err);
//         return res.status(500).json({ message: 'Error del servidor' });
//       }
//       console.log('✅ Usuario registrado correctamente:', results);
//       res.json({ message: 'Usuario registrado correctamente', user_id: results.insertId });
//     });
//   });
// });

// // ➤ Ruta de autenticación de usuario usando username y contraseña con JWT
// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username y contraseña son requeridos' });
//   }

//   const query = 'SELECT * FROM users WHERE username = ?';
//   db.query(query, [username], (err, results) => {
//     if (err) {
//       console.error('❌ Error en la consulta:', err);
//       return res.status(500).json({ message: 'Error del servidor' });
//     }

//     if (results.length === 0) {
//       console.log('⚠️ Usuario no encontrado en la base de datos:', username);
//       return res.status(401).json({ message: 'Usuario no encontrado' });
//     }

//     const user = results[0];

//     // Compara la contraseña ingresada con el hash almacenado usando bcrypt
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) {
//         console.error('❌ Error al comparar contraseñas:', err);
//         return res.status(500).json({ message: 'Error del servidor' });
//       }

//       if (!isMatch) {
//         console.log('⛔ Contraseña incorrecta para el usuario:', username);
//         return res.status(401).json({ message: 'Contraseña incorrecta' });
//       }

//       // Si la autenticación es correcta, genera un token JWT
//       const token = jwt.sign(
//         { id: user.user_id, username: user.username },
//         secretKey,
//         { expiresIn: '1h' }
//       );

//       console.log('✅ Usuario autenticado correctamente:', user);
//       res.json({
//         message: 'ok',
//         token, // Token JWT
//         user: {
//           id: user.user_id,
//           username: user.username,
//           full_name: user.full_name,
//           email: user.email
//         }
//       });
//     });
//   });
// });

// app.listen(4000, () => {
//   console.log('🚀 Servidor corriendo en http://localhost:4000');
// });


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET || "mi_clave_secreta"; // Usa una variable de entorno en producción

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());

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

app.listen(4000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:4000');
});
