const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');

//  Génération du token JWT
const genererToken = (utilisateur) => {
  return jwt.sign(
    {
      id: utilisateur._id,
      role: utilisateur.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

//  Inscription
exports.inscription = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;

    // Vérifier si l'email existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    // Créer et sauvegarder l'utilisateur
    const nouvelUtilisateur = new Utilisateur({ nom, email, motDePasse, role });
    await nouvelUtilisateur.save();

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
};

//  Connexion
exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si le compte est actif
    if (!utilisateur.actif) {
      return res.status(403).json({ message: 'Compte inactif.' });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer le token
    const token = genererToken(utilisateur);

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
};
