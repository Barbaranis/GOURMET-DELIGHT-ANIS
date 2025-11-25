// ===============================
// server.js — VERSION CORRIGÉE
// ===============================

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
const isProd = process.env.NODE_ENV === 'production';

console.log("🌍 BACKEND démarré :", process.env.NODE_ENV);

// ===============================
// CORS — VERSION FIXÉE
// ===============================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://gourmetdelight.netlify.app",
  "https://gourmet-delight.netlify.app",
  "https://gourmet-delight-anis.onrender.com"  // ⭐ IMPORTANT ⭐
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔎 Origin reçue :", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Origin refusée :", origin);
      return callback(new Error("CORS: Origin non autorisée : " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "Accept",
      "Origin"
    ],
  })
);

app.options("*", cors());

// ===============================
// Helmet (CSP minimal compatible)
// ===============================
app.use(
  helmet({
    contentSecurityPolicy: false, // on désactive car sinon ça bloque reCAPTCHA
  })
);

// ===============================
// Middlewares
// ===============================

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Anti-cache API
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
  }
  next();
});

// ===============================
// CSRF (avec cookie)
// ===============================

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: "Lax",
  },
  value: (req) =>
    req.get("X-CSRF-Token") ||
    req.get("x-csrf-token") ||
    req.get("csrf-token"),
});

// Route pour récupérer le token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    sameSite: "Lax",
    secure: isProd,
  });
  res.json({ csrfToken: token });
});

// appliquer CSRF aux méthodes d’écriture
const requireCsrfForUnsafeMethods = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// ===============================
// Statics
// ===============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// Routes API
// ===============================
app.use("/api/categories", categorieRoutes);
app.use("/api/auth", requireCsrfForUnsafeMethods, authRoutes);
app.use("/api/plats", requireCsrfForUnsafeMethods, platRoutes);
app.use("/api/utilisateurs", requireCsrfForUnsafeMethods, utilisateurRoutes);
app.use("/api/contact", requireCsrfForUnsafeMethods, contactRoutes);

// ===============================
// Erreurs CSRF & globales
// ===============================

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Token CSRF invalide" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error("🔥 ERREUR SERVEUR :", err);
  res.status(500).json({ error: "Erreur serveur" });
});

// ===============================
// Health check
// ===============================
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ===============================
// Lancement
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log("🚀 Serveur lancé sur port", PORT);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("📦 Sequelize OK");
  } catch (e) {
    console.error("❌ Sequelize ERROR :", e);
  }
});

