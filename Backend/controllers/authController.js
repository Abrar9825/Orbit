const jwt = require('jsonwebtoken');

function getFullPermissions() {
  return [
    { page: 'Parts Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'BOM Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'Machine Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
    { page: 'Stock Management', canCreate: true, canView: true, canEdit: true, canDelete: true },
  ];
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'your-secret-key';
}

function getAdminCredentials() {
  return {
    userName: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };
}

function createWorkerPayload(userName) {
  return {
    userName,
    role: 'admin',
    permissions: getFullPermissions(),
  };
}

async function login(req, res) {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide userName and password',
        data: null,
      });
    }

    const expectedAdmin = getAdminCredentials();

    if (userName !== expectedAdmin.userName || password !== expectedAdmin.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      });
    }

    const workerPayload = createWorkerPayload(userName);
    const token = jwt.sign(workerPayload, getJwtSecret(), { expiresIn: '7d' });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        worker: workerPayload,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      data: error.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
        data: null,
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    return res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: decoded,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.',
        data: null,
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please login again.',
      data: null,
    });
  }
}

module.exports = {
  login,
  verifyToken,
};
