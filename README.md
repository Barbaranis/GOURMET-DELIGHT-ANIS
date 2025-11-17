
 # 🍽️ Gourmet Delight — Backend API
Backend officiel du projet de restaurant gastronomique Gourmet Delight

# ⭐ Introduction
Ce dépôt contient le backend complet du projet Gourmet Delight.
Il fournit toutes les API nécessaires au fonctionnement du site :
Authentification (JWT + Cookies HttpOnly + CSRF)


Gestion des utilisateurs (admin, employés)


Gestion des plats, catégories et chefs


Gestion des avis (modération)


Gestion des réservations


Sécurité avancée


Synchronisation SQL + NoSQL (PostgreSQL + Firestore)


Déploiement Docker



 # 🛠️ Stack technique
Domaine
Technologie
Serveur
Node.js + Express
Base principale
PostgreSQL
ORM
Sequelize
Base NoSQL
Firebase Firestore
Authentification
JWT, cookies HttpOnly
Sécurité
Helmet, CORS, CSRF Token, Rate limiting
Déploiement
Docker & Docker Compose
Logger
Morgan


 # 📦 Installation
1. Cloner le projet
git clone https://github.com/ton-compte/gourmet-delight-backend.git
cd gourmet-delight-backend

2. Installer les dépendances
npm install

3. Configurer les variables d’environnement
Créer un fichier .env à la racine :
# SERVER
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# DATABASE (PostgreSQL)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=gourmet
DB_PORT=5432

# JWT
JWT_SECRET=ton_secret_jwt
JWT_EXPIRES_IN=24h

# CSRF
CSRF_SECRET=ton_secret_csrf

# FIREBASE
FIREBASE_PROJECT_ID=xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com

🚀 
Lancer le projet
Développement
npm run dev
Serveur disponible sur :
👉 http://localhost:5000

Production
npm start

🐳 
Lancer avec Docker
1. Construire l’image Docker
docker build -t gourmet-backend .
2. Lancer avec Docker Compose
docker-compose up -d

📡 
API — Routes principales
🔐 Authentification
Méthode
Route
Description
POST
/api/auth/login
Connexion
POST
/api/auth/logout
Déconnexion
GET
/api/me
Récupérer les infos utilisateur


👨‍🍳 Chefs
Méthode
Route
GET
/api/chefs
POST
/api/chefs
PUT
/api/chefs/:id
DELETE
/api/chefs/:id


🍽️ Plats
Méthode
Route
GET
/api/plats
POST
/api/plats
PUT
/api/plats/:id
DELETE
/api/plats/:id


🗂️ Catégories
Méthode
Route
GET
/api/categories


⭐ Avis
Méthode
Route
GET
/api/avis
POST
/api/avis
PUT
/api/avis/:id/validate


📅 Réservations
Méthode
Route
GET
/api/reservations
POST
/api/reservations
PUT
/api/reservations/:id
DELETE
/api/reservations/:id


🛡️ 
Sécurité incorporée
Le backend inclut :
✔ Helmet (sécurité headers)


✔ CORS strict


✔ Cookies HttpOnly + Secure


✔ CSRF Token


✔ Rate limiting (anti brute-force)


✔ Nettoyage XSS


✔ Validation stricte des entrées


✔ Gestion d’erreurs centralisée



 # 📁 Structure du dossier
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── uploads/
├── .env.example
├── package.json
├── Dockerfile
└── README.md

 # 👩‍💻 Auteur
Développé par Anis Barbara,
dans le cadre du Titre Professionnel Développeur Web & Web Mobile.

# 📄 Licence
Publié sous licence MIT.


