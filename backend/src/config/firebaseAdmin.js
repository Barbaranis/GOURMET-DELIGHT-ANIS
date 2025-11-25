
// ✅ backend/src/config/firebaseAdmin.js


const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
let serviceAccount;

// En production (Render) : on lit le fichier secret
if (process.env.FIREBASE_KEY_PATH) {
  const keyPath = process.env.FIREBASE_KEY_PATH;
  serviceAccount = require(keyPath);
} else {
  // En local : on continue d'utiliser le fichier classique NON poussé sur GitHub
  const localPath = path.join(__dirname, '../../serviceAccountKey.json');
  serviceAccount = require(localPath);
}




// 🔐 Initialisation de Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});


// 📦 Export de l'instance Firestore
const db = getFirestore();
module.exports = db;
