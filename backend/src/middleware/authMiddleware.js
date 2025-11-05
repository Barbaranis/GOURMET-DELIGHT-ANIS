// 📁 src/middleware/authMiddleware.js


const jwt = require('jsonwebtoken');


// ---------------------------------------------------------------------
// 🔐 Middleware : Vérifie que le token JWT dans le cookie est valide
// ---------------------------------------------------------------------
exports.verifyToken = (req, res, next) => {
  // 🔎 Récupère le token depuis les cookies (grâce à cookie-parser)
  const token = req.cookies.token;


  // 🛡️ Sécurité #1 : Absence de token = accès refusé
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }


  try {
    // 🔐 Sécurité #2 : Vérifie la validité et la signature du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');


    // ✅ Sécurité #3 : Ajoute les infos utilisateur dans `req.user`
    req.user = decoded;


    // ⏭️ Passe au middleware ou route suivant(e)
    next();


  } catch (err) {
    // ❌ Sécurité #4 : Token invalide, falsifié ou expiré
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};




// ---------------------------------------------------------------------
// 🔐 Middleware : Restreint l’accès à certains rôles
// ---------------------------------------------------------------------
exports.restrictTo = (...rolesAutorises) => {
  return (req, res, next) => {
    const userRole = req.user?.role;


    // ✅ Autorise si l'utilisateur est admin OU dans la liste des rôles autorisés
    if (userRole === 'admin' || rolesAutorises.includes(userRole)) {
      return next();
    }


    // ❌ Sinon, accès interdit
    return res.status(403).json({ message: 'Accès interdit. Rôle non autorisé.' });
  };
};

