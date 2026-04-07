// server.js
require('dotenv').config();
const cors = require('cors');

const app = require('./src/app');

app.use(cors()); // Thêm dòng này (phải đặt TRƯỚC các app.use tuyến đường routes)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(` HRM Backend Server is running on port ${PORT}`);
    console.log(` Base URL: http://localhost:${PORT}/api/v1`);
});