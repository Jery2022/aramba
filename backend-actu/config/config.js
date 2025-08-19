const dotenv = require('dotenv');
dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'PORT'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Variable d'environnement manquante : ${key}`);
    process.exit(1); // Arrête l'exécution si une variable est absente
  }
});

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  logLevel: process.env.LOG_LEVEL || 'dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
};
