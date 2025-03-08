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










// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();

// // Configura CORS para permitir el origen del frontend y habilitar el envío de credenciales
// app.use(cors({
//   origin: 'http://localhost:8080', // Cambia este valor si tu frontend corre en otro puerto o dominio
//   credentials: true
// }));

// app.use(express.json());

// // Conectar con MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       // Cambia esto si usas otro usuario
//   password: '',       // Cambia esto si tienes contraseña
//   database: 'snap_story'
// });

// db.connect(err => {
//   if (err) {
//     console.error('❌ Error conectando a MySQL:', err);
//     return;
//   }
//   console.log('✅ Conectado a MySQL');
// });

// // 🔥 Ruta de autenticación de usuario SIN encriptación
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email y contraseña son requeridos' });
//   }

//   const query = 'SELECT * FROM users WHERE email = ?';
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error('❌ Error en la consulta:', err);
//       return res.status(500).json({ message: 'Error del servidor' });
//     }

//     if (results.length === 0) {
//       console.log('⚠️ Usuario no encontrado en la base de datos:', email);
//       return res.status(401).json({ message: 'Usuario no encontrado' });
//     }

//     const user = results[0];

//     // Compara las contraseñas en texto plano
//     if (password !== user.password) {
//       console.log('⛔ Contraseña incorrecta para el usuario:', email);
//       return res.status(401).json({ message: 'Contraseña incorrecta' });
//     }

//     console.log('✅ Usuario autenticado correctamente:', user);
//     res.json({
//       message: 'ok',
//       user: {
//         id: user.user_id,
//         full_name: user.full_name,
//         email: user.email
//       }
//     });
//   });
// });

// // Iniciar servidor en el puerto 4000
// app.listen(4000, () => {
//   console.log('🚀 Servidor corriendo en http://localhost:4000');
// });




// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();

// // Configura CORS para permitir el origen del frontend y habilitar el envío de credenciales
// app.use(cors({
//   origin: 'http://localhost:8080', // Ajusta este valor según tu configuración
//   credentials: true
// }));

// app.use(express.json());

// // Conectar con MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       // Cambia este valor si es necesario
//   password: '',       // Cambia este valor si es necesario
//   database: 'snap_story'
// });

// db.connect(err => {
//   if (err) {
//     console.error('❌ Error conectando a MySQL:', err);
//     return;
//   }
//   console.log('✅ Conectado a MySQL');
// });

// // 🔥 Ruta de autenticación de usuario con encriptación
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email y contraseña son requeridos' });
//   }

//   const query = 'SELECT * FROM users WHERE email = ?';
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error('❌ Error en la consulta:', err);
//       return res.status(500).json({ message: 'Error del servidor' });
//     }

//     if (results.length === 0) {
//       console.log('⚠️ Usuario no encontrado en la base de datos:', email);
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
//         console.log('⛔ Contraseña incorrecta para el usuario:', email);
//         return res.status(401).json({ message: 'Contraseña incorrecta' });
//       }

//       console.log('✅ Usuario autenticado correctamente:', user);
//       res.json({
//         message: 'ok',
//         user: {
//           id: user.user_id,
//           full_name: user.full_name,
//           email: user.email
//         }
//       });
//     });
//   });
// });

// // Iniciar servidor en el puerto 4000
// app.listen(4000, () => {
//   console.log('🚀 Servidor corriendo en http://localhost:4000');
// });



const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const saltRounds = 10;

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

// ➤ Ruta de autenticación de usuario usando username y contraseña
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

      console.log('✅ Usuario autenticado correctamente:', user);
      res.json({
        message: 'ok',
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

app.listen(4000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:4000');
});
