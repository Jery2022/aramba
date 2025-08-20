const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'rh', 'employe'],
    default: 'employe'
  },
  actif: {
    type: Boolean,
    default: true
  },
  resetToken: {
    type: String,
    //default: null
  },
  resetTokenExpire: {
    type: Date,
   // default: null
  }
}, {
  timestamps: true
});

// Hachage automatique du mot de passe avant sauvegarde
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Méthode pour comparer les mots de passe
utilisateurSchema.methods.verifierMotDePasse = async function (motDePassePlain) {
  return await bcrypt.compare(motDePassePlain, this.motDePasse);
};

// Méthode pour mettre à jour le rôle de l'utilisateur
utilisateurSchema.methods.mettreAJourRole = async function (nouveauRole) {
  this.role = nouveauRole;
  return await this.save();
};

// Methode pour retrouver et mettre à jour les données de l'utilisateur
utilisateurSchema.methods.findByIdAndUpdate = async function (id, updateData) {
  const utilisateur = await this.model('Utilisateur').findByIdAndUpdate(
    id, 
    updateData,
    { new: true }
  );
  return utilisateur;
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);

