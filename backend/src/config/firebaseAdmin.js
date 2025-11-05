
// ✅ backend/src/config/firebaseAdmin.js


const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../serviceAccountKey.json'); 


// 🔐 Initialisation de Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});


// 📦 Export de l'instance Firestore
const db = getFirestore();
module.exports = db;
