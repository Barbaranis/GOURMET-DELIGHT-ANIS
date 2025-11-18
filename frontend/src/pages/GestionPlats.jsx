// ✅ src/pages/GestionPlats.jsx
import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import '../Style/GestionPlats.css';


const API_BASE =
  (api?.defaults?.baseURL && api.defaults.baseURL.replace(/\/$/, '')) ||
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) ||
  '';


/** Helpers */
const getCatId = (cat) => Number(cat?.id ?? cat?.id_categorie ?? cat?.ID ?? cat?.Id ?? NaN);
const toNumber = (v) => Number(String(v ?? '').replace(',', '.').trim());


const GestionPlats = () => {
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);


  const [newPlat, setNewPlat] = useState({
    nom: '',
    description: '',
    prix: '',
    id_categorie: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);


  const role = localStorage.getItem('role');


  // --- CSRF helper
  const ensureCsrf = async () => {
    try {
      const { data } = await api.get('/api/csrf-token', { withCredentials: true });
      if (data?.csrfToken) {
        api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
      }
    } catch (err) {
      console.warn('⚠️ CSRF token non récupéré', err);
    }
  };


  useEffect(() => {
    fetchCategories();
    fetchPlats();
  }, []);


  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const { data } = await api.get('/api/categories');
      const list = Array.isArray(data) ? data : [];
      setCategories(list);
    } catch (e) {
      console.error('❌ Erreur chargement catégories :', e);
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };


  const fetchPlats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/plats', { withCredentials: true });
      setPlats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Erreur récupération des plats :', err);
      setMessage('❌ Impossible de charger les plats.');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlat((prev) => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };


  const handleEdit = (plat) => {
    setEditMode(true);
    setEditId(plat.id_plat);
    setNewPlat({
      nom: plat.nom || '',
      description: plat.description || '',
      prix: String(plat.prix ?? ''),
      id_categorie: String(plat.id_categorie ?? ''),
    });
    setImageFile(null);
    setMessage('✏️ Modification du plat en cours...');
  };


  const resetForm = () => {
    setNewPlat({ nom: '', description: '', prix: '', id_categorie: '' });
    setImageFile(null);
    setEditMode(false);
    setEditId(null);
    setMessage('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      await ensureCsrf();


      const prixNum = toNumber(newPlat.prix);
      const catIdNum = toNumber(newPlat.id_categorie);


      if (Number.isNaN(prixNum) || Number.isNaN(catIdNum)) {
        setMessage('⚠️ Le prix et la catégorie doivent être des nombres valides.');
        return;
      }


      const formData = new FormData();
      formData.append('nom', newPlat.nom.trim());
      formData.append('description', (newPlat.description || '').trim());
      formData.append('prix', prixNum);
      formData.append('id_categorie', catIdNum);
      if (imageFile) formData.append('image', imageFile);


      const config = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      };


      if (editMode && editId) {
        await api.put(`/api/plats/${editId}`, formData, config);
        setMessage('✅ Plat mis à jour avec succès.');
      } else {
        if (!imageFile) {
          setMessage('❌ L’image est obligatoire pour ajouter un plat.');
          return;
        }
        await api.post('/api/plats', formData, config);
        setMessage('✅ Plat ajouté avec succès.');
      }


      resetForm();
      await fetchPlats();
    } catch (err) {
      console.error('❌ Erreur soumission plat :', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '❌ Erreur lors de la soumission.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce plat ?')) return;
    try {
      setLoading(true);
      await ensureCsrf();
      await api.delete(`/api/plats/${id}`, { withCredentials: true });
      setMessage('🗑️ Plat supprimé.');
      await fetchPlats();
    } catch (err) {
      console.error('❌ Erreur suppression plat :', err);
      setMessage('❌ Impossible de supprimer le plat.');
    } finally {
      setLoading(false);
    }
  };


  const getCategorieNom = (id) => {
    const cat = categories.find((c) => getCatId(c) === Number(id));
    return cat ? cat.nom : 'Inconnue';
  };


  if (role !== 'admin' && role !== 'chef_cuisine') {
    return <p className="forbidden">⛔ Accès interdit.</p>;
  }


  return (
    <div className="gestion-plats">
      <h2>🍽️ Gérer les Plats</h2>


      <form onSubmit={handleSubmit} className="form-plat" encType="multipart/form-data">
        <input
          name="nom"
          placeholder="Nom"
          value={newPlat.nom}
          onChange={handleChange}
          required
        />


        <input
          name="description"
          placeholder="Description"
          value={newPlat.description}
          onChange={handleChange}
        />


        <input
          name="prix"
          placeholder="Prix (€)"
          value={newPlat.prix}
          onChange={handleChange}
          type="number"
          step="0.01"
          required
        />


        <select
          name="id_categorie"
          value={newPlat.id_categorie}
          onChange={handleChange}
          required
          disabled={loadingCats || categories.length === 0}
        >
          <option value="">
            {loadingCats ? 'Chargement des catégories…' : '-- Sélectionner une catégorie --'}
          </option>
          {categories.map((cat) => (
            <option key={getCatId(cat)} value={getCatId(cat)}>
              {cat.nom}
            </option>
          ))}
        </select>


        {/* ✅ Image actuelle visible lors de l’édition */}
        {editMode && editId && (() => {
          const current = plats.find((p) => p.id_plat === editId);
          if (!current?.image_url) return null;
          return (
            <div className="current-image-preview">
              <p>Image actuelle :</p>
              <img
                src={`${API_BASE}/uploads/${current.image_url}`}
                alt={current.nom}
                className="miniature-image"
              />
            </div>
          );
        })()}


        {/* ✅ Nouvelle image (preview avant validation) */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageFile && (
          <div className="preview-image">
            <p>Nouvelle image sélectionnée :</p>
            <img
              src={URL.createObjectURL(imageFile)}
              alt=""
              aria-hidden="true"
              className="miniature-image"
            />
          </div>
        )}


        <button type="submit" disabled={loading}>
          {loading ? 'Veuillez patienter…' : editMode ? 'Mettre à jour' : 'Ajouter le plat'}
        </button>


        {editMode && (
          <button type="button" onClick={resetForm} className="secondary">
            Annuler
          </button>
        )}
      </form>


      {message && <p className="message">{message}</p>}


      <ul className="liste-plats">
        {plats.map((plat) => (
          <li key={plat.id_plat} className="plat-item">
            {plat.image_url && (
              <img
                src={`${API_BASE}/uploads/${plat.image_url}`}
                alt={plat.nom}
                className="plat-image"
              />
            )}
            <div className="plat-info">
              <strong>{plat.nom}</strong> – {Number(plat.prix).toFixed(2)} €
              <br />
              <em>{getCategorieNom(plat.id_categorie)}</em>
              {plat.description && <p>{plat.description}</p>}
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(plat)} className="edit-btn">Modifier</button>
              <button onClick={() => handleDelete(plat.id_plat)} className="delete-btn">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default GestionPlats;

