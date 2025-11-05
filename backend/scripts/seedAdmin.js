// backend/scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');


// On récupère l'index des modèles (charge automatiquement Utilisateur, etc.)
const db = require('../src/models');


(async () => {
  try {
    // Optionnel : s’assurer que la connexion est OK
    await db.sequelize.authenticate();


    // ⚠️ Laisse sur false en prod. Utile si la table n’existe pas encore en dev.
    // await db.sequelize.sync({ alter: false });


    const email = 'admin@example.com';
    const password = 'admin123';
    const hashed = await bcrypt.hash(password, 10);


    const [admin, created] = await db.Utilisateur.findOrCreate({
      where: { email },
      defaults: {
        email,
        mot_de_passe: hashed,
        role: 'admin',
        nom: 'Admin',
        prenom: 'Gourmet'
      }
    });


    if (created) {
      console.log('✅ Admin créé :', email, '/ admin123');
    } else {
      console.log('ℹ️ Admin déjà présent :', admin.email);
    }


    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed admin :', err);
    process.exit(1);
  }
})();

