const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  actualite: { type: mongoose.Schema.Types.ObjectId, ref: 'Actualite', required: true },
  auteur: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commentaire', commentaireSchema);