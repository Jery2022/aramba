const express = require('express');

const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');

router.get('/stats', verify, checkActif, checkRole(['admin', 'rh']), dashboardController.getDashboardStats);

module.exports = router;