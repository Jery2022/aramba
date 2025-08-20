const express = require('express');
const router = express.Router();
const statistiquesController = require('../controllers/statistiquesController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');

router.get('/', verify, checkActif, statistiquesController.getStats);

// Route test API pour les statistiques
router.get('/api/statistiques', (req, res) => {
  res.json({ message: 'Statistiques des actualités' });
});

module.exports = router;
