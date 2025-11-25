
// ✅ backend/src/config/firebaseAdmin.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // En production : la clé vient d'une variable d'environnement
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("🔥 Firebase : clé chargée depuis ENV (Render)");
  } catch (error) {
    console.error("❌ Erreur en lisant FIREBASE_SERVICE_ACCOUNT :", error);
    throw error;
  }
} else {
  // En local : on utilise le fichier
  const localPath = path.join(__dirname, '../../serviceAccountKey.json');
  serviceAccount = JSON.parse(fs.readFileSync(localPath));
  console.log("💻 Firebase : clé chargée depuis le fichier local");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

