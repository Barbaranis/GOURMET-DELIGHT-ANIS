// 📁 src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// -------------------------------------------------------------
// 🔐 Vérifie si l'utilisateur possède un JWT valide via COOKIE
// -------------------------------------------------------------
exports.verifyToken = (req, res, next) => {
  // Le JWT est stocké dans le cookie "token"
  const token = req.cookies?.token;

  // Si aucun token => non connecté
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    // Vérifie la signature du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    // Ajoute les infos du user dans req.user
    req.user = decoded;

    // Passe à la suite
    next();

  } catch (err) {
    console.error("❌ JWT ERROR :", err);
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

// -------------------------------------------------------------
// 🔐 Restriction par rôle (admin, chef, etc.)
// -------------------------------------------------------------
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    // Autorise si ADMIN ou si rôle autorisé
    if (role === 'admin' || allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ message: 'Accès interdit. Rôle insuffisant.' });
  };
};

