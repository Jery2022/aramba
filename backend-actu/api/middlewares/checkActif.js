const Utilisateur = require('../models/Utilisateur');

module.exports = async function (req, res, next) {
  try {
    // Vérifie que req.user existe et contient un ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Recherche l'utilisateur dans la base
    const utilisateur = await Utilisateur.findById(req.user.id || req.user._id);

    // Vérifie l'existence et l'état actif
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!utilisateur.actif) {
      return res.status(403).json({ message: 'Votre compte est inactif' });
    }

    // Si tout est bon, on continue
    next();
  } catch (err) {
    console.error('Erreur middleware checkCompteActif:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
