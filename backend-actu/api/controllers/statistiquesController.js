const Actualite = require('../models/Actualite');
const Utilisateur = require('../models/Utilisateur');
const Commentaire = require('../models/Commentaire');

exports.getStats = async (req, res) => {
  try {
    const totalActualites = await Actualite.countDocuments();
    const actualitesValidees = await Actualite.countDocuments({ statutValidation: true });
    const tauxValidation = totalActualites > 0 ? Math.round((actualitesValidees / totalActualites) * 100) : 0;

    const commentairesEnAttente = await Commentaire.countDocuments();  
    const utilisateursActifs = await Utilisateur.countDocuments({ actif: true });

    res.status(200).json({
      totalActualites,
      tauxValidation,
      commentairesEnAttente,
      utilisateursActifs
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error });
  }
};
