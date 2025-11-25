import axios from "axios";
import "../interceptors/axiosInterceptor"; // <-- IMPORTANT : pour activer l'intercepteur CSRF


// 🔗 URL du backend Render (automatique via .env)
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // ou process.env.REACT_APP_API_URL si CRA
  withCredentials: true, // ⬅️ Obligatoire pour cookies JWT + CSRF
});


export default api;

