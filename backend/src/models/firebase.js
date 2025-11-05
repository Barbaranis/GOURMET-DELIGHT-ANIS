const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // ou './config/serviceAccountKey.json' si dans un dossier


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
module.exports = db;

