import React, { useEffect, useState } from 'react';
import '../Style/DashboardAdmin.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';


// Images des chefs
import lucien from '../assets/chefs/lucien.jpg';
import sakura from '../assets/chefs/sakura.jpg';
import giacomo from '../assets/chefs/giacomo.jpg';


const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [avisCount, setAvisCount] = useState(0);
  const [topChef, setTopChef] = useState(null);


  const handleNavigation = (path) => {
    navigate(path);
  };


  const chefsImages = {
    'Lucien d’Albray': lucien,
    'Sakura Yamashita': sakura,
    'Giacomo Bellandi': giacomo,
  };


  // 🔍 Avis en attente
  useEffect(() => {
    const fetchAvisNonValides = async () => {
      try {
        const q = query(collection(db, 'temoignages'), where('validated', '==', false));
        const snapshot = await getDocs(q);
        setAvisCount(snapshot.size);
      } catch (err) {
        console.error('Erreur lors du chargement des avis en attente :', err);
      }
    };


    fetchAvisNonValides();
  }, []);


  // 🔥 Chef populaire
  useEffect(() => {
    const fetchTopChef = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'chefsStats'));
        const data = snapshot.docs.map(doc => doc.data());
        const sorted = data.sort((a, b) => b.consultations - a.consultations);
        if (sorted.length > 0) {
          setTopChef(sorted[0]);
        }
      } catch (error) {
        console.error("Erreur récupération chef populaire :", error);
      }
    };


    fetchTopChef();
  }, []);


  return (
    <main className="dashboard-admin" role="main" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="dashboard-title">Tableau de bord – Administrateur</h1>


      {/* Carte du chef populaire */}
      {topChef && (
        <section
          className="dashboard-chef-card"
          aria-label={`Chef le plus consulté : ${topChef.nom}`}
        >
          <div className="chef-card-summary">
            <img
              src={chefsImages[topChef.nom]}
              alt={`Portrait de ${topChef.nom}`}
              className="chef-card-image"
            />
            <div className="chef-card-text">
              <h3>🔥 Chef le plus consulté</h3>
              <p className="chef-name">{topChef.nom}</p>
              <p>{topChef.consultations} consultations</p>
            </div>
          </div>
        </section>
      )}


      {/* Navigation */}
      <nav className="dashboard-grid" aria-label="Navigation admin">
        <button onClick={() => handleNavigation('/admin/employes')}>
          👤 Gérer les employés
        </button>
        <button onClick={() => handleNavigation('/admin/plats')}>
          🍽️ Gérer les plats
        </button>
        <button onClick={() => handleNavigation('/admin/reservations')}>
          📅 Gérer les réservations
        </button>
        <button onClick={() => handleNavigation('/admin/messages')}>
          ✉️ Voir les messages
        </button>
        <button
          onClick={() => handleNavigation('/admin/avis')}
          aria-label={`Gérer les avis clients${avisCount > 0 ? ` – ${avisCount} en attente` : ''}`}
        >
          💬 Gérer les avis clients
          {avisCount > 0 && (
            <span className="badge-avis" aria-hidden="true">{avisCount}</span>
          )}
        </button>
        <button onClick={() => handleNavigation('/admin/contenu-site')}>
          📝 Modifier le contenu du site
        </button>
        <button onClick={() => handleNavigation('/admin/statistiques')}>
          📊 Statistiques chefs
        </button>
        <button onClick={() => handleNavigation('/admin/statistiques-reservations')}>
          📈 Statistiques réservations
        </button>
      </nav>
    </main>
  );
};


export default DashboardAdmin;

