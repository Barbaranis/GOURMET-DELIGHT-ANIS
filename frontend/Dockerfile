# ---- Étape 1 : build React ----
    FROM node:18 AS build

    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    
    # ---- Étape 2 : serveur Nginx ----
    FROM nginx:alpine
    
    # Copie le build React vers Nginx
    COPY --from=build /app/build /usr/share/nginx/html
    
    # Expose le port HTTP
    EXPOSE 3000
    
    # Démarre Nginx
    CMD ["nginx", "-g", "daemon off;"]
    