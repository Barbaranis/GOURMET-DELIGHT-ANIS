// 🔐 axiosInterceptor.js
// Ce fichier configure un intercepteur global pour sécuriser toutes les requêtes sortantes
// Il permet d'injecter automatiquement le token CSRF dans les headers de sécurité


import axios from 'axios';


// ===========================
// 🍪 Fonction utilitaire : lire un cookie précis
// ===========================
// Elle récupère le contenu d'un cookie à partir de son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}


// ===========================
// 🔄 Intercepteur des requêtes sortantes
// ===========================
// Avant chaque requête envoyée par axios, on insère le token CSRF dans les headers
axios.interceptors.request.use(
  config => {
    // Récupère le token CSRF stocké dans le cookie `XSRF-TOKEN`
    const xsrfToken = getCookie('XSRF-TOKEN');


    // Si présent, l'ajoute à l'en-tête de la requête (nom attendu par le backend)
    if (xsrfToken) {
      config.headers['X-CSRF-Token'] = xsrfToken; // 🔒 Protection CSRF côté serveur
    }


    return config;
  },


  // En cas d’erreur lors de la configuration, on rejette la requête
  error => Promise.reject(error)
);

