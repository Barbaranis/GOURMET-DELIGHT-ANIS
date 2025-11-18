// src/pages/DashboardEmployes.jsx



import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/DashboardEmploye.css';


const DashboardEmploye = () => {
  const role = localStorage.getItem('role');
  const prenom = localStorage.getItem('prenom') || 'Employé';
  const navigate = useNavigate();


  if (!role) {
    return <p className="forbidden">⛔ Accès interdit. Veuillez vous connecter.</p>;
  }


  const handleNavigate = (path) => {
    navigate(path);
  };


  return (
    <div className="dashboard-employe">
      <h2>👋 Bonjour {prenom}</h2>
      <h3>🎓 Tableau de bord – Rôle : <span>{role}</span></h3>


      {role === 'chef_cuisine' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/plats')}>🍽️ Gérer les Plats</button>
        </div>
      )}


      {role === 'maitre_hotel' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/messages')}>📬 Gérer les Messages</button>
          <button onClick={() => handleNavigate('/admin/avis')}>🗣️ Gérer les Avis</button>
        </div>
      )}


      {role === 'responsable_salle' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/reservations')}>📅 Gérer les Réservations</button>
        </div>
      )}


      {role === 'responsable_avis' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/avis')}>🗣️ Gérer les Avis</button>
        </div>
      )}


      {role === 'responsable_communication' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/messages')}>📬 Gérer les Messages</button>
        </div>
      )}


      {role === 'gestionnaire_contenu' && (
        <div className="dashboard-section">
          <button onClick={() => handleNavigate('/admin/contenu-site')}>📝 Modifier le contenu du site</button>
        </div>
      )}
    </div>
  );
};


export default DashboardEmploye;

