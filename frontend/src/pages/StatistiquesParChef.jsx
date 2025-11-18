import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/StatistiquesChef.css';


const StatistiquesParChef = () => {
  const [stats, setStats] = useState({});


  useEffect(() => {
    const fetchReservations = async () => {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const data = snapshot.docs.map(doc => doc.data());


      const parChef = {};
      data.forEach(res => {
        const chef = res.chef || 'Non assigné';
        parChef[chef] = (parChef[chef] || 0) + 1;
      });


      setStats(parChef);
    };


    fetchReservations();
  }, []);


  return (
    <div className="statistiques-chef">
      <h2>📊 Statistiques des Réservations par Chef</h2>


      {Object.keys(stats).length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Chef</th>
              <th>Réservations</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([chef, count]) => (
              <tr key={chef}>
                <td>{chef}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default StatistiquesParChef;

