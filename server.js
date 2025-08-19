// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./backend-actu/config/config.js');




// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application
const app = express();

// Middlewares globaux
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());



// Connexion à MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Import des routes
const actualiteRoutes = require('./backend-actu/api/routes/actualiteRoutes');
const authRoutes = require('./backend-actu/api/routes/authRoutes');
const commentaireRoutes = require('./backend-actu/api/routes/commentaireRoutes'); // si séparé
const dashboardRoutes = require('./backend-actu/api/routes/dashboardRoutes'); // pour RH
const statistiquesRoutes = require('./routes/statistiquesRoutes');


// Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api/actualites', actualiteRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des actualités d’entreprise 🚀');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Serveur démarré sur le port ${PORT}`);
});
