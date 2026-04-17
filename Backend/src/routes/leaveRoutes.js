const express = require('express');
const router = express.Router();

// test API
router.get('/', (req, res) => {
    res.send('Leave API is working');
});

module.exports = router;