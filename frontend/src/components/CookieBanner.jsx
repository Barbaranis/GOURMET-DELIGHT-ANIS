// 📁 src/components/CookieBanner.jsx
import React, { useState, useEffect } from 'react';
import '../Style/CookieBanner.css';


const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);


    // Écouteur pour rouvrir la modale depuis n’importe où
    const handleOpenModal = () => setModalOpen(true);
    window.addEventListener('openCookieModal', handleOpenModal);
    return () => window.removeEventListener('openCookieModal', handleOpenModal);
  }, []);


  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
    setModalOpen(false);
  };


  const refuseCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setVisible(false);
    setModalOpen(false);
  };


  if (!visible && !modalOpen) return null;


  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Bannière de consentement aux cookies">
      {!modalOpen && (
        <>
          <p>
            🍪 En poursuivant votre navigation, vous acceptez l’utilisation de cookies pour améliorer votre expérience utilisateur
            et garantir la sécurité des services. Vous pouvez accepter ou refuser à tout moment.
          </p>
          <div className="cookie-buttons">
            <button onClick={acceptCookies} className="accept-btn" aria-label="Accepter les cookies">Accepter</button>
            <button onClick={refuseCookies} className="refuse-btn" aria-label="Refuser les cookies">Refuser</button>
            <button onClick={() => setModalOpen(true)} aria-haspopup="dialog" aria-expanded={modalOpen}>Gérer mes choix</button>
          </div>
        </>
      )}


      {modalOpen && (
        <div className="cookie-modal" role="alertdialog" aria-modal="true" aria-labelledby="cookie-modal-title">
          <div className="cookie-modal-content">
            <h2 id="cookie-modal-title">Paramètres des cookies</h2>


            <p>
              Chez <strong>Gourmet Delight</strong>, nous utilisons uniquement des cookies fonctionnels, essentiels au bon
              fonctionnement de notre site. Aucun cookie publicitaire ou de suivi n’est utilisé.
            </p>


            <p>
              📌 Les données collectées (nom, email, réservation...) sont utilisées uniquement pour la gestion interne de vos
              demandes. Aucune donnée n’est vendue ni transférée à des tiers.
            </p>


            <p>
              🔒 Vous pouvez modifier vos choix à tout moment depuis notre page de{' '}
              <a href="/politique-confidentialite" aria-label="Voir la politique de confidentialité">
                politique de confidentialité
              </a>.
            </p>


            <div className="modal-actions">
              <button onClick={acceptCookies} className="accept-btn">Tout accepter</button>
              <button onClick={refuseCookies} className="refuse-btn">Tout refuser</button>
              <button onClick={() => setModalOpen(false)} className="close-modal">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CookieBanner;

