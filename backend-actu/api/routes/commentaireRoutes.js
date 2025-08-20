const express = require('express');

const router = express.Router();
const commentaireController = require('../controllers/commentairesController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');  

// Mise à jour d’un commentaire (admin ou RH)
router.put('/:id', verify, checkActif, checkRole(['admin', 'rh']), commentaireController.update);

// Suppression d’un commentaire (admin ou RH)
router.delete('/:id', verify, checkActif, checkRole(['admin', 'rh']), commentaireController.remove);
// Ajout d’un commentaire (utilisateur authentifié)
router.post('/:id/ajouter', verify, checkActif, commentaireController.create);
// Récupération des commentaires d’une actualité (utilisateur authentifié)
router.get('/:id/commentaires', verify, checkActif, commentaireController.getAll);
// Routes pour les commentaires
router.get('/', verify, checkActif, commentaireController.getAll); // Récupération de tous les commentaires
router.post('/', verify, checkActif, commentaireController.create); // Création d'un nouveau commentaire
// Route pour ajouter un commentaire à une actualité spécifique
router.post('/:id/ajouter', verify, checkActif, commentaireController.create);
// Route pour récupérer les commentaires d'une actualité spécifique
router.get('/:id/commentaires', verify, checkActif, commentaireController.getAll);

router.post('/:id', verify, checkActif, commentaireController.create);
router.get('/:id', verify, checkActif, commentaireController.getAll);

module.exports = router;
