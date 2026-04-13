const express = require('express');
const authRoutes = require('./authRoutes');
const bomRoutes = require('./bomRoutes');
const machineRoutes = require('./machineRoutes');
const partsRoutes = require('./partsRoutes');
const masterConfigRoutes = require('./masterConfigRoutes');
const stockRoutes = require('./stockRoutes');
const userRoutes = require('./userRoutes');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', healthCheck);

router.use('/auth', authRoutes);
router.use('/parts', partsRoutes);
router.use('/bom', bomRoutes);
router.use('/machine', machineRoutes);
router.use('/stock', stockRoutes);
router.use('/config-master', masterConfigRoutes);
router.use('/users', userRoutes);

module.exports = router;
