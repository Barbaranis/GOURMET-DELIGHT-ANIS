// 📁 src/controllers/auth.controller.js

// (...) le début ne change pas

// 7) Génération du JWT
const payload = {
  id: user.id_utilisateur ?? user.id,
  role: user.role,
  email: user.email,
  prenom: user.prenom,
};

const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: TOKEN_DURATION,
});

// 8) Envoi du token en cookie + JSON (pour que le front puisse le stocker)
res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    message: 'Connexion réussie.',
    user: {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      prenom: payload.prenom,
    },
    token: token, // ➜ ON RENVOIE BIEN LE TOKEN AU FRONT
  });

