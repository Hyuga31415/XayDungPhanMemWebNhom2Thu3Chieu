// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    // Bật SSL tự động nếu dùng TiDB Serverless (dựa vào cờ trong .env)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log(' Database connection established successfully.');
        conn.release();
    })
    .catch(err => {
        console.error(' Database connection failed:', err.message);
    });

module.exports = pool;