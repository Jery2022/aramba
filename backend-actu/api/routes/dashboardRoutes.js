const express = require('express');

const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');

// Routes test API liées au dashboard
router.get('/stats', verify, checkActif, checkRole(['admin', 'rh']), dashboardController.getDashboardStats);

router.get('/', (req, res) => {
  res.json({ message: 'Dashboard des actualités' });
});

router.get('/actualites', (req, res) => {
  res.json({ message: 'Liste des actualités pour le dashboard' });
});

router.get('/commentaires', (req, res) => {
  res.json({ message: 'Liste des commentaires pour le dashboard' });
});

router.get('/statistiques', (req, res) => {
  res.json({ message: 'Statistiques pour le dashboard' });
});

router.get('/graph', (req, res) => {
  res.json({ message: 'Graphiques pour le dashboard' });
});

// router.get('/', dashboardController.getDashboard);
// router.get('/actualites', dashboardController.getActualites);
// router.get('/commentaires', dashboardController.getCommentaires);
// router.get('/statistiques', dashboardController.getStatistiques);
// router.get('/graph', dashboardController.getGraphiques);


module.exports = router;