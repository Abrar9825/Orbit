const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');

router.post('/login', login);

router.post('/verify-token', verifyToken);

module.exports = router;
