// // backend/config/db.js
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'full_functional_ds_db'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('❌ MySQL connection error:', err);
//   } else {
//     console.log('✅ Connected to MySQL');
//   }
// });

// module.exports = db;

// backend/config/db.js
// backend/config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'full_functional_ds_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise(); // Important for async/await

module.exports = db;
