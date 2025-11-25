// =========================
// SERVER.JS — VERSION FIX CORS + CSRF
// =========================

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');

const sequelize = require('./config/db');

// Routes
const categorieRoutes = require('./routes/categorie.routes');
const authRoutes = require('./routes/auth.routes');
const platRoutes = require('./routes/plat.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const contactRoutes = require('./routes/contact');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ------------------------------
// CORS — VERSION SIMPLE ET ULTRA FIABLE
// ------------------------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gourmetdeligh.netlify.app', // <-- LE VRAI DOMAINE NETLIFY
].concat(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);



app.use(
  cors({
    origin: (origin, cb) => {
      console.log("🌍 Origin reçue :", origin);

      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`❌ Origin "${origin}" non autorisée par CORS`));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// ------------------------------
// Helmet (sans conflit CORS)
// ------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// CSRF
// ------------------------------
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'None'
  },
  value: req =>
    req.get('X-CSRF-Token') ||
    req.get('x-csrf-token') ||
    req.body?._csrf
});

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'None'
  });
  res.json({ csrfToken: token });
});

// Only apply CSRF to unsafe methods
const unsafe = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// ------------------------------
// Static
// ------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------
// API ROUTES
// ------------------------------
app.use('/api/categories', categorieRoutes);
app.use('/api/auth', unsafe, authRoutes);
app.use('/api/plats', unsafe, platRoutes);
app.use('/api/utilisateurs', unsafe, utilisateurRoutes);
app.use('/api/contact', unsafe, contactRoutes);

// ------------------------------
// Error handlers
// ------------------------------
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// ------------------------------
app.get('/', (req, res) => res.send("Backend OK • Render"));

// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Backend lancé`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("📌 PostgreSQL OK");
  } catch (e) {
    console.error("❌ Sequelize error :", e);
  }
});

