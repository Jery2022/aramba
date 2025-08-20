const Actualite = require('../models/Actualite');
const Utilisateur = require('../models/Utilisateur');
const Commentaire = require('../models/Commentaire');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalActualites = await Actualite.countDocuments();
    const actualitesValidees = await Actualite.countDocuments({ statutValidation: true });
    const tauxValidation = totalActualites > 0 ? Math.round((actualitesValidees / totalActualites) * 100) : 0;

    const utilisateursActifs = await Utilisateur.countDocuments({ actif: true });
    const commentairesEnAttente = await Commentaire.countDocuments();

    const actualitesParMois = await Actualite.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: 1 }
        }
      }
    ]);

    const actualitesParTag = await Actualite.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          total: { $sum: 1 }
        }
      }
    ]);

    const actualitesParAuteur = await Actualite.aggregate([
      {
        $group: {
          _id: '$auteur',
          total: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalActualites,
      tauxValidation,
      utilisateursActifs,
      commentairesEnAttente,
      actualitesParMois,
      actualitesParTag,
      actualitesParAuteur
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement du dashboard', error });
  }
};