const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Utilisateur = require('../models/Utilisateur');
const authController = require('../controllers/authController');
const verify = require('../middlewares/verify');
const checkActif = require('../middlewares/checkActif');
const checkRole = require('../middlewares/checkRole');


// Route pour vérifier l'authentification
router.get('/verifier', verify, checkActif, (req, res) => {
    res.json({ message: 'Utilisateur authentifié' });
});

// Route pour vérifier le rôle de l'utilisateur
router.get('/role', verify, checkActif, checkRole(['admin', 'rh']), (req, res) => {
    res.json({ message: 'Utilisateur avec le rôle requis' });
});

// Route pour la déconnexion
router.post('/deconnexion', verify, checkActif, (req, res) => { 
    res.json({ message: 'Déconnexion réussie' });
});
    
// Route pour l'inscription
router.post('/inscription', authController.inscription);

// Route pour la connexion
router.post('/connexion', authController.connexion);


router.post('/mot-de-passe-oublie', async (req, res) => {
  const { email } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(200).json({ message: 'Si cet email existe, un lien a été envoyé.' });

    const token = crypto.randomBytes(32).toString('hex');
    utilisateur.resetToken = token;
    utilisateur.resetTokenExpire = Date.now() + 3600000; // 1h
    await utilisateur.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset/${token}`;
    const mailOptions = {
      to: utilisateur.email,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Bonjour ${utilisateur.nom},</p>
             <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Ce lien expire dans 1 heure.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/reset', async (req, res) => {
  const { token, motDePasse } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });
    if (!utilisateur) return res.status(400).json({ message: 'Lien invalide ou expiré' });

    utilisateur.motDePasse = motDePasse;
    utilisateur.resetToken = undefined;
    utilisateur.resetTokenExpire = undefined;
    await utilisateur.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/profil', verify, checkActif, (req, res) => {
    res.json({ message: 'Informations du profil utilisateur' });
});

// Route pour obtenir le token CSRF
router.get('/csrf-token', (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

//Routes test API Authentification
// router.get('/api', (req, res) => {
//   res.json({ message: 'Bienvenue sur l’API de gestion des actualités d’entreprise 🚀' });
// });

// router.get('/auth', (req, res) => {
//   res.json({ message: 'Bienvenue sur l’API d’authentification 🚀' });
// });

// router.post('/inscription', (req, res) => {
//   res.json({ message: 'Inscription réussie' });
// });

// router.post('/connexion', (req, res) => {
//   res.json({ message: 'Connexion réussie' });
// });

// router.post('/deconnexion', (req, res) => {
//   res.json({ message: 'Déconnexion réussie' }); 
//  });

module.exports = router;
