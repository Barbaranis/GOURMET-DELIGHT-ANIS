import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../Style/GestionReservations.css';


const GestionReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    date: '',
    guests: '',
    valide: false,
  });


  // 🔄 Charger les réservations
  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setReservations(data);
      localStorage.setItem('reservations_seen', 'true');
    } catch (err) {
      console.error('Erreur lors du chargement des réservations :', err);
    }
  };


  useEffect(() => {
    fetchReservations();
  }, []);


  // 🗑 Supprimer une réservation
  const supprimerReservation = async (id) => {
    if (!window.confirm('Confirmez-vous la suppression de cette réservation ?')) return;
    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };


  // ✅ Valider une réservation
  const validerReservation = async (id) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { valide: true });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, valide: true } : r))
      );
    } catch (err) {
      console.error('Erreur lors de la validation :', err);
    }
  };


  // ✏️ Ouvrir le mode édition
  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      name: reservation.name || '',
      email: reservation.email || '',
      date: reservation.date || '',
      guests: reservation.guests || '',
      valide: reservation.valide || false,
    });
  };


  // 🧩 Gérer la saisie du formulaire d’édition
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  // 💾 Sauvegarder la modification Firestore
  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, 'reservations', id), {
        name: editForm.name,
        email: editForm.email,
        date: editForm.date,
        guests: editForm.guests,
        valide: editForm.valide,
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...editForm } : r))
      );
      setEditingId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      alert('Erreur lors de la mise à jour de la réservation.');
    }
  };


  // ❌ Annuler la modification
  const handleCancel = () => {
    setEditingId(null);
  };


  return (
    <div className="gestion-reservations" role="main" aria-labelledby="titre-reservations">
      <h2 id="titre-reservations">📅 Réservations</h2>


      <div className="table-container" role="region" aria-label="Liste des réservations">
        <table className="reservations-table" role="table">
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Email</th>
              <th scope="col">Date</th>
              <th scope="col">Personnes</th>
              <th scope="col">Statut</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>


          <tbody>
            {reservations.map(({ id, name, email, date, guests, valide }) => (
              <tr key={id}>
                {editingId === id ? (
                  <>
                    {/* ÉDITION EN LIGNE */}
                    <td>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        aria-label="Modifier le nom"
                      />
                    </td>
                    <td>
                      <input
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleChange}
                        aria-label="Modifier l’email"
                      />
                    </td>
                    <td>
                      <input
                        name="date"
                        type="date"
                        value={editForm.date}
                        onChange={handleChange}
                        aria-label="Modifier la date"
                      />
                    </td>
                    <td>
                      <input
                        name="guests"
                        type="number"
                        value={editForm.guests}
                        onChange={handleChange}
                        aria-label="Modifier le nombre de personnes"
                      />
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          name="valide"
                          checked={editForm.valide}
                          onChange={handleChange}
                          aria-label="Statut validé"
                        />{' '}
                        {editForm.valide ? 'Validée' : 'En attente'}
                      </label>
                    </td>
                    <td>
                      <button onClick={() => handleSave(id)} className="save">💾 Enregistrer</button>
                      <button onClick={handleCancel} className="cancel">❌ Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* MODE LECTURE */}
                    <td>{name}</td>
                    <td>
                      <a href={`mailto:${email}`} aria-label={`Contacter ${email}`}>
                        {email}
                      </a>
                    </td>
                    <td>{date}</td>
                    <td>{guests}</td>
                    <td>
                      <span
                        className={valide ? 'statut valide' : 'statut attente'}
                        role="status"
                        aria-label={valide ? 'Réservation validée' : 'Réservation en attente'}
                      >
                        {valide ? '✅ Validée' : '⏳ En attente'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      {!valide && (
                        <button
                          className="validate"
                          onClick={() => validerReservation(id)}
                          aria-label={`Valider la réservation de ${name}`}
                        >
                          Valider
                        </button>
                      )}
                      <button
                        className="edit"
                        onClick={() => handleEdit({ id, name, email, date, guests, valide })}
                        aria-label={`Modifier la réservation de ${name}`}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="delete"
                        onClick={() => supprimerReservation(id)}
                        aria-label={`Supprimer la réservation de ${name}`}
                      >
                        🗑 Supprimer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default GestionReservations;





