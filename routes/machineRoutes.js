const express = require('express');
const {
  createMachine,
  createMachinesBulk,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
  getMachinesByProcessType,
} = require('../controllers/machineController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create multiple machines in bulk - requires canCreate permission
router.post(
  '/bulk',
  permissionMiddleware('Machine Management', 'canCreate'),
  createMachinesBulk
);

// Create single machine - requires canCreate permission
router.post(
  '/',
  permissionMiddleware('Machine Management', 'canCreate'),
  createMachine
);

// Get all machines - requires canView permission
router.get(
  '/',
  permissionMiddleware('Machine Management', 'canView'),
  getAllMachines
);

// Get machines by process type - requires canView permission
router.get(
  '/process-type/:procesType',
  permissionMiddleware('Machine Management', 'canView'),
  getMachinesByProcessType
);

// Get machine by ID - requires canView permission
router.get(
  '/:id',
  permissionMiddleware('Machine Management', 'canView'),
  getMachineById
);

// Update machine - requires canEdit permission
router.put(
  '/:id',
  permissionMiddleware('Machine Management', 'canEdit'),
  updateMachine
);

// Delete machine - requires canDelete permission
router.delete(
  '/:id',
  permissionMiddleware('Machine Management', 'canDelete'),
  deleteMachine
);

module.exports = router;
