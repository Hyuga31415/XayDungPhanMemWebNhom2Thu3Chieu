// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Khai báo Base URL là /api/v1 (Khớp với axiosClient bên Frontend)
app.use('/api/v1', routes);

// Bắt lỗi 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint không tồn tại.' });
});

module.exports = app;