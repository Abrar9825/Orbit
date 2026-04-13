const express = require('express');
const {
	getConfigMaster,
	addConfigMasterValue,
	updateConfigMaster,
	removeConfigMasterValue,
} = require('../controllers/masterConfigController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getConfigMaster);
router.put('/', updateConfigMaster);
router.post('/options', addConfigMasterValue);
router.delete('/options', removeConfigMasterValue);

module.exports = router;
