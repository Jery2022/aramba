const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
  auteur: { type: String, required: true },
  commentaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire' }],
  statutValidation: { type: Boolean, default: false },
  tags: [String],
  filtre: String
});

module.exports = mongoose.model('Actualite', actualiteSchema);