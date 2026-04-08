const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

function getFullPermissions() {
  return [
    { page: 'Parts Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'BOM Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'Machine Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'Stock Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
  ];
}

// Login endpoint - returns JWT token
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Validation
    if (!userName || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide userName and password',
        data: null
      });
    }

    const expectedUserName = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (userName !== expectedUserName || password !== expectedPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
        data: null
      });
    }

    const workerPayload = {
      userName,
      role: 'admin',
      permissions: getFullPermissions(),
    };

    const token = jwt.sign(workerPayload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        worker: workerPayload,
        token: token
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      data: error.message
    });
  }
});

// Verify token endpoint - for frontend to validate if token is still valid
router.post('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
        data: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    return res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: decoded
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.',
        data: null
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please login again.',
      data: null
    });
  }
});

module.exports = router;
