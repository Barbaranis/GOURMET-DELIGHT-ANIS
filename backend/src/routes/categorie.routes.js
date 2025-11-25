// backend/src/routes/categorie.routes.js

const router = require('express').Router();
const {
  getAllCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categorie.controller');

// Auth middleware
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// -------------------------------------
// 📌 PUBLIC : récupérer toutes les catégories
// -> aucune authentification nécessaire
// -------------------------------------
router.get('/', getAllCategories);

// -------------------------------------
// 📌 ADMIN : créer une catégorie
// -------------------------------------
router.post('/', verifyToken, restrictTo('admin'), createCategory);

// -------------------------------------
// 📌 ADMIN : supprimer une catégorie
// -------------------------------------
router.delete('/:id', verifyToken, restrictTo('admin'), deleteCategory);

module.exports = router;

