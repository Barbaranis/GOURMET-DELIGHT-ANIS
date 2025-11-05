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


// --- Routes
const categorieRoutes = require('./routes/categorie.routes');
const authRoutes = require('./routes/auth.routes');
const platRoutes = require('./routes/plat.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const contactRoutes = require('./routes/contact');


const app = express();
const isProd = process.env.NODE_ENV === 'production';


console.log(`🌍 ENV : connecté à la base ${process.env.DB_NAME} en tant que ${process.env.DB_USER}`);


// ------------------------------
// Helmet (CSP assouplie en dev pour reCAPTCHA & iframes)
// ------------------------------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: isProd ? undefined : {
    useDefaults: true,
    directives: {
      // autorise les scripts reCAPTCHA en dev
      "script-src": ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://www.recaptcha.net"],
      "frame-src": ["'self'", "https://www.google.com", "https://www.recaptcha.net"],
      "connect-src": ["'self'", "http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "https://www.google.com", "https://www.gstatic.com"],
      "img-src": ["'self'", "data:", "blob:", "https://www.google.com", "https://www.gstatic.com"],
    }
  }
}));


// Logs + anti-bourrinage
app.use(morgan('dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Trop de requêtes, réessayez plus tard.',
}));


// Parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------------------
// CORS
// ------------------------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gourmet-delight.netlify.app',
].concat(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);


app.use(cors({
  origin: (origin, cb) => {
    // autorise aussi les outils sans Origin (Thunder Client, curl)
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
}));


// Préflight OPTIONS (pour certains navigateurs stricts)
app.options('*', cors());


// Anti-cache léger pour l’API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set({ 'Cache-Control': 'no-store', Pragma: 'no-cache', Expires: '0' });
  }
  next();
});


// ------------------------------
// CSRF
// ------------------------------
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProd,      // true seulement en prod (HTTPS)
    sameSite: 'Lax',
  },
  value: (req) =>
    req.get('X-CSRF-Token') ||
    req.get('x-csrf-token') ||
    req.get('x-xsrf-token'),
});


// Récupération du token (et cookie lisible XSRF-TOKEN)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    sameSite: 'Lax',
    secure: isProd,
  });
  res.json({ csrfToken: token });
});


// Appliquer CSRF uniquement aux méthodes à risque
const requireCsrfForUnsafeMethods = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};


// ------------------------------
// Statics (uploads d'images)
// ------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ------------------------------
// Routes API
// ------------------------------
// Publique : liste des catégories (le reste protégé via CSRF sur méthodes à risque)
app.use('/api/categories', categorieRoutes);


app.use('/api/auth', requireCsrfForUnsafeMethods, authRoutes);
app.use('/api/plats', requireCsrfForUnsafeMethods, platRoutes);
app.use('/api/utilisateurs', requireCsrfForUnsafeMethods, utilisateurRoutes);
app.use('/api/contact', requireCsrfForUnsafeMethods, contactRoutes);


// ------------------------------
// Gestion des erreurs CSRF + global
// ------------------------------
app.use((err, _req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  if (err.message && /non autorisé/i.test(err.message)) {
    return res.status(403).json({ error: err.message });
  }
  next(err);
});


// Handler d’erreurs par défaut (propre)
app.use((err, _req, res, _next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});


// ------------------------------
// Health & ping
// ------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.send('✅ Serveur backend actif 🍽️'));


// ------------------------------
// Lancement serveur
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Modèles Sequelize synchronisés avec PostgreSQL.');
  } catch (err) {
    console.error('❌ Erreur Sequelize :', err);
  }
});



