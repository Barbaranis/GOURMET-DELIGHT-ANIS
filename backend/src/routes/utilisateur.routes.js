// 📁 src/routes/utilisateur.routes.js
const express = require('express');
const router = express.Router();

// --- Controllers
const {
  checkUtilisateurExistant,
  createUtilisateur,
  getAllUtilisateurs,
  deleteUtilisateur,
  getMessages,
  getAvis,
  repondreAvis,
  updatePageContent,
  createReservation,
  getAllReservations,
  getCurrentUtilisateur,
  updateUtilisateur,
} = require('../controllers/utilisateur.controller');

// --- Middlewares Auth
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');


// -------------------------------------------------------
// 🔐 TEST ADMIN
// -------------------------------------------------------
router.get(
  '/admin-only',
  verifyToken,
  restrictTo('admin'),
  (req, res) => {
    res.json({ message: 'Bienvenue administrateur !' });
  }
);


// -------------------------------------------------------
// 🔄 Vérifie existence utilisateur Firebase ↔ PostgreSQL
// -------------------------------------------------------
router.post('/check', checkUtilisateurExistant);


// -------------------------------------------------------
// 👤 CRUD UTILISATEURS (ADMIN UNIQUEMENT)
// -------------------------------------------------------

// ➕ Créer un employé
router.post(
  '/',
  verifyToken,
  restrictTo('admin'),
  createUtilisateur
);

// 📄 Liste des employés
router.get(
  '/',
  verifyToken,
  restrictTo('admin'),
  getAllUtilisateurs
);

// ✏️ Modifier un employé
router.put(
  '/:id',
  verifyToken,
  restrictTo('admin'),
  updateUtilisateur
);

// ✏️ Modifier (PATCH également accepté)
router.patch(
  '/:id',
  verifyToken,
  restrictTo('admin'),
  updateUtilisateur
);

// ❌ Supprimer un employé
router.delete(
  '/:id',
  verifyToken,
  restrictTo('admin'),
  deleteUtilisateur
);


// -------------------------------------------------------
// 💬 MESSAGES (rôle : responsable_communication)
// -------------------------------------------------------
router.get(
  '/messages',
  verifyToken,
  restrictTo('responsable_communication'),
  getMessages
);


// -------------------------------------------------------
// ⭐ AVIS (rôle : responsable_avis)
// -------------------------------------------------------
router.get(
  '/avis',
  verifyToken,
  restrictTo('responsable_avis'),
  getAvis
);

router.post(
  '/avis/:id/repondre',
  verifyToken,
  restrictTo('responsable_avis'),
  repondreAvis
);


// -------------------------------------------------------
// 📝 CONTENU DU SITE (rôle : gestionnaire_contenu)
// -------------------------------------------------------
router.put(
  '/contenu/:page',
  verifyToken,
  restrictTo('gestionnaire_contenu'),
  updatePageContent
);


// -------------------------------------------------------
// 🍽️ RÉSERVATIONS (rôle : maitre_hotel)
// -------------------------------------------------------
router.post(
  '/reservation',
  verifyToken,
  restrictTo('maitre_hotel'),
  createReservation
);

router.get(
  '/reservations',
  verifyToken,
  restrictTo('maitre_hotel'),
  getAllReservations
);


// -------------------------------------------------------
// 👤 PROFIL UTILISATEUR ACTUEL
// -------------------------------------------------------
router.get('/me', verifyToken, getCurrentUtilisateur);


module.exports = router;

