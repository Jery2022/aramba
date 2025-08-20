const express = require('express');

const router = express.Router();
//const { checkValidation } = require('../controllers/commentaireController');
//const { createCommentaireRules } = require('../validations/commentaire');
const commentaireController = require('../controllers/commentairesController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');  

// Mise à jour d’un commentaire (admin ou RH)
router.put('/:id', verify, checkActif, checkRole(['admin', 'rh']), commentaireController.update);

// Suppression d’un commentaire (admin ou RH)
router.delete('/:id', verify, checkActif, checkRole(['admin', 'rh']), commentaireController.remove);


// Récupération des commentaires d’une actualité (utilisateur authentifié)
router.get('/', verify, checkActif, commentaireController.getAll); // Récupération de tous les commentaires
router.get('/:id', verify, checkActif, commentaireController.getCommentairesById); // Récupération de tous les commentaires de l'Actualité avec l'ID spécifié

// Ajout d’un commentaire (utilisateur authentifié)
router.post('/:id', verify, checkActif, commentaireController.create); // Création d'un nouveau commentaire

module.exports = router;
