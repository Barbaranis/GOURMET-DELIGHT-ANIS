//src/pages/StatistiquesChefs.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient'; 
import '../Style/Statistiques.css'; 

const StatistiquesChefs = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'chefsStats'));
        const data = snapshot.docs.map(doc => doc.data());
        const sorted = data.sort((a, b) => b.consultations - a.consultations);
        setStats(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="statistiques-page" role="main" aria-labelledby="statistiques-title">
      <h1 id="statistiques-title">Statistiques de Consultation des Chefs</h1>

      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : stats.length === 0 ? (
        <p>Aucune donnée de consultation disponible pour le moment.</p>
      ) : (
        <table className="statistiques-table">
          <thead>
            <tr>
              <th>Chef</th>
              <th>Consultations</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((chef, index) => (
              <tr key={index}>
                <td>
                  {chef.nom}
                  {index === 0 && <span className="top-chef-badge">🔥</span>}
                </td>
                <td>{chef.consultations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default StatistiquesChefs;
