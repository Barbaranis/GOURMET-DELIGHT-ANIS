// backend/scripts/seedCategories.js
const db = require('../src/models');


(async () => {
  try {
    const { Categorie, sequelize } = db;


    const data = [
      { id_categorie: 1, nom: 'Entrée' },
      { id_categorie: 2, nom: 'Plat' },
      { id_categorie: 3, nom: 'Dessert' },
      { id_categorie: 4, nom: 'Boisson' },
    ];


    // upsert par id_categorie
    for (const c of data) {
      await Categorie.upsert(c);
    }


    console.log('✅ Catégories seedées avec succès.');
  } catch (e) {
    console.error('❌ Seed catégories échoué :', e);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
})();





