const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Utilisateur = require('../models/Utilisateur');

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

router.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API de gestion des actualités d’entreprise 🚀' });
});

router.get('/api/auth', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API d’authentification 🚀' });
});

router.post('/api/auth/inscription', (req, res) => {
  res.json({ message: 'Inscription réussie' });
});

router.post('/api/auth/connexion', (req, res) => {
  res.json({ message: 'Connexion réussie' });
});

router.post('/api/auth/deconnexion', (req, res) => {
  res.json({ message: 'Déconnexion réussie' }); 
});

module.exports = router;