const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./../api/models/Utilisateur'); // Assure-toi que le chemin est correct
require('dotenv').config();

console.log('✅ URI chargée :', process.env.MONGO_URI);


(async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB réussie');

    // Hachage des mots de passe
    const motDePasse = 'motdepasse123';
    const hashedPasswords = await Promise.all([
      bcrypt.hash(motDePasse, 10),
      bcrypt.hash(motDePasse, 10),
      bcrypt.hash(motDePasse, 10),
      bcrypt.hash(motDePasse, 10),
      bcrypt.hash(motDePasse, 10)
    ]);

    // Insertion des utilisateurs
    const utilisateurs = [
      {
        nom: "Yves Mavoungou",
        email: "yves@entreprise.com",
        motDePasse: hashedPasswords[0],
        role: "admin",
        actif: true
      },
      {
        nom: "Claire Ndong",
        email: "claire.rh@entreprise.com",
        motDePasse: hashedPasswords[1],
        role: "rh",
        actif: true
      },
      {
        nom: "Jean Koumba",
        email: "jean.it@entreprise.com",
        motDePasse: hashedPasswords[2],
        role: "employe",
        actif: true
      },
      {
        nom: "Fatou Diouf",
        email: "fatou@entreprise.com",
        motDePasse: hashedPasswords[3],
        role: "employe",
        actif: false
      },
      {
        nom: "Marc Essono",
        email: "marc@entreprise.com",
        motDePasse: hashedPasswords[4],
        role: "rh",
        actif: true
      }
    ];

    await Utilisateur.insertMany(utilisateurs);
    console.log('✅ Utilisateurs insérés avec succès');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Erreur lors de l’insertion :', err);
    mongoose.connection.close();
  }
})();
