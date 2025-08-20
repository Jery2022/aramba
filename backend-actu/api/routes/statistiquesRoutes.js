const express = require('express');
const router = express.Router();
const statistiquesController = require('../controllers/statistiquesController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');

router.get('/', verify, checkActif, statistiquesController.getStats);

module.exports = router;
