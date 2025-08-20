// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');  
const csrf = require('csurf');  

// Chargement des variables d'environnement
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// Vérification des variables critiques
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
});

// Initialisation de l'application
const app = express();

// Middlewares globaux
app.use(cors());
app.use(morgan(process.env.LOG_LEVEL || 'dev'));

// Middlewares pour le parsing des corps de requêtes
app.use(express.json()); // Pour les requêtes avec Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // Pour les requêtes avec Content-Type: application/x-www-form-urlencoded

// Middlewares pour la gestion des sessions et cookies
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,  
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 heure
    }
}));

// Middleware CSRF
const csrfProtection = csrf({ cookie: true });

// Définition des routes avec protection CSRF
app.use('/api', csrfProtection, (req, res, next) => {
    // Le jeton CSRF est accessible via req.csrfToken()
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err);
    process.exit(1); // Arrête le processus en cas d'échec
  });

// Import et définition des routes API
const authRoutes = require('./api/routes/authRoutes');
const actualiteRoutes = require('./api/routes/actualiteRoutes');
const utilisateurRoutes = require('./api/routes/utilisateurRoutes');
const commentaireRoutes = require('./api/routes/commentaireRoutes');
const statistiquesRoutes = require('./api/routes/statistiquesRoutes');
const dashboardRoutes = require('./api/routes/dashboardRoutes');

// Définition des routes
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/actualites', actualiteRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api', utilisateurRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);  
app.use('/api/admin', dashboardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth/connexion', authRoutes);

// Route de test
app.get('/api', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des actualités d’entreprise 🚀');
});

// Configuration pour servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Gestion des erreurs 404 (doit être placée après toutes les routes)
app.use((req, res) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

// Gestion des erreurs globales (doit être placée à la fin)
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée :', err);
  res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Serveur démarré sur le port ${PORT}`);
});