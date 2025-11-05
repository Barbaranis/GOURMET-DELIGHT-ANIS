// backend/src/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');


// ✅ Charge le .env DU BACKEND (un niveau au-dessus de /src)
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});


// 🔎 Logs de contrôle
console.log('🔐 DB_PASSWORD =', process.env.DB_PASSWORD);
console.log('🌐 DB_HOST =', process.env.DB_HOST);
console.log('🔌 DB_PORT =', process.env.DB_PORT);


// ✅ Connexion Sequelize (avec valeurs par défaut sûres)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'gourmetdb',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false,
  }
);


// ✅ Test de connexion
sequelize
  .authenticate()
  .then(() => console.log('✅ Connexion à la base PostgreSQL réussie.'))
  .catch((err) => console.error('❌ Erreur de connexion à la base :', err));


module.exports = sequelize;


