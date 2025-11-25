// src/controllers/auth.controller.js


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const Utilisateur = db.Utilisateur;


// 🔧 Config JWT
const TOKEN_DURATION = '24h';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';




// -----------------------------------------------------
// 🔐 Connexion utilisateur (POST /api/auth/login)
// -----------------------------------------------------
exports.login = async (req, res) => {
  try {
    // ✅ 1) Normalisation des champs
    const email = (req.body.email || '').trim().toLowerCase();
    const password =
      req.body.password ?? req.body.mot_de_passe; // <-- accepte les 2 clés


    // 🧪 debug minimal (retire-le quand tout est OK)
    console.log('LOGIN DEBUG -> email:', email, '| hasPwd:', Boolean(password));


    // 2) Validation d'entrée
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }


    // 3) Recherche utilisateur (case-insensitive)
    const user = await Utilisateur.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn('LOWER', db.Sequelize.col('email')),
        email
      ),
    });


    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }


    // 4) Récup du hash (selon le nom de ta colonne)
    const hash = user.mot_de_passe ?? user.password;
    if (!hash) {
      // Cas rare: colonne vide/mauvais nom
      return res.status(500).json({ message: 'Mot de passe indisponible côté serveur.' });
    }


    // 5) Comparaison bcrypt
    const ok = await bcrypt.compare(password, hash);
    console.log('LOGIN DEBUG -> bcrypt.compare =', ok); // debug léger
    if (!ok) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }


    // 6) Génération token
    const token = jwt.sign(
      { id: user.id_utilisateur ?? user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_DURATION }
    );


    // 7) Cookie httpOnly
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Connexion réussie.',
        user: {
          id: user.id_utilisateur ?? user.id,
          email: user.email,
          role: user.role,
          prenom: user.prenom,
        },
      });
  } catch (error) {
    console.error('❌ Erreur login :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




// -----------------------------------------------------
// 🧾 Inscription utilisateur (POST /api/auth/register)
// -----------------------------------------------------
exports.register = async (req, res) => {
  try {
    // 1) Récup et normalisation
    const email = (req.body.email || '').trim().toLowerCase();
    const mot_de_passe = req.body.mot_de_passe ?? req.body.password;
    const prenom = (req.body.prenom || '').trim();
    let role = req.body.role;


    // 2) Validation minimale
    if (!email || !mot_de_passe || !prenom) {
      return res.status(400).json({ error: 'email, mot_de_passe et prenom sont obligatoires.' });
    }


    // 3) Rôle par défaut / sécurité (au cas où)
    const ROLES_AUTORISES = [
      'admin',
      'chef_cuisine',
      'maitre_hotel',
      'responsable_salle',
      'gestionnaire_contenu',
      'employe',
    ];
    if (!role || !ROLES_AUTORISES.includes(role)) {
      role = 'employe';
    }


    // 4) Vérifier si l'utilisateur existe déjà (case-insensitive)
    const deja = await Utilisateur.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn('LOWER', db.Sequelize.col('email')),
        email
      ),
    });


    if (deja) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }


    // 5) Hash du mot de passe
    const hash = await bcrypt.hash(String(mot_de_passe), 10);


    // 6) Création dans PostgreSQL
    const user = await Utilisateur.create({
      email,
      mot_de_passe: hash,
      prenom,
      role,
    });


    // 7) Réponse
    return res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: {
        id: user.id_utilisateur ?? user.id,
        email: user.email,
        prenom: user.prenom,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Erreur register :', err);
    return res.status(500).json({ error: 'Erreur serveur lors de l’inscription.' });
  }
};

