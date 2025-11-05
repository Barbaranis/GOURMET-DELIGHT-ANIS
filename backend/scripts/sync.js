// scripts/sync.js
const sequelize = require('../src/config/db');
const Utilisateur = require('../src/models/utilisateur.model');
const Chef = require('../src/models/chef.model');
const Categorie = require('../src/models/categorie.model');
const Plat = require('../src/models/plat.model');
const Avis = require('../src/models/avis.model');
const Reservation = require('../src/models/reservation.model');
const Contact = require('../src/models/contact.model');




(async () => {
  try {
    await sequelize.sync({ force: true }); // ⚠️ force: true supprime et recrée les tables
    console.log('✅ Tables synchronisées avec succès !');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des tables :', error);
    process.exit(1);
  }
})();

