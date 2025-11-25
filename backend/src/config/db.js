// backend/src/config/db.js


const { Sequelize } = require('sequelize');
const path = require('path');


// ✅ Charge les variables d'environnement (.env local) — ignoré sur Render mais utile en local
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});


// 🔎 Logs de contrôle Render
console.log("🌐 DB_HOST =", process.env.DB_HOST);
console.log("🗄 DB_NAME =", process.env.DB_NAME);
console.log("👤 DB_USER =", process.env.DB_USER);
console.log("🔐 DB_PASSWORD =", process.env.DB_PASSWORD ? "(ok)" : "(manquant)");
console.log("🔌 DB_PORT =", process.env.DB_PORT);


// 🎯 Connexion sécurisée à PostgreSQL (Render + SSL obligatoire)
const sequelize = new Sequelize(
  process.env.DB_NAME,          // dbrender_xza6
  process.env.DB_USER,          // dbrender_xza6_user
  process.env.DB_PASSWORD,      // mot de passe Render
  {
    host: process.env.DB_HOST,  // ex: dpg-xxxxxx-a
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false,


    // 🎯 Render : SSL OBLIGATOIRE
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);


// 🔥 Test de connexion
sequelize.authenticate()
  .then(() => console.log('✅ PostgreSQL connecté avec succès sur Render !'))
  .catch(err => console.error('❌ Erreur de connexion PostgreSQL :', err));


module.exports = sequelize;

