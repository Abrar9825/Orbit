const bcrypt = require('bcryptjs');
const OrbitUser = require('../models/OrbitUser');

function sanitizePermissions(payload) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  return Object.entries(payload).reduce((acc, [pageId, value]) => {
    if (!pageId || typeof value !== 'object' || value === null) {
      return acc;
    }

    acc[String(pageId)] = {
      create: Boolean(value.create),
      read: Boolean(value.read),
      update: Boolean(value.update),
      delete: Boolean(value.delete),
    };

    return acc;
  }, {});
}

function toPublicUser(userDoc) {
  const raw = userDoc.toObject({ flattenMaps: true });

  return {
    id: raw._id,
    _id: raw._id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    permissions: raw.permissions || {},
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

async function getUsers(req, res) {
  try {
    const users = await OrbitUser.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      message: 'Users fetched successfully',
      data: users.map(toPublicUser),
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await OrbitUser.findOne({ _id: id, isActive: true });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User fetched successfully',
      data: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role, permissions } = req.body;

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required',
      });
    }

    const existingUser = await OrbitUser.findOne({ email: cleanEmail, isActive: true });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    const user = await OrbitUser.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: role || 'User',
      permissions: sanitizePermissions(permissions),
    });

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: toPublicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, role, permissions } = req.body;

    const user = await OrbitUser.findOne({ _id: id, isActive: true });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (name !== undefined) {
      const cleanName = String(name || '').trim();
      if (!cleanName) {
        return res.status(400).json({ status: 'error', message: 'Name cannot be empty' });
      }
      user.name = cleanName;
    }

    if (email !== undefined) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail) {
        return res.status(400).json({ status: 'error', message: 'Email cannot be empty' });
      }

      if (cleanEmail !== user.email) {
        const existing = await OrbitUser.findOne({ email: cleanEmail, isActive: true });
        if (existing) {
          return res.status(409).json({
            status: 'error',
            message: 'User with this email already exists',
          });
        }
      }

      user.email = cleanEmail;
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (permissions !== undefined) {
      user.permissions = sanitizePermissions(permissions);
    }

    if (password !== undefined && String(password).trim() !== '') {
      user.passwordHash = await bcrypt.hash(String(password), 10);
    }

    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: toPublicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await OrbitUser.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
