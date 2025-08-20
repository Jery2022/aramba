const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization manquante ou mal formée' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const utilisateur = await Utilisateur.findById(decoded.id);
    if (!utilisateur || !utilisateur.actif) {
      return res.status(403).json({ message: 'Votre compte est inactif ou introuvable' });
    }

    req.user = utilisateur;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Utilisateur non authentifié', error: err.message });
  }
};
