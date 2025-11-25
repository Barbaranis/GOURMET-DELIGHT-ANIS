// backend/src/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');


// ✅ Charge le .env du backend (un niveau au-dessus de /src)
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});


let sequelize;


// -------------------------------------
// 1️⃣ En prod : Render → RENDER_DATABASE_URL
// -------------------------------------
if (process.env.RENDER_DATABASE_URL) {
  console.log('🔗 Connexion via Render (RENDER_DATABASE_URL)');


  sequelize = new Sequelize(process.env.RENDER_DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // SSL Render
      },
    },
  });


} else {
  // -------------------------------------
  // 2️⃣ En local : variables classiques
  // -------------------------------------
  console.log('🟡 Connexion locale PostgreSQL');
  console.log('🌐 DB_HOST =', process.env.DB_HOST);
  console.log('🔌 DB_PORT =', process.env.DB_PORT);


  sequelize = new Sequelize(
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
}


// ✅ Test de connexion
sequelize
  .authenticate()
  .then(() => console.log('✅ Connexion PostgreSQL réussie.'))
  .catch((err) => console.error('❌ Erreur de connexion à la base :', err));


module.exports = sequelize;



