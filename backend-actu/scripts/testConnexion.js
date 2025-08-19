// scripts/testConnexion.js

const mongoose = require('mongoose');
const config = require('../config/config.js'); 
(async () => {
  try {
    console.log('🔌 Tentative de connexion à MongoDB...');
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connexion réussie à MongoDB');

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('📭 Aucune collection trouvée dans la base.');
    } else {
      console.log('📚 Collections présentes :');
      collections.forEach((col) => console.log(`- ${col.name}`));
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Erreur de connexion :', err.message);
    process.exit(1);
  }
})();
