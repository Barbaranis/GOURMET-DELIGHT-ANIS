// src/routes/contact.js


const express = require('express');
const router = express.Router();

const db = require('../config/firebaseAdmin'); // 
const { body, validationResult } = require('express-validator'); //  Validation des entrées



// ✅ Route POST /api/contact avec validation sécurisée
router.post(
  '/',
  [
    // 🔎 Validation & sanitization des champs


    body('titre')
      .trim()
      .notEmpty().withMessage('Le titre est requis.')
      .isLength({ max: 100 }).withMessage('Le titre est trop long.')
      .escape(), // Anti-XSS


    body('description')
      .trim()
      .notEmpty().withMessage('La description est requise.')
      .isLength({ max: 1000 }).withMessage('La description est trop longue.')
      .escape(), // Anti-XSS


    body('email')
      .notEmpty().withMessage('L’email est requis.')
      .isEmail().withMessage('Format d’email invalide.')
      .normalizeEmail()
  ],
  async (req, res) => {
    // 📋 Gestion des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erreurs: errors.array() });
    }


    // ✅ Données validées et sécurisées
    const { titre, description, email } = req.body;


    try {
      // 🔥 Enregistrement dans Firestore
      await db.collection('messages_contact').add({
        titre,
        description,
        email,
        createdAt: new Date(),
        lu: false
      });


      res.status(200).json({ message: '✅ Message bien enregistré dans Firebase.' });
    } catch (err) {
      console.error('❌ Erreur Firebase :', err);
      res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement du message.' });
    }
  }
);


module.exports = router;



