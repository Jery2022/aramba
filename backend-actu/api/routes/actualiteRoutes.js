const express = require('express');

const router = express.Router();
const actualiteController = require('../controllers/actualitesController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');

// Mise à jour d’une actualité (admin ou RH ou auteur)
router.put('/:id', verify, checkActif, checkRole(['admin', 'rh', 'employe']), actualiteController.update);

// Suppression d’une actualité (admin ou RH uniquement)
router.delete('/:id', verify, checkActif, checkRole(['admin', 'rh']), actualiteController.remove);

router.get('/', verify, checkActif, actualiteController.getAllActualites);
router.get('/:id', verify, checkActif, actualiteController.getById);
router.get('/search/tag', verify, checkActif, actualiteController.searchByTag);
router.get('/search/filtre', verify, checkActif, actualiteController.searchByFiltre); 
router.post('/', verify, checkActif, actualiteController.create);
router.post('/:id/valider', verify, checkActif, checkRole('rh'), actualiteController.validate);

module.exports = router;
