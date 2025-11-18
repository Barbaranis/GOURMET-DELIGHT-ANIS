import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/Statistiques.css';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#A28CF5'];


const StatistiquesReservations = () => {
  const [reservationsStats, setReservationsStats] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reservations'));
        const data = snapshot.docs.map(doc => doc.data());


        // Calcul des stats par chef
        const stats = data.reduce((acc, reservation) => {
          const chef = reservation.chef || 'Non attribué';
          acc[chef] = (acc[chef] || 0) + 1;
          return acc;
        }, {});


        setReservationsStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
      }
    };


    fetchReservations();
  }, []);


  const chartData = Object.entries(reservationsStats).map(([chef, count]) => ({
    name: chef,
    value: count,
  }));


  return (
    <main className="statistiques-page" role="main" aria-labelledby="statistiques-reservations-title">
      <h1 id="statistiques-reservations-title">📅 Statistiques des Réservations par Chef</h1>


      {loading ? (
        <p>Chargement des données...</p>
      ) : chartData.length === 0 ? (
        <p>Aucune réservation trouvée pour le moment.</p>
      ) : (
        <>
          {/* Camembert */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>


          {/* Tableau classique */}
          <table className="statistiques-table">
            <thead>
              <tr>
                <th>Chef</th>
                <th>Nombre de réservations</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map(({ name, value }) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
};


export default StatistiquesReservations;

