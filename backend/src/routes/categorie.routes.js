const router = require('express').Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require('../controllers/categorie.controller');

// Lister toutes les catégories
router.get('/', getAll);

// Lire une catégorie par id
router.get('/:id', getOne);

// Créer une catégorie
router.post('/', create);

// Modifier une catégorie
router.put('/:id', update);

// Supprimer une catégorie
router.delete('/:id', remove);

module.exports = router;
