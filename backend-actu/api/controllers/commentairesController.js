const Commentaire = require('../models/Commentaire');


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenu } = req.body;

    const commentaire = await Commentaire.findById(id);
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    commentaire.contenu = contenu || commentaire.contenu;
    await commentaire.save();

    res.status(200).json({ message: 'Commentaire mis à jour', data: commentaire });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const commentaire = await Commentaire.findByIdAndDelete(id);
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.status(200).json({ message: 'Commentaire supprimé avec succès' }); 
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


exports.create = async (req, res) => {
  try {
    const nouveauCommentaire = new Commentaire({
      actualite: req.body.actualite,
      auteur: req.user.nom || req.body.auteur,
      contenu: req.body.contenu,
      date: req.body.date || new Date(),
      actif: true
    });

    if (!req.body.actualite || !req.body.contenu) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    await nouveauCommentaire.save();

    res.status(201).json(nouveauCommentaire);
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout du commentaire :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Récupération des commentaires d’une actualité
exports.getCommentairesById = async (req, res) => {

  const { actualiteId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(actualiteId)) {
    return res.status(400).json({ message: 'ID d’actualité invalide' });
  }

  try {
    const commentaires = await Commentaire.find({
      actualite: actualiteId,
      actif: true
    })
      .sort({ date: -1 }) // Tri du plus récent au plus ancien
      .skip(skip)
      .limit(limit);

    const total = await Commentaire.countDocuments({
      actualite: actualiteId,
      actif: true
    });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalCommentaires: total,
      commentaires
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const commentaires = await Commentaire.find({ actif: true })
      .sort({ date: -1 }) // Tri du plus récent au plus ancien
      .skip(skip)
      .limit(limit);

    const total = await Commentaire.countDocuments({ actif: true });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalCommentaires: total,
      commentaires
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


