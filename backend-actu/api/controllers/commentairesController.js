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
      actualite: req.params.id,
      auteur: req.utilisateur.nom,
      contenu: req.body.contenu
    });
    await nouveauCommentaire.save();
    res.status(201).json(nouveauCommentaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const commentaires = await Commentaire.find({ actualite: req.params.id });
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};