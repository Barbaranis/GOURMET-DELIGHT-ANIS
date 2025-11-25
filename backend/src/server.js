// =====================
// SERVER.JS — VERSION FINALE
// =====================

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const path = require("path");

const sequelize = require("./config/db");

// Routes
const categorieRoutes = require("./routes/categorie.routes");
const authRoutes = require("./routes/auth.routes");
const platRoutes = require("./routes/plat.routes");
const utilisateurRoutes = require("./routes/utilisateur.routes");
const contactRoutes = require("./routes/contact");

const app = express();
const isProd = process.env.NODE_ENV === "production";

console.log("🌍 Backend démarré — ENV:", process.env.NODE_ENV);

// -------------------------
//  CORS — VERSION FIXÉE
// -------------------------

const allowedOrigins = [
  "https://gourmetdelight.netlify.app",
  "https://gourmet-delight.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001"
];

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      console.log("❌ Origin CORS refusée :", origin);
      return cb(new Error("Origin non autorisée par CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "csrf-token",
      "x-csrf-token",
      "x-xsrf-token",
      "Accept"
    ]
  })
);

// Préflight
app.options("*", cors());

// -------------------------
// SECURITÉ
// -------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// CSRF
// -------------------------
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: "Lax"
  },
  value: (req) =>
    req.get("X-CSRF-Token") ||
    req.get("x-csrf-token") ||
    req.get("x-xsrf-token")
});

// route publique pour récupérer le token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    sameSite: "Lax",
    secure: isProd
  });
  res.json({ csrfToken: token });
});

// appliquer CSRF uniquement aux méthodes sensibles
const secureMethods = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// -------------------------
// STATIC — UPLOADS
// -------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// ROUTES API
// -------------------------
app.use("/api/categories", categorieRoutes);
app.use("/api/auth", secureMethods, authRoutes);
app.use("/api/plats", secureMethods, platRoutes);
app.use("/api/utilisateurs", secureMethods, utilisateurRoutes);
app.use("/api/contact", secureMethods, contactRoutes);

// -------------------------
// ERRORS
// -------------------------
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err);
  res.status(500).json({ error: "Erreur serveur" });
});

// -------------------------
// HEALTH
// -------------------------
app.get("/api/health", (_, res) => res.json({ ok: true }));

// -------------------------
// START
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 API en ligne sur port ${PORT}`);

  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✔️ DB OK — modèles synchronisés");
  } catch (e) {
    console.error("❌ Erreur DB :", e);
  }
});

