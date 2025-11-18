//src/pages/Reservation1.jsx

 import React, { useState } from 'react';
import '../Style/Reservation.css';
import { db } from '../firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import DOMPurify from 'dompurify'; //  Protection XSS
import CookieBanner from '../components/CookieBanner';



const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    message: '',
    chef: ''
  });


  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  // 🔄 Met à jour le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // ✅ Validation des champs
  const validate = () => {
    const newErrors = {};


    if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(formData.name.trim())) {
      newErrors.name = 'Veuillez entrer un nom valide.';
    }


    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email.trim())) {
      newErrors.email = 'Adresse email invalide.';
    }


    if (!formData.date) newErrors.date = 'Veuillez choisir une date.';
    if (!formData.time) newErrors.time = 'Veuillez choisir une heure.';


    if (!/^[1-9][0-9]?$/.test(formData.guests)) {
      newErrors.guests = 'Entre 1 et 99 personnes.';
    }


    return newErrors;
  };


  // 🧼 Protection XSS + soumission vers Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();


    if (Object.keys(validationErrors).length === 0) {
      try {
        // 🔐 Nettoyage XSS avec DOMPurify
        const sanitizedData = {
          name: DOMPurify.sanitize(formData.name.trim()),
          email: DOMPurify.sanitize(formData.email.trim()),
          date: formData.date,
          time: formData.time,
          guests: DOMPurify.sanitize(formData.guests.toString()),
          message: DOMPurify.sanitize(formData.message.trim()),
          chef: DOMPurify.sanitize(formData.chef),
          createdAt: serverTimestamp()
        };


        await addDoc(collection(db, 'reservations'), sanitizedData);


        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          date: '',
          time: '',
          guests: '',
          message: '',
          chef: ''
        });
        setErrors({});
      } catch (error) {
        console.error('Erreur Firestore :', error);
        alert("Une erreur s’est produite lors de l’enregistrement.");
      }
    } else {
      setErrors(validationErrors);
    }
  };


  return (
    <main className="reservation-page" role="main" aria-labelledby="reservation-title">
      
      <h1 id="reservation-title">Réservez votre table</h1>


      {submitted ? (
        <div className="confirmation">
          Merci pour votre réservation ! Nous vous contacterons rapidement.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="reservation-form" noValidate>
          {/* Nom */}
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
            placeholder="Jean Dupont"
          />
          {errors.name && <span id="name-error" role="alert" className="error">{errors.name}</span>}


          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            placeholder="exemple@mail.com"
          />
          {errors.email && <span id="email-error" role="alert" className="error">{errors.email}</span>}


          {/* Date */}
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            aria-invalid={!!errors.date}
            aria-describedby="date-error"
          />
          {errors.date && <span id="date-error" role="alert" className="error">{errors.date}</span>}


          {/* Heure */}
          <label htmlFor="time">Heure</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            aria-invalid={!!errors.time}
            aria-describedby="time-error"
          />
          {errors.time && <span id="time-error" role="alert" className="error">{errors.time}</span>}


          {/* Nombre de personnes */}
          <label htmlFor="guests">Nombre de personnes</label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max="99"
            value={formData.guests}
            onChange={handleChange}
            aria-invalid={!!errors.guests}
            aria-describedby="guests-error"
            placeholder="2"
          />
          {errors.guests && <span id="guests-error" role="alert" className="error">{errors.guests}</span>}


          {/* Chef préféré */}
          <label htmlFor="chef">Chef préféré (optionnel)</label>
          <select id="chef" name="chef" value={formData.chef} onChange={handleChange}>
            <option value="">-- Choisir un chef (facultatif) --</option>
            <option value="Lucien d’Albray">Lucien d’Albray</option>
            <option value="Sakura Yamashita">Sakura Yamashita</option>
            <option value="Giacomo Bellandi">Giacomo Bellandi</option>
          </select>


          {/* Message */}
          <label htmlFor="message">Message (optionnel)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Allergies, préférences, etc."
          />
<CookieBanner />

          <button type="submit">Envoyer</button>
        </form>
      )}
    </main>
  );
};


export default Reservation;

