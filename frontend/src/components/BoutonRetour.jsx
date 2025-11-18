// src/components/BoutonRetour.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/BoutonRetour.css';

const BoutonRetour = () => {
  const navigate = useNavigate();

  // 🧠 Logique : afficher le bouton uniquement si l'utilisateur a un historique
  const canGoBack = window.history.length > 1;

  if (!canGoBack) return null; // 👈 ne rien afficher s'il vient directement (ex : lien externe, première visite)

  return (
    <button className="bouton-retour" onClick={() => navigate(-1)}>
      ← Retour
    </button>
  );
};

export default BoutonRetour;

