// 📁 src/controllers/utilisateur.controller.js
const bcrypt = require('bcrypt');
const { Utilisateur } = require('../models'); // ✅ modèle Sequelize


// -------------------------------------------------------------
// 🔍 Vérifie si un utilisateur existe (Firebase ↔ Postgres)
// -------------------------------------------------------------
exports.checkUtilisateurExistant = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis.' });


    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({
        message: 'Aucun compte associé à cet email. Veuillez contacter un administrateur.'
      });
    }


    return res.status(200).json({
      utilisateur: {
        id: utilisateur.id_utilisateur,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role
      }
    });
  } catch (error) {
    console.error('❌ Erreur checkUtilisateurExistant :', error);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// 👤 Crée un utilisateur (admin)
// -------------------------------------------------------------
exports.createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role, telephone } = req.body;


    if (!nom || !prenom || !email || !mot_de_passe || !role) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }


    const deja = await Utilisateur.findOne({ where: { email } });
    if (deja) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }


    const hash = await bcrypt.hash(mot_de_passe, 10);


    const user = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe: hash,
      role,
      telephone: telephone || null
    });


    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id_utilisateur: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Erreur createUtilisateur :', err);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// ✏️ Met à jour un utilisateur (admin)
// -------------------------------------------------------------
exports.updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, mot_de_passe, role, telephone } = req.body;


    // 🔎 Vérifie existence
    const user = await Utilisateur.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });


    // ⚠️ Vérifie doublon email si modifié
    if (email && email !== user.email) {
      const deja = await Utilisateur.findOne({ where: { email } });
      if (deja && String(deja.id_utilisateur) !== String(id)) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }
    }


    // ✅ Mise à jour des champs
    if (nom !== undefined) user.nom = nom;
    if (prenom !== undefined) user.prenom = prenom;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (telephone !== undefined) user.telephone = telephone;


    // 🔐 Mot de passe (optionnel)
    if (mot_de_passe) {
      user.mot_de_passe = await bcrypt.hash(String(mot_de_passe), 10);
    }


    await user.save();


    const { mot_de_passe: _, ...safeUser } = user.toJSON();
    return res.json({ message: '✅ Employé mis à jour.', utilisateur: safeUser });
  } catch (err) {
    console.error('❌ Erreur updateUtilisateur :', err);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// 📋 Liste tous les utilisateurs (admin)
// -------------------------------------------------------------
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const users = await Utilisateur.findAll({
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'role', 'telephone'],
      order: [['id_utilisateur', 'ASC']],
    });


    return res.json(users); // ✅ renvoie un tableau simple
  } catch (err) {
    console.error('❌ Erreur getAllUtilisateurs :', err);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// 🗑️ Supprime un utilisateur (admin)
// -------------------------------------------------------------
exports.deleteUtilisateur = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Utilisateur.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });


    await user.destroy();
    return res.json({ message: `Utilisateur supprimé : ${user.nom} ${user.prenom}` });
  } catch (err) {
    console.error('❌ Erreur deleteUtilisateur :', err);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// 🔁 Renvoie l’utilisateur connecté (à partir du JWT)
// -------------------------------------------------------------
exports.getCurrentUtilisateur = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié.' });


    const pk = req.user.id_utilisateur || req.user.id; // ✅ compatibilité
    const user = await Utilisateur.findByPk(pk, {
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'role']
    });


    return res.json({ user });
  } catch (err) {
    console.error('❌ Erreur getCurrentUtilisateur :', err);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};


// -------------------------------------------------------------
// (Les autres fonctions restent en "stub" si non utilisées)
// -------------------------------------------------------------
exports.getMessages = async (_req, res) => res.json({ message: 'getMessages (stub)' });
exports.getAvis = async (_req, res) => res.json({ message: 'getAvis (stub)' });
exports.repondreAvis = async (_req, res) => res.json({ message: 'repondreAvis (stub)' });
exports.updatePageContent = async (_req, res) => res.json({ message: 'updatePageContent (stub)' });
exports.createReservation = async (_req, res) => res.json({ message: 'createReservation (stub)' });
exports.getAllReservations = async (_req, res) => res.json({ message: 'getAllReservations (stub)' });

