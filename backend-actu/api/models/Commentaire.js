const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  actualite: { type: mongoose.Schema.Types.ObjectId, ref: 'Actualite', required: true },
  auteur: { type: String, required: true },
  contenu: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500
  },
  date: { type: Date, default: Date.now },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

commentaireSchema.index({ actualite: 1, date: -1 });

module.exports = mongoose.model('Commentaire', commentaireSchema);