import React, { useState, useEffect, useCallback } from 'react';
import api from '../axiosConfig';
import '../Style/GestionEmployes.css';


const INIT = { nom: '', prenom: '', email: '', mot_de_passe: '', role: '', telephone: '' };


const GestionEmployes = () => {
  const [form, setForm] = useState(INIT);
  const [feedback, setFeedback] = useState('');
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);


  // 🔧 mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  // 🔐 CSRF pour POST/PUT/DELETE
  const ensureCsrf = useCallback(async () => {
    try {
      const { data } = await api.get('/api/csrf-token', { withCredentials: true });
      if (data?.csrfToken) api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
    } catch (e) { console.warn('⚠️ CSRF token non récupéré', e); }
  }, []);


  // 📥 Liste
  const fetchEmployes = useCallback(async () => {
    try {
      const res = await api.get('/api/utilisateurs', {
        withCredentials: true,
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', 'If-Modified-Since': '0' },
        params: { _ts: Date.now() },
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setEmployes(data);
      setFeedback('');
    } catch (err) {
      console.error('❌ Erreur récupération employés :', err);
      const code = err?.response?.status;
      if (code === 401) setFeedback('❌ Non authentifié.');
      else if (code === 403) setFeedback('❌ Accès interdit.');
      else setFeedback('❌ Impossible de charger les employés (auth/CSRF ?).');
    }
  }, []);


  useEffect(() => { fetchEmployes(); }, [fetchEmployes]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  // ➕ / 💾 Ajouter ou Enregistrer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);
    try {
      await ensureCsrf();


      // payload propre (si édition et mot_de_passe vide → ne pas l’envoyer)
      const payload = { ...form };
      if (isEditing && !payload.mot_de_passe) delete payload.mot_de_passe;


      if (isEditing && editId) {
        await api.put(`/api/utilisateurs/${editId}`, payload, { withCredentials: true });
        setFeedback('✅ Employé modifié avec succès.');
      } else {
        await api.post('/api/utilisateurs', payload, { withCredentials: true });
        setFeedback('✅ Employé ajouté avec succès.');
      }


      setForm(INIT);
      setIsEditing(false);
      setEditId(null);
      await fetchEmployes();
    } catch (err) {
      console.error(err);
      setFeedback('❌ Erreur : ' + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };


  // ✏️ Passer en mode édition
  const handleEdit = (emp) => {
    setForm({
      nom: emp.nom || '',
      prenom: emp.prenom || '',
      email: emp.email || '',
      mot_de_passe: '', // vide par défaut (on ne force pas le changement)
      role: emp.role || '',
      telephone: emp.telephone || '',
    });
    setIsEditing(true);
    setEditId(emp.id_utilisateur);
    setFeedback('');
  };


  // ❌ Annuler l’édition
  const cancelEdit = () => {
    setForm(INIT);
    setIsEditing(false);
    setEditId(null);
    setFeedback('');
  };


  // 🗑️ Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm('❗ Supprimer cet employé ?')) return;
    try {
      await ensureCsrf();
      await api.delete(`/api/utilisateurs/${id}`, { withCredentials: true });
      setFeedback('✅ Employé supprimé.');
      await fetchEmployes();
    } catch (err) {
      console.error(err);
      setFeedback('❌ Erreur suppression : ' + (err?.response?.data?.message || err.message));
    }
  };


  return (
    <div className="gestion-employes">
      <h2>{isEditing ? '✏️ Modifier un employé' : '👤 Ajouter un employé'}</h2>


      <form className="form-ajout" onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input
          type="password"
          name="mot_de_passe"
          placeholder={isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
          value={form.mot_de_passe}
          onChange={handleChange}
          required={!isEditing} // requis seulement à l’ajout
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">-- Rôle --</option>
          <option value="maitre_hotel">Maître d’hôtel</option>
          <option value="chef_cuisine">Chef de cuisine</option>
          <option value="responsable_salle">Responsable de salle</option>
          <option value="responsable_avis">Responsable avis</option>
          <option value="responsable_communication">Responsable communication</option>
          <option value="gestionnaire_contenu">Gestionnaire contenu</option>
          <option value="employe">Employé</option>
          <option value="admin">Admin</option>
        </select>
        <input name="telephone" placeholder="Téléphone (facultatif)" value={form.telephone} onChange={handleChange} />


        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? (isEditing ? 'Enregistrement…' : 'Ajout en cours…') : (isEditing ? '💾 Enregistrer' : 'Ajouter')}
          </button>
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>Annuler</button>
          )}
        </div>
      </form>


      {feedback && <p className="feedback">{feedback}</p>}


      <h2>📋 Liste des employés</h2>
      {employes.length === 0 ? (
        <p>Aucun employé enregistré.</p>
      ) : (
        <ul className="liste-employes">
          {employes.map((emp) => (
            <li key={emp.id_utilisateur}>
              <div>
                {emp.nom} {emp.prenom} — <strong>{emp.role}</strong> — {emp.email} {emp.telephone ? `— ${emp.telephone}` : ''}
              </div>
              <div className="row-actions">
                <button className="btn-edit" onClick={() => handleEdit(emp)}>✏️ Modifier</button>
                <button className="btn-delete" onClick={() => handleDelete(emp.id_utilisateur)}>🗑 Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default GestionEmployes;





