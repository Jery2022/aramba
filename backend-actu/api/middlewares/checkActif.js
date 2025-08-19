const Utilisateur = require('../models/Utilisateur');

module.exports = async function(req, res, next) {
  try {
    const utilisateur = await Utilisateur.findById(req.user._id);
    if (!utilisateur || !utilisateur.actif) return res.status(403).send('Compte inactif');
    next();
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};
