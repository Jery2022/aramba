const Actualite = require('../models/Actualite');

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, tags, filtre } = req.body;

    const actualite = await Actualite.findById(id);
    if (!actualite) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }

    actualite.titre = titre || actualite.titre;
    actualite.contenu = contenu || actualite.contenu;
    actualite.tags = tags || actualite.tags;
    actualite.filtre = filtre || actualite.filtre;

    await actualite.save();

    res.status(200).json({ message: 'Actualité mise à jour', data: actualite });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const actualite = await Actualite.findByIdAndDelete(id);
    if (!actualite) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }

    res.status(200).json({ message: 'Actualité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


exports.getAll = async (req, res) => {
  try {
    const actualites = await Actualite.find().populate('commentaires');
    res.status(200).json(actualites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.create = async (req, res) => {
  try {
    const nouvelleActualite = new Actualite(req.body);
    await nouvelleActualite.save();
    res.status(201).json(nouvelleActualite);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const actualite = await Actualite.findById(id).populate('commentaires');
    if (!actualite) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }
    res.status(200).json(actualite);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.validate = async (req, res) => {
  try {
    const actualite = await Actualite.findByIdAndUpdate(req.params.id, { statutValidation: true }, { new: true });
    res.status(200).json(actualite);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.searchByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    const actualites = await Actualite.find({ tags: tag });
    res.status(200).json(actualites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.searchByFiltre = async (req, res) => {
  try {
    const { filtre } = req.query;
    const actualites = await Actualite.find({ filtre });
    res.status(200).json(actualites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

