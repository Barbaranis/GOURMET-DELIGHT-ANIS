// ✅ src/axiosConfig.js
import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://gourmet-delight-anis.onrender.com/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // cookies (JWT httpOnly / CSRF)
  timeout: 20000,
});



api.interceptors.request.use(
  (config) => {
    // ⚠️ Ne PAS forcer application/json si on envoie du FormData
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;

    // Si tu utilises un vrai JWT dans localStorage (sinon enlève)
    const token = localStorage.getItem('token');
    if (token && token !== 'cookie') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Pour les requêtes JSON uniquement, on met le Content-Type
    if (!isFormData) {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    } else {
      // Laisse Axios définir multipart/form-data;boundary=...
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    console.warn('⚠️ Erreur API', status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;

