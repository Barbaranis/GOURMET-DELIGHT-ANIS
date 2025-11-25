// src/server.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');

const sequelize = require('./config/db');

// Routes
const categorieRoutes = require('./routes/categorie.routes');
const authRoutes = require('./routes/auth.routes');
const platRoutes = require('./routes/plat.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const contactRoutes = require('./routes/contact');

const app = express();

// Sur Render, la variable RENDER est présente
const isRender = !!process.env.RENDER;
const isProd = isRender || process.env.NODE_ENV === 'production';

console.log(`🌍 ENV : connecté à la base ${process.env.DB_NAME} en tant que ${process.env.DB_USER}`);
console.log(`MODE : ${isProd ? 'production (Render)' : 'développement'}`);

// ---------------------------------------------------
// Helmet (CSP assouplie pour reCAPTCHA & front)
// ---------------------------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: isProd
      ? undefined
      : {
          useDefaults: true,
          directives: {
            "script-src": [
              "'self'",
              "'unsafe-inline'",
              "https://www.google.com",
              "https://www.gstatic.com",
              "https://www.recaptcha.net"
            ],
            "frame-src": [
              "'self'",
              "https://www.google.com",
              "https://www.recaptcha.net"
            ],
            "connect-src": [
              "'self'",
              "http://localhost:5000",
              "http://localhost:3000",
              "http://localhost:3001",
              "http://localhost:3002",
              "https://gourmetdeligh.netlify.app",
              "https://www.google.com",
              "https://www.gstatic.com"
            ],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              "https://www.google.com",
              "https://www.gstatic.com"
            ]
          }
        }
  })
);

// ---------------------------------------------------
// Logs + rate-limit
// ---------------------------------------------------
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: '⚠️ Trop de requêtes, réessayez plus tard.',
  })
);

// ---------------------------------------------------
// Parsers
// ---------------------------------------------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------
// CORS
// ---------------------------------------------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://gourmetdeligh.netlify.app',   // ton vrai domaine Netlify
  'https://gourmetdelight.netlify.app',
  'https://gourmet-delight.netlify.app',
].concat(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);

app.use(
  cors({
    origin: (origin, cb) => {
      console.log('🌐 Origin reçue :', origin);
      // autorise aussi les outils sans Origin (Thunder Client, curl, Render health checks)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin "${origin}" non autorisé`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'csrf-token',
      'x-csrf-token',
      'x-xsrf-token',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
      'If-None-Match',
      'If-Modified-Since',
    ],
  })
);

// Préflight OPTIONS : on répond 204 proprement
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---------------------------------------------------
// Anti-cache léger pour l’API
// ---------------------------------------------------
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      Expires: '0',
    });
  }
  next();
});

// ---------------------------------------------------
// CSRF
// ---------------------------------------------------
// ⚠️ Pour que le cookie CSRF soit envoyé entre Netlify (front)
// et Render (back), il doit être SameSite=None + secure en prod.
const sameSiteMode = isProd ? 'None' : 'Lax';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProd,      // true en prod (https obligatoire)
    sameSite: sameSiteMode,
  },
  value: (req) =>
    req.get('X-CSRF-Token') ||
    req.get('x-csrf-token') ||
    req.get('x-xsrf-token'),
});

// Route de récupération du token CSRF
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();

  // Cookie lisible côté front (pour debug si besoin)
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: isProd,
    sameSite: sameSiteMode,
  });

  res.json({ csrfToken: token });
});

// Appliquer CSRF uniquement aux méthodes à risque
const requireCsrfForUnsafeMethods = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// ---------------------------------------------------
// Statics
// ---------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------
// Routes API
// ---------------------------------------------------
console.log('🔧 mount /api/categories');
app.use('/api/categories', categorieRoutes);

console.log('🔧 mount /api/auth');
app.use('/api/auth', requireCsrfForUnsafeMethods, authRoutes);

console.log('🔧 mount /api/plats');
app.use('/api/plats', requireCsrfForUnsafeMethods, platRoutes);

console.log('🔧 mount /api/utilisateurs');
app.use('/api/utilisateurs', requireCsrfForUnsafeMethods, utilisateurRoutes);

console.log('🔧 mount /api/contact');
app.use('/api/contact', requireCsrfForUnsafeMethods, contactRoutes);

// ---------------------------------------------------
// Gestion des erreurs
// ---------------------------------------------------
app.use((err, _req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Erreur CSRF :', err.message);
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  if (err.message && /non autorisé/i.test(err.message)) {
    console.error('❌ Erreur CORS :', err.message);
    return res.status(403).json({ error: err.message });
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// ---------------------------------------------------
// Health
// ---------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.send('✅ Serveur backend actif 🍽️'));

// ---------------------------------------------------
// Lancement serveur
// ---------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Modèles Sequelize synchronisés avec PostgreSQL.');
  } catch (err) {
    console.error('❌ Erreur Sequelize :', err);
  }
});

