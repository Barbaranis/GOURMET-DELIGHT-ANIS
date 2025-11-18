// 📁 src/pages/Testimonials.jsx


import React, { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import DOMPurify from 'dompurify'; // 🛡️ Protection XSS
import '../Style/Testimonials.css';


const Testimonials = () => {
  const [form, setForm] = useState({ name: '', content: '', stars: 5, plat: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [plats, setPlats] = useState([]);


  // 🔄 Charger dynamiquement les plats disponibles
  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'plats'));
        const platsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlats(platsData);
      } catch (error) {
        console.error("Erreur lors du chargement des plats :", error);
      }
    };


    fetchPlats();
  }, []);


  // ✅ Validation des champs
  const validate = () => {
    const errs = {};
    if (!form.content.trim()) errs.content = 'Le texte est obligatoire.';
    if (!form.plat) errs.plat = 'Veuillez sélectionner un plat.';
    if (form.name && !/^[\p{L}\s'-]{2,30}$/u.test(form.name.trim()))
      errs.name = 'Prénom invalide (lettres, espaces, 2-30 caractères).';
    if (form.stars < 1 || form.stars > 5) errs.stars = 'Note invalide.';
    return errs;
  };


  // 🔁 Mise à jour du formulaire
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'stars' ? Number(value) : value
    }));
  };


  // 📤 Soumission sécurisée du témoignage
  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }


    // 🧼 Protection XSS : on nettoie tout avant d’enregistrer
    const newTestimonial = {
      name: DOMPurify.sanitize(form.name.trim() || 'Anonyme'),
      content: DOMPurify.sanitize(form.content.trim()),
      stars: form.stars,
      platConcerné: DOMPurify.sanitize(form.plat),
      dateSoumission: serverTimestamp(),
      validated: false,
      refused: false
    };


    try {
      await addDoc(collection(db, 'temoignages'), newTestimonial);
      setForm({ name: '', content: '', stars: 5, plat: '' });
      setErrors({});
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur Firestore :", err);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };


  return (
    <section className="testimonial-form-section">
      <h2>Laissez votre témoignage</h2>


      {submitted ? (
        <p className="success-message">
          Merci pour votre avis ! Il sera publié après validation.
        </p>
      ) : (
        <form className="testimonial-form" onSubmit={handleSubmit} noValidate>
          {/* Champ prénom (optionnel) */}
          <label htmlFor="name">Prénom (optionnel)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Votre prénom"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="error">{errors.name}</span>}


          {/* Choix du plat */}
          <label htmlFor="plat">Plat concerné *</label>
          <select
            id="plat"
            name="plat"
            value={form.plat}
            onChange={handleChange}
            required
            aria-invalid={!!errors.plat}
          >
            <option value="">-- Choisissez un plat --</option>
            {plats.map((plat) => (
              <option key={plat.id} value={plat.nom}>
                {plat.nom}
              </option>
            ))}
          </select>
          {errors.plat && <span className="error">{errors.plat}</span>}


          {/* Contenu du témoignage */}
          <label htmlFor="content">Votre avis *</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Votre message ici..."
            required
            rows={4}
            aria-invalid={!!errors.content}
          />
          {errors.content && <span className="error">{errors.content}</span>}


          {/* Note en étoiles */}
          <label htmlFor="stars">Votre note *</label>
          <select
            id="stars"
            name="stars"
            value={form.stars}
            onChange={handleChange}
            required
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>
          {errors.stars && <span className="error">{errors.stars}</span>}


          <button type="submit">Envoyer</button>
        </form>
      )}
    </section>
  );
};


export default Testimonials;

