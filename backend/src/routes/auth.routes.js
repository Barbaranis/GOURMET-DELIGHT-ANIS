// 📁 src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');


const authController = require('../controllers/auth.controller');
const verifyRecaptcha = require('../middleware/verifyRecaptcha');
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ ICI L’IMPORT MANQUANT


console.log('✅ auth.routes.js chargé !');


// ✅ Route de test
router.get('/test', (_req, res) => {
  res.send('✅ Route de test auth OK !');
});


/* ----------------------------------------------------
 * POST /login
 * ---------------------------------------------------- */
router.post(
  '/login',
  [
    body('email')
      .notEmpty().withMessage("L'email est requis.")
      .isEmail().withMessage("L'email n'est pas valide.")
      .normalizeEmail(),
    body().custom((value) => {
      const pwd = value.mot_de_passe ?? value.password;
      if (!pwd) throw new Error('Le mot de passe est requis.');
      if (String(pwd).length < 6) {
        throw new Error('Le mot de passe doit faire au moins 6 caractères.');
      }
      return true;
    }),
  ],
  (req, _res, next) => {
    if (!req.body.mot_de_passe && req.body.password) {
      req.body.mot_de_passe = req.body.password;
    }
    next();
  },
  verifyRecaptcha,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });
    return authController.login(req, res);
  }
);


/* ----------------------------------------------------
 * POST /register
 * ---------------------------------------------------- */
router.post(
  '/register',
  [
    body('email')
      .notEmpty().withMessage("L'email est requis.")
      .isEmail().withMessage("L'email n'est pas valide.")
      .normalizeEmail(),
    body().custom((value) => {
      const pwd = value.mot_de_passe ?? value.password;
      if (!pwd) throw new Error('Le mot de passe est requis.');
      if (String(pwd).length < 6) {
        throw new Error('Le mot de passe doit faire au moins 6 caractères.');
      }
      return true;
    }),
    body('prenom')
      .trim()
      .notEmpty().withMessage('Le prénom est requis.')
      .isLength({ min: 2 }).withMessage('Le prénom est trop court.')
      .escape(),
    body('role')
      .optional()
      .isIn([
        'admin',
        'chef_cuisine',
        'maitre_hotel',
        'responsable_salle',
        'gestionnaire_contenu',
        'employe',
      ])
      .withMessage('Rôle invalide.'),
  ],
  (req, _res, next) => {
    if (!req.body.mot_de_passe && req.body.password) {
      req.body.mot_de_passe = req.body.password;
    }
    next();
  },
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });


    return authController.register
      ? authController.register(req, res)
      : res.status(501).json({ message: 'register non implémenté.' });
  }
);


/* ----------------------------------------------------
 * GET /me → utilisé par AuthContext pour vérifier la session
 * ---------------------------------------------------- */
router.get('/me', verifyToken, (req, res) => {
  return res.json({ user: req.user });
});


/* ----------------------------------------------------
 * POST /logout → efface le cookie JWT
 * ---------------------------------------------------- */
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Lax', secure: false, path: '/' });
  return res.json({ message: 'Déconnecté' });
});


module.exports = router;





