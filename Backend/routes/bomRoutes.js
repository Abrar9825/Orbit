const express = require('express');
const {
  createBOM,
  getAllBOMs,
  getBOMById,
  searchBOMs,
  updateBOM,
  deleteBOM,
  addItemToBOM,
  removeItemFromBOM,
} = require('../controllers/bomController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create BOM - requires canCreate permission
router.post(
  '/',
  permissionMiddleware('BOM Management', 'canCreate'),
  createBOM
);

// Get all BOMs - requires canView permission
router.get(
  '/',
  permissionMiddleware('BOM Management', 'canView'),
  getAllBOMs
);

// Search BOMs - requires canView permission
router.get(
  '/search',
  permissionMiddleware('BOM Management', 'canView'),
  searchBOMs
);

// Get BOM by ID - requires canView permission
router.get(
  '/:id',
  permissionMiddleware('BOM Management', 'canView'),
  getBOMById
);

// Update BOM - requires canEdit permission
router.put(
  '/:id',
  permissionMiddleware('BOM Management', 'canEdit'),
  updateBOM
);

// Delete BOM - requires canDelete permission
router.delete(
  '/:id',
  permissionMiddleware('BOM Management', 'canDelete'),
  deleteBOM
);

// Add item to BOM - requires canEdit permission
router.post(
  '/:id/items',
  permissionMiddleware('BOM Management', 'canEdit'),
  addItemToBOM
);

// Remove item from BOM - requires canEdit permission
router.delete(
  '/:id/items/:itemId',
  permissionMiddleware('BOM Management', 'canEdit'),
  removeItemFromBOM
);

module.exports = router;
