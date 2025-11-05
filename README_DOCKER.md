# 🍽️ Gourmet Delight — Guide Docker (développement)


Ce projet lance **3 services** avec Docker :
- **db** → PostgreSQL 15  
- **backend** → Node 18 (Express + Sequelize + Firebase Admin)  
- **frontend** → React (Create React App)


> 🎯 Objectif : un environnement de développement isolé, reproductible et facile à redémarrer.


---


## 🧰 1. Prérequis


- **Docker Desktop** installé et démarré  
- Ports disponibles :  
  - `3000` → frontend  
  - `5000` → backend  
  - `5433` → base PostgreSQL (port externe hôte)
- Clé Firebase Admin (`serviceAccountKey.json`) placée dans le dossier `backend/`


---


## 📂 2. Structure du projet


```bash
gourmet-delight/
├─ backend/
│  ├─ src/
│  ├─ utils/
│  ├─ .env
│  ├─ serviceAccountKey.json
│  ├─ package.json
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ .env
│  ├─ package.json
│  └─ Dockerfile
├─ docker-compose.dev.yml
└─ README_DOCKER.md

