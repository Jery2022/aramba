// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');

// Chargement des variables d'environnement
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// Vérification des variables critiques
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
});
console.log('🔍 MONGO_URI =', process.env.MONGO_URI);

// Initialisation de l'application
const app = express();

// Middlewares globaux
app.use(cors());
app.use(morgan(process.env.LOG_LEVEL || 'dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Injection du token CSRF dans les vues
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Import des routes
const actualiteRoutes = require('./api/routes/actualiteRoutes.js');
const authRoutes = require('./api/routes/authRoutes.js');
const commentaireRoutes = require('./api/routes/commentaireRoutes.js');  
const dashboardRoutes = require('./api/routes/dashboardRoutes.js');  
const statistiquesRoutes = require('./api/routes/statistiquesRoutes');

// Définition des routes API
app.use('/api', express.json()); // Middleware pour parser le JSON dans les requêtes
app.use('/api', express.urlencoded({ extended: true })); // Middleware pour parser les données
app.use('/api/auth', authRoutes);
app.use('/api/actualites', actualiteRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des actualités d’entreprise 🚀');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée :', err);
  res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
});

// Configuration du dossier public pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));  
// Route pour servir le fichier index.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour servir le fichier dashboard.html
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Serveur démarré sur le port ${PORT} `);
});
