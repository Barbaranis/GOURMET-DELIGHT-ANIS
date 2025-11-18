import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';


import '../Style/Footer.css';
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.png';
import xIcon from '../assets/x.png';
import tiktokIcon from '../assets/tiktok.png';


const Footer = () => {
  const [horaires, setHoraires] = useState({ semaine: '', weekend: '' });
  const [popup, setPopup] = useState(null);


  useEffect(() => {
    const fetchHoraires = async () => {
      try {
        const docRef = doc(db, 'contenuSite', 'Principal');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setHoraires({
            semaine: data.horairesSemaine || 'Lun - Ven : 12h - 14h / 19h - 23h',
            weekend: data.horairesWeekend || 'Sam - Dim : 12h - 00h'
          });
        }
      } catch (err) {
        console.error('Erreur chargement horaires du footer :', err);
      }
    };
    fetchHoraires();
  }, []);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setPopup(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);


  const handlePopup = (section) => {
    setPopup(section === popup ? null : section);
  };


  const renderPopup = () => {
    if (!popup) return null;


    let content;
    switch (popup) {
      case 'contact':
        content = (
          <>
            <p><strong>Email :</strong> <a href="mailto:contact@gourmet-delight.fr">contact@gourmet-delight.fr</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:+33125242625">01 25 24 26 25</a></p>
            <p><strong>Adresse :</strong> 26 rue des Anis, 75007 Paris</p>
          </>
        );
        break;
      case 'horaires':
        content = (
          <>
            <p>{horaires.semaine}</p>
            <p>{horaires.weekend}</p>
          </>
        );
        break;
      case 'navigation':
        content = (
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/chefs">Chefs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/avis">Avis</Link></li>
            <li><Link to="/reservation">Réservation</Link></li>
          </ul>
        );
        break;
      case 'infos':
        content = (
          <ul>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/politique-confidentialite">Politique de confidentialité</Link></li>
            <li><Link to="/cgu-cgv">CGU / CGV</Link></li>
            <Link to="/registre-rgpd">Registre RGPD</Link>


            <li>
              <button
                onClick={() => window.dispatchEvent(new Event('openCookieModal'))}
                className="cookie-link"
                aria-label="Préférences cookies"
              >
                Gérer mes cookies
              </button>
            </li>
          </ul>
        );
        break;
      default:
        content = null;
    }


    return (
      <div className="footer-popup" role="dialog" aria-modal="true" aria-label={`Détails ${popup}`}>
        <div className="footer-popup-content">
          <button className="close-popup" onClick={() => setPopup(null)} aria-label="Fermer">✕</button>
          {content}
        </div>
      </div>
    );
  };


  return (
    <footer className="footer" role="contentinfo" aria-label="Pied de page Gourmet Delight">
      <div className="footer-columns">


        <button onClick={() => handlePopup('contact')} aria-expanded={popup === 'contact'} className="footer-button">Contact</button>
        <button onClick={() => handlePopup('horaires')} aria-expanded={popup === 'horaires'} className="footer-button">Horaires</button>
        <button onClick={() => handlePopup('navigation')} aria-expanded={popup === 'navigation'} className="footer-button">Navigation</button>
        <button onClick={() => handlePopup('infos')} aria-expanded={popup === 'infos'} className="footer-button">Infos légales</button>


        <div className="footer-section">
          <h4 id="footer-reseaux">Suivez-nous</h4>
          <nav className="social-icons" aria-label="Réseaux sociaux">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><img src={facebookIcon} alt="Facebook" /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><img src={instagramIcon} alt="Instagram" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src={xIcon} alt="X" /></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><img src={tiktokIcon} alt="TikTok" /></a>
          </nav>
        </div>
      </div>


      {renderPopup()}


      <div className="footer-note">
        <p>© 2025 Gourmet Delight – L'excellence à la française.</p>
      </div>
    </footer>
  );
};


export default Footer;

