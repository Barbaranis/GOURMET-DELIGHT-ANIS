//index.js


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// ✅ On importe directement l'instance Sequelize déjà configurée
const sequelize = require('../config/db.js');

const db = {};

// ✅ Chargement dynamique des modèles
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.model.js') && file !== basename)
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, file));
    if (typeof modelDefiner === 'function') {
      const model = modelDefiner(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

// ✅ Associations (si présentes dans les modèles)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
