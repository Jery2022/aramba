const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription
router.post('/inscription', authController.inscription);

// Route pour la connexion
router.post('/connexion', authController.connexion);

module.exports = router;
