const express = require('express');
const {
  getPartTemplates,
  createPart,
  getAllParts,
  getPartById,
  searchParts,
  updatePart,
  deletePart,
} = require('../controllers/partsController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create part - requires canCreate permission
router.post(
  '/',
  permissionMiddleware('Parts Management', 'canCreate'),
  createPart
);

// Get all parts - requires canView permission
router.get(
  '/',
  permissionMiddleware('Parts Management', 'canView'),
  getAllParts
);

// Search parts - requires canView permission
router.get(
  '/templates',
  permissionMiddleware('Parts Management', 'canView'),
  getPartTemplates
);

router.get(
  '/search',
  permissionMiddleware('Parts Management', 'canView'),
  searchParts
);

// Get part by ID - requires canView permission
router.get(
  '/:id',
  permissionMiddleware('Parts Management', 'canView'),
  getPartById
);

// Update part - requires canEdit permission
router.put(
  '/:id',
  permissionMiddleware('Parts Management', 'canEdit'),
  updatePart
);

// Delete part - requires canDelete permission
router.delete(
  '/:id',
  permissionMiddleware('Parts Management', 'canDelete'),
  deletePart
);

module.exports = router;
