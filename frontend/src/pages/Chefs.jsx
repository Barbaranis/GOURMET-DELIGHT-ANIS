import React, { useState, useEffect } from 'react';
import '../Style/Chefs.css';


import lucien from '../assets/chefs/lucien.jpg';
import sakura from '../assets/chefs/sakura.jpg';
import giacomo from '../assets/chefs/giacomo.jpg';


import { db } from '../firebaseClient';
import { doc, setDoc, increment } from 'firebase/firestore';


const chefs = [
  {
    nom: 'Lucien d’Albray',
    specialite: 'Cuisine française moléculaire',
    image: lucien,
    histoire: `Lucien est le génie visionnaire derrière l’expérience gastronomique du Gourmet Delight. Ancien élève de l’institut Paul Bocuse, il a décroché sa première étoile à 26 ans pour sa revisite du foie gras infusé à l’hibiscus. Il est le chef exécutif du restaurant, supervise chaque assiette et signe les créations du menu dégustation.`,
    creations: [
      { nom: "Foie gras à l’hibiscus", description: "Émulsion délicate et florale, en entrée signature." },
      { nom: "Saint-Jacques en sphérification", description: "Explosion marine en bouche." }
    ]
  },
  {
    nom: 'Sakura Yamashita',
    specialite: 'Fusion japonaise-méditerranéenne',
    image: sakura,
    histoire: `Née à Osaka, Sakura est la poétesse des saveurs inattendues. Connue pour sa signature « sashimi de daurade au citron confit », elle a reçu deux étoiles pour son travail sur les textures marines. Elle est responsable des entrées et plats froids, apportant une touche florale et artistique.`,
    creations: [
      { nom: "Sashimi de daurade au citron confit", description: "Assiette florale, subtile et rafraîchissante." },
      { nom: "Ceviche de thon à la lavande", description: "Mariage audacieux entre Méditerranée et Japon." }
    ]
  },
  {
    nom: 'Giacomo Bellandi',
    specialite: 'Desserts à l’italienne',
    image: giacomo,
    histoire: `Maestro du sucré, Giacomo est un magicien toscan de la pâtisserie. Connu pour son « tiramisu suspendu », il a été élu meilleur chef pâtissier d’Europe en 2022. Il conclut chaque repas avec une œuvre d’art sucrée, qui fait revenir les clients pour le dessert.`,
    creations: [
      { nom: "Tiramisu suspendu", description: "Dessert aérien servi dans une verrine flottante." },
      { nom: "Gelato à la truffe blanche", description: "Alliance surprenante entre glace et gastronomie fine." }
    ]
  }
];


const Chefs = () => {
  const [activeChef, setActiveChef] = useState(null);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      setActiveChef(null);
    }
  };


  const normalizeId = (nom) => {
    return nom
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };


  const enregistrerConsultation = async (chef) => {
    try {
      const idChef = normalizeId(chef.nom);
      const docRef = doc(db, 'chefsStats', idChef);
      await setDoc(docRef, {
        nom: chef.nom,
        consultations: increment(1)
      }, { merge: true });
    } catch (error) {
      console.error("Erreur en enregistrant la consultation :", error);
    }
  };


  return (
    <main className="chefs-page" role="main" aria-labelledby="chefs-title">
      <h1 id="chefs-title">Nos Chefs Étoilés</h1>
      <section className="chefs-grid">
        {chefs.map((chef, index) => (
          <div
            className="chef-card"
            key={index}
            onMouseEnter={() => {
              if (!isMobile) {
                setActiveChef(index);
                enregistrerConsultation(chef);
              }
            }}
            onMouseLeave={() => !isMobile && setActiveChef(null)}
          >
            <img src={chef.image} alt={`Portrait de ${chef.nom}`} className="chef-img" />
            <h2 className="chef-name">{chef.nom}</h2>
            <p className="chef-specialite">{chef.specialite}</p>


            {isMobile ? (
              <button
                className="voir-plus"
                onClick={() => {
                  setActiveChef(index);
                  enregistrerConsultation(chef);
                }}
              >
                Voir plus
              </button>
            ) : (
              activeChef === index && (
                <div className="chef-hover-detail" role="dialog" aria-label={`Détails sur ${chef.nom}`}>
                  <p>{chef.histoire}</p>
                  <ul className="chef-creations">
                    {chef.creations.map((c, i) => (
                      <li key={i}><strong>{c.nom}</strong> — {c.description}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        ))}
      </section>


      {isMobile && activeChef !== null && (
        <div className="popup-overlay" onClick={handleOutsideClick}>
          <div className="popup-content" role="dialog" aria-label={`Détails sur ${chefs[activeChef].nom}`}>
            <button className="close-btn" onClick={() => setActiveChef(null)} aria-label="Fermer">×</button>
            <h2>{chefs[activeChef].nom}</h2>
            <p><strong>Spécialité :</strong> {chefs[activeChef].specialite}</p>
            <p>{chefs[activeChef].histoire}</p>
            <ul className="chef-creations">
              {chefs[activeChef].creations.map((c, i) => (
                <li key={i}><strong>{c.nom}</strong> — {c.description}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};


export default Chefs;





