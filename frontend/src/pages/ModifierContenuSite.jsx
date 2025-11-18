import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/ModifierContenuSite.css';
import BoutonRetour from '../components/BoutonRetour';


const ModifierContenuSite = () => {
  const [contenu, setContenu] = useState({
    accueilIntroTitre: '',
    accueilIntroTexte: '',
    reservationTexte: '',
    aProposHistoire: '',
    aProposMission: '',
    aProposHommage: '',
    horairesSemaine: '',
    horairesWeekend: ''
  });


  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchContenu = async () => {
      const docRef = doc(db, 'contenuSite', 'Principal');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setContenu(snapshot.data());
      }
      setLoading(false);
    };
    fetchContenu();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setContenu(prev => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'contenuSite', 'Principal'), contenu);
      setMessage('✅ Contenu mis à jour avec succès.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur s'est produite.");
    }
  };


  if (loading) return <p>Chargement du contenu...</p>;


  return (
    <div className="modifier-contenu">
      <BoutonRetour />
      <h2>📝 Modifier le contenu du site</h2>
      {message && <div className="message-feedback">{message}</div>}


      <label>Titre accueil :</label>
      <input name="accueilIntroTitre" value={contenu.accueilIntroTitre} onChange={handleChange} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.accueilIntroTitre}</p>
      </div>


      <label>Texte accueil :</label>
      <textarea name="accueilIntroTexte" value={contenu.accueilIntroTexte} onChange={handleChange} rows={3} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.accueilIntroTexte}</p>
      </div>


      <label>Texte réservation :</label>
      <textarea name="reservationTexte" value={contenu.reservationTexte} onChange={handleChange} rows={2} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.reservationTexte}</p>
      </div>


      <label>Notre histoire :</label>
      <textarea name="aProposHistoire" value={contenu.aProposHistoire} onChange={handleChange} rows={4} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.aProposHistoire}</p>
      </div>


      <label>Notre mission :</label>
      <textarea name="aProposMission" value={contenu.aProposMission} onChange={handleChange} rows={3} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.aProposMission}</p>
      </div>


      <label>Hommage à Anis :</label>
      <textarea name="aProposHommage" value={contenu.aProposHommage} onChange={handleChange} rows={3} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.aProposHommage}</p>
      </div>


      <label>Horaires (semaine) :</label>
      <input name="horairesSemaine" value={contenu.horairesSemaine} onChange={handleChange} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.horairesSemaine}</p>
      </div>


      <label>Horaires (week-end) :</label>
      <input name="horairesWeekend" value={contenu.horairesWeekend} onChange={handleChange} />
      <div className="preview-block">
        <strong>Aperçu :</strong>
        <p>{contenu.horairesWeekend}</p>
      </div>


      <button onClick={handleSave}>💾 Enregistrer</button>
    </div>
  );
};


export default ModifierContenuSite;

