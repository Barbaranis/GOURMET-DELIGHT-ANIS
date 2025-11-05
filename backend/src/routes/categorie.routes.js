// backend/src/routes/categorie.routes.js


const router = require('express').Router();
const { getAll } = require('../controllers/categorie.controller');

// public (pas d'auth nécessaire pour lister)
router.get('/', getAll);

module.exports = router;
