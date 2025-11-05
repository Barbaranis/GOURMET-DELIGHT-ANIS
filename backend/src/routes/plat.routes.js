//src/routes/plat.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/plat.controller');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');



// 📦 Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });




// ✅ ROUTES

// 📄 Lecture publique (menu)
router.get('/', controller.getAllPlats);




// ✅ Ajout plat (admin ou chef)
router.post('/', verifyToken, restrictTo('admin', 'chef_cuisine'), upload.single('image'), controller.createPlat);




// ✏️ Modification plat (admin ou chef) — CORRIGÉ ICI ⬇️
router.put('/:id', verifyToken, restrictTo('admin', 'chef_cuisine'), upload.single('image'), controller.updatePlat);




// ❌ Suppression plat (admin ou chef)
router.delete('/:id', verifyToken, restrictTo('admin', 'chef_cuisine'), controller.deletePlat);


module.exports = router;

