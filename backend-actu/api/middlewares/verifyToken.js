const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

exports.authentifier = async function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const utilisateur = await Utilisateur.findById(decoded.id);
    if (!utilisateur || !utilisateur.actif) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide', error });
  }
};

exports.autoriserRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ message: 'Permission refusée' });
    }
    next();
  };
};



