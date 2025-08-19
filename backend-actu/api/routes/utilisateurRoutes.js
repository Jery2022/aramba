const express = require('express');

const router = express.Router();
const utilisateurController = require('../controllers/utilisateursController');
const verify = require('../middlewares/verifyToken');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');

router.post('/register', utilisateurController.register);
router.post('/login', utilisateurController.login);
router.get('/me', verify, checkActif, utilisateurController.getProfile);
router.put('/me', verify, checkActif, utilisateurController.updateProfile);
router.get('/admin/utilisateurs', verify, checkActif, checkRole('admin'), utilisateurController.getAll);
router.get('/admin/utilisateurs/:id', verify, checkActif, checkRole('admin'), utilisateurController.getById);
router.put('/admin/utilisateurs/:id', verify, checkActif, checkRole('admin'), utilisateurController.update);
router.delete('/admin/utilisateurs/:id', verify, checkActif, checkRole('admin'), utilisateurController.remove);
router.post('/admin/utilisateurs/:id/reset-password', verify, checkActif, checkRole('admin'), utilisateurController.resetPassword);
router.post('/admin/utilisateurs', verify, checkActif, checkRole('admin'), utilisateurController.create);
router.put('/admin/utilisateurs/:id/role', verify, checkActif, checkRole('admin'), utilisateurController.updateRole);
router.put('/admin/utilisateurs/:id/preferences', verify, checkActif, checkRole('admin'), utilisateurController.updatePreferences);
router.put('/admin/utilisateurs/:id/actif', verify, checkActif, checkRole('admin'), utilisateurController.toggleActif);

module.exports = router;
