 // backend/src/controllers/categorie.controller.js








const db = require('../models');
const Categorie = db.Categorie;


exports.getAll = async (_req, res) => {
  try {
    const cats = await Categorie.findAll({
      attributes: ['id_categorie', 'nom'],
      order: [['id_categorie', 'ASC']],
    });
    res.json(cats);
  } catch (e) {
    console.error('Erreur getAll categories:', e);
    res.status(500).json({ message: "Erreur récupération catégories" });
  }
};

