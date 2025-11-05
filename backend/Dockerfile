# ---- Base Node.js ----
    FROM node:18

    # Crée le répertoire de travail
    WORKDIR /app
    
    # Copie les fichiers de config
    COPY package*.json ./
    
    # Installe les dépendances
    RUN npm install
    
    # Copie le reste du code
    COPY . .
    
    # Expose le port du serveur Express
    EXPOSE 5000
    
    # Démarrage (utilise nodemon si dispo)
    CMD ["npm", "run", "dev"]
    