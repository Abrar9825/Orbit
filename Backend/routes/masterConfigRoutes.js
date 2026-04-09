const express = require('express');
const {
	getConfigMaster,
	addConfigMasterValue,
} = require('../controllers/masterConfigController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getConfigMaster);
router.post('/options', addConfigMasterValue);

module.exports = router;
