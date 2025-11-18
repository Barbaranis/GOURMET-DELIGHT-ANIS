import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseClient';
import DOMPurify from 'dompurify';
import '../Style/Contact.css';
import CookieBanner from '../components/CookieBanner';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState('');
  const recaptchaRef = useRef(null);


  // ⬇️ Charger le script reCAPTCHA une seule fois
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Veuillez saisir votre nom.';
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez saisir votre email.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide.';
    }
    if (!formData.message.trim()) newErrors.message = 'Veuillez saisir un message.';
    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    setErrors(validationErrors);


    if (Object.keys(validationErrors).length === 0) {
      // 🔐 Vérif reCAPTCHA
      const token = window.grecaptcha?.getResponse();
      if (!token) {
        setApiError("Veuillez cocher le reCAPTCHA.");
        return;
      }


      try {
        await addDoc(collection(db, 'messages'), {
          name: DOMPurify.sanitize(formData.name),
          email: DOMPurify.sanitize(formData.email),
          message: DOMPurify.sanitize(formData.message),
          createdAt: serverTimestamp()
        });
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
        window.grecaptcha.reset(); // ♻️ Reset reCAPTCHA après envoi
      } catch (error) {
        console.error("❌ Erreur Firestore :", error);
        setApiError("Erreur lors de l'envoi. Réessayez plus tard.");
      }
    }
  };


  return (
    <div className="contact-page" role="main" aria-labelledby="contact-title">
      <h1 id="contact-title">Contactez-nous</h1>


      {sent && <p className="success-msg">✅ Merci pour votre message !</p>}
      {apiError && <p className="error-msg" role="alert">{apiError}</p>}


      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Champ NOM */}
        <div>
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "error-name" : null}
            placeholder="Votre nom complet"
          />
          {errors.name && <span id="error-name" className="error-msg">{errors.name}</span>}
        </div>


        {/* Champ EMAIL */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "error-email" : null}
            placeholder="exemple@domaine.com"
          />
          {errors.email && <span id="error-email" className="error-msg">{errors.email}</span>}
        </div>


        {/* Champ MESSAGE */}
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "error-message" : null}
            placeholder="Votre message"
          />
          {errors.message && <span id="error-message" className="error-msg">{errors.message}</span>}
        </div>


        {/* 🔒 reCAPTCHA visible */}
        <div
          className="g-recaptcha"
          data-sitekey="6Lf4dosrAAAAAFTGUzeyKtbrKE9OW7WTobBfyK42"
          ref={recaptchaRef}
        ></div>
<CookieBanner />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};


export default Contact;

