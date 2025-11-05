// 📁 src/controllers/plat.controller.js
const db = require('../models');
const Plat = db.Plat;
const Categorie = db.Categorie;


const { firestore } = require('../config/firebaseAdmin');
const fs = require('fs');
const path = require('path');


// ✅ Créer un plat avec image
exports.createPlat = async (req, res) => {
  try {
    const { nom, description, prix, id_categorie } = req.body;


    if (!nom || !prix || !id_categorie || !req.file) {
      return res.status(400).json({ message: "Tous les champs sont requis, y compris l'image." });
    }


    const prixFloat = parseFloat(prix);
    const categorieId = parseInt(id_categorie);


    if (isNaN(prixFloat) || isNaN(categorieId)) {
      return res.status(400).json({ message: "Le prix et la catégorie doivent être des nombres valides." });
    }


    const categorieExiste = await Categorie.findByPk(categorieId);
    if (!categorieExiste) {
      return res.status(400).json({ message: "La catégorie sélectionnée n'existe pas." });
    }


    const image_url = req.file.filename;


    const plat = await Plat.create({
      nom,
      description,
      prix: prixFloat,
      image_url,
      id_categorie: categorieId,
    });


    // ID Sequelize
    const idPlat = plat.id_plat || plat.id;
    if (!idPlat) {
      return res.status(500).json({ message: "Erreur : ID du plat introuvable après création." });
    }


    // 🔁 Firestore : création (indépendante)
    try {
      await firestore.collection('plats').doc(idPlat.toString()).set({
        nom,
        description,
        prix: prixFloat,
        image_url,
        id_categorie: categorieId,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('⚠️ Firestore create ignoré :', e.message);
    }


    return res.status(201).json(plat);
  } catch (err) {
    console.error("❌ Erreur serveur createPlat:", err);
    return res.status(500).json({ message: "Erreur création plat", error: err.message });
  }
};


// ✅ Lire tous les plats
exports.getAllPlats = async (_req, res) => {
  try {
    const plats = await Plat.findAll();
    return res.status(200).json(plats);
  } catch (err) {
    return res.status(500).json({ message: "Erreur récupération plats", error: err.message });
  }
};


// ✅ Mettre à jour un plat
exports.updatePlat = async (req, res) => {
  try {
    const { id } = req.params;
    const plat = await Plat.findByPk(id);
    if (!plat) {
      return res.status(404).json({ message: "Plat non trouvé." });
    }


    const { nom, description, prix, id_categorie } = req.body;
    const prixFloat = parseFloat(prix);
    const categorieId = parseInt(id_categorie);


    if (isNaN(prixFloat) || isNaN(categorieId)) {
      return res.status(400).json({ message: "Le prix et la catégorie doivent être valides." });
    }


    let image_url = plat.image_url;


    // 📷 Nouvelle image ?
    if (req.file) {
      // supprime l'ancienne si elle existe
      if (plat.image_url) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', plat.image_url);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn("⚠️ Erreur suppression ancienne image :", err.message);
        });
      }
      image_url = req.file.filename;
    }


    // 🔄 Update SQL
    await Plat.update(
      { nom, description, prix: prixFloat, image_url, id_categorie: categorieId },
      { where: { id_plat: id } }
    );


    // Récupérer l'objet à jour pour renvoyer au front
    const updated = await Plat.findByPk(id);


    // 🔁 Firestore : set merge (crée si absent, met à jour sinon)
    try {
      await firestore.collection('plats').doc(id.toString()).set(
        {
          nom,
          description,
          prix: prixFloat,
          image_url,
          id_categorie: categorieId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('⚠️ Firestore update ignoré :', e.message);
    }


    return res.status(200).json({ message: "Plat mis à jour avec succès.", plat: updated });
  } catch (err) {
    console.error("❌ Erreur updatePlat:", err);
    return res.status(500).json({ message: "Erreur mise à jour plat", error: err.message });
  }
};


// ✅ Supprimer un plat
exports.deletePlat = async (req, res) => {
  try {
    const { id } = req.params;
    const plat = await Plat.findByPk(id);
    if (!plat) {
      return res.status(404).json({ message: "Aucun plat trouvé à supprimer." });
    }


    // 🧹 Supprimer l'image si présente
    if (plat.image_url) {
      const imagePath = path.join(__dirname, '..', 'uploads', plat.image_url);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("⚠️ Image non supprimée :", err.message);
      });
    }


    // SQL
    await Plat.destroy({ where: { id_plat: id } });


    // Firestore (indépendant)
    try {
      await firestore.collection('plats').doc(id.toString()).delete();
    } catch (e) {
      console.warn('⚠️ Firestore delete ignoré :', e.message);
    }


    return res.status(200).json({ message: "Plat supprimé avec succès." });
  } catch (err) {
    console.error("❌ Erreur deletePlat:", err);
    return res.status(500).json({ message: "Erreur suppression plat", error: err.message });
  }
};

