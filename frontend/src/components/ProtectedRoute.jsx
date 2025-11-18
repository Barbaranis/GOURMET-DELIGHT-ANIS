//src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';


/**
 * Composant de route protégée par token et/ou rôle
 * @param {ReactNode} children - Composant enfant à afficher si autorisé
 * @param {string[]} allowedRoles - (optionnel) Liste des rôles autorisés
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');


  // 🔐 Si non connecté → redirection vers la page de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // 🔒 Si un filtre de rôles est défini, on vérifie si le rôle courant est autorisé
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }


  // ✅ Si tout est bon, on affiche les enfants
  return children;
};


export default ProtectedRoute;

