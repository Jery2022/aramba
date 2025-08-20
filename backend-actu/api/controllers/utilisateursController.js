const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const config = require('./../../config/config.js');  

exports.getAll = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await Utilisateur.findByIdAndDelete(id);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


exports.create = async (req, res) => {
 try {
 const { nom, email, motDePasse, role } = req.body;

    // Validation des champs
if (!nom || !email || !motDePasse) {
return res.status(400).json({ message: 'Nom, email et mot de passe sont requis.' });
}

const nouvelUtilisateur = new Utilisateur({ nom, email, motDePasse, role });
await nouvelUtilisateur.save();
res.status(201).json(nouvelUtilisateur);
} catch (error) {
console.error('Erreur lors de la création d\'un utilisateur :', error);
res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
};

exports.getById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.update = async (req, res) => {
try {
    // Créer un objet de mise à jour avec seulement les champs fournis
const updateData = {};
if (req.body.nom) updateData.nom = req.body.nom;
if (req.body.email) updateData.email = req.body.email;
if (req.body.role) updateData.role = req.body.role;

const utilisateur = await Utilisateur.findByIdAndUpdate(
req.params.id,
updateData,
{ new: true }
 );

 if (!utilisateur) {
   return res.status(404).json({ message: 'Utilisateur non trouvé' });
 }
 res.status(200).json(utilisateur);
} catch (error) {
 console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
  res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { motDePasse } = req.body;

    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      id,
      { motDePasse: hashedPassword },
      { new: true }
    );

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const utilisateur = await Utilisateur.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Rôle mis à jour avec succès', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const { preferences } = req.body;

    const utilisateur = await Utilisateur.findByIdAndUpdate(
      id,
      { preferences },
      { new: true }
    );

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Préférences mises à jour avec succès', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.toggleActif = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    utilisateur.actif = !utilisateur.actif;
    await utilisateur.save();
    res.status(200).json({ message: 'Statut actif mis à jour', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}

exports.register = async (req, res) => {
  try {
    const { email, motDePasse, role, nom, prenom } = req.body;

    // Vérification de l'existence de l'utilisateur
    const utilisateurExist = await Utilisateur.findOne({ email });
    if (utilisateurExist) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const nouvelUtilisateur = new Utilisateur({
      email,
      motDePasse: hashedPassword,
      role,
      nom,
      prenom,
      dateCreation: new Date(),
      statut: 'actif',
      preferences: {
        langue: 'fr',
        notifications: true
      }
    });
    await nouvelUtilisateur.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur: nouvelUtilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}

exports.login = async (req, res) => {
  try {
const { email, motDePasse } = req.body;

    // Vérification des champs requis
 if (!email || !motDePasse) {
 return res.status(400).json({ message: 'Email et mot de passe requis' });
 }

    // Recherche de l'utilisateur
 const utilisateur = await Utilisateur.findOne({ email });
 if (!utilisateur) {
 return res.status(401).json({ message: 'Email ou mot de passe incorrect' }); // Plus sécurisé de ne pas spécifier si l'email ou le mdp est faux
 }

    // Vérification du mot de passe
 const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
 if (!isMatch) {
 return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
 }

    // Mise à jour de la dernière connexion
    utilisateur.dateDerniereConnexion = new Date();
    await utilisateur.save();

    // Génération du token JWT
    const token = jwt.sign(
      { id: utilisateur._id, role: utilisateur.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Réponse structurée
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur._id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        role: utilisateur.role,
        preferences: utilisateur.preferences || {}
      }
    });
} catch (error) {
 console.error('❌ Erreur lors de la connexion :', error);
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
};


exports.getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({
      id: utilisateur._id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.role,
      preferences: utilisateur.preferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, preferences } = req.body;
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.utilisateur.id,
      { nom, prenom, preferences },
      { new: true }
    );
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({
      id: utilisateur._id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.role,
      preferences: utilisateur.preferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
