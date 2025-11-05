const bcrypt = require('bcrypt');
const Utilisateur = require('./models/utilisateur.model');
const sequelize = require('./config/db');

const seedAdmin = async () => {
  try {
    await sequelize.sync(); // assure la connexion

    const adminExiste = await Utilisateur.findOne({ where: { email: 'admin@example.com' } });

    if (adminExiste) {
      console.log('⚠️ Admin déjà existant.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await Utilisateur.create({
      nom: 'Admin',
      prenom: 'Test',
      email: 'admin@example.com',
      mot_de_passe: hashedPassword,
      role: 'admin',
      telephone: '0600000000'
    });

    console.log('✅ Admin créé avec succès.');
    console.log('🔐 Identifiants :');
    console.log('   Email : admin@example.com');
    console.log('   Mot de passe : admin123');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin :', error);
  } finally {
    await sequelize.close(); // optionnel pour fermer la connexion
  }
};

seedAdmin();
