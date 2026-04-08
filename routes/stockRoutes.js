const express = require('express');
const {
  createStock,
  getAllStock,
  getStockById,
  updateStock,
  addStockMovement,
  getReorderSuggestions,
  deleteStock,
} = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create stock (supports openingQty) - requires canCreate permission
router.post(
  '/',
  permissionMiddleware('Stock Management', 'canCreate'),
  createStock
);

// Get stock list - requires canView permission
router.get(
  '/',
  permissionMiddleware('Stock Management', 'canView'),
  getAllStock
);

// Get reorder suggestions - requires canView permission
router.get(
  '/reorder-suggestions',
  permissionMiddleware('Stock Management', 'canView'),
  getReorderSuggestions
);

// Get stock by ID - requires canView permission
router.get(
  '/:id',
  permissionMiddleware('Stock Management', 'canView'),
  getStockById
);

// Update stock settings (supports openingQty) - requires canEdit permission
router.put(
  '/:id',
  permissionMiddleware('Stock Management', 'canEdit'),
  updateStock
);

// Add stock movement - requires canEdit permission
router.post(
  '/:id/movements',
  permissionMiddleware('Stock Management', 'canEdit'),
  addStockMovement
);

// Delete stock - requires canDelete permission
router.delete(
  '/:id',
  permissionMiddleware('Stock Management', 'canDelete'),
  deleteStock
);

module.exports = router;
