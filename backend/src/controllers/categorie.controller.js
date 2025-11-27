 // backend/src/controllers/categorie.controller.js





const db = require('../models');
const Categorie = db.Categorie;

// GET /api/categories
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

// GET /api/categories/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await Categorie.findByPk(id, {
      attributes: ['id_categorie', 'nom'],
    });

    if (!cat) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.json(cat);
  } catch (e) {
    console.error('Erreur getOne categorie:', e);
    res.status(500).json({ message: "Erreur récupération catégorie" });
  }
};

// POST /api/categories
exports.create = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom || nom.trim() === '') {
      return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }

    const nouvelleCategorie = await Categorie.create({
      nom: nom.trim(),
    });

    return res.status(201).json(nouvelleCategorie);
  } catch (e) {
    console.error('Erreur create categorie:', e);
    res.status(500).json({ message: "Erreur création catégorie" });
  }
};

// PUT /api/categories/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    const cat = await Categorie.findByPk(id);

    if (!cat) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    if (nom && nom.trim() !== '') {
      cat.nom = nom.trim();
    }

    await cat.save();

    res.json(cat);
  } catch (e) {
    console.error('Erreur update categorie:', e);
    res.status(500).json({ message: "Erreur mise à jour catégorie" });
  }
};

// DELETE /api/categories/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await Categorie.findByPk(id);

    if (!cat) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await cat.destroy();

    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (e) {
    console.error('Erreur remove categorie:', e);
    res.status(500).json({ message: "Erreur suppression catégorie" });
  }
};

