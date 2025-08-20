const express = require('express');

const router = express.Router();
const utilisateurController = require('../controllers/utilisateursController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');

router.get('/me', verify, checkActif, utilisateurController.getProfile);
router.put('/me', verify, checkActif, utilisateurController.updateProfile);
router.get('/', verify, checkActif, checkRole('admin'), utilisateurController.getAll);
router.get('/:id', verify, checkActif, checkRole('admin'), utilisateurController.getById);
router.post('/register', utilisateurController.register);
router.post('/login', utilisateurController.login);
router.post('/:id/reset-password', verify, checkActif, checkRole('admin'), utilisateurController.resetPassword);
router.post('/', verify, checkActif, checkRole('admin'), utilisateurController.create);
router.put('/:id', verify, checkActif, checkRole('admin'), utilisateurController.update);
router.put('/:id/role', verify, checkActif, checkRole('admin'), utilisateurController.updateRole);
router.put('/:id/preferences', verify, checkActif, checkRole('admin'), utilisateurController.updatePreferences);
router.put('/:id/actif', verify, checkActif, checkRole('admin'), utilisateurController.toggleActif);
router.delete('/:id', verify, checkActif, checkRole('admin'), utilisateurController.remove);

module.exports = router; 
