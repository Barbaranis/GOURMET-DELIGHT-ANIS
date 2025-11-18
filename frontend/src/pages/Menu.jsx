// src/pages/Menu.jsx
import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import '../Style/Menu.css';


// 👉 clés en string pour éviter le mismatch "number vs string"
const CATEGORIES = {
  '1': 'Entrées',
  '2': 'Plats',
  '3': 'Desserts',
  '4': 'Boissons',
};


export default function Menu() {
  const [menuData, setMenuData] = useState({});
  const [activeTab, setActiveTab] = useState('Entrées');


  // 1) Fetch des plats une seule fois (pas de dépendances)
  useEffect(() => {
    let mounted = true;


    api
      .get('/api/plats')
      .then((res) => {
        const grouped = {};


        (Array.isArray(res.data) ? res.data : []).forEach((plat) => {
          // normalise l'id de catégorie en string
          const key = String(plat.id_categorie ?? '');
          const nomCat = CATEGORIES[key] || 'Autres';
          if (!grouped[nomCat]) grouped[nomCat] = [];


          // construit l'URL image à partir de la baseURL configurée dans axios
          const baseURL = api.defaults.baseURL?.replace(/\/+$/, '') || '';
          const img =
            typeof plat.image_url === 'string' && plat.image_url.startsWith('http')
              ? plat.image_url
              : plat.image_url
              ? `${baseURL}/uploads/${plat.image_url}`
              : null;


          grouped[nomCat].push({
            id: plat.id_plat,
            name: plat.nom,
            description: plat.description,
            price: `${plat.prix}€`,
            image_url: img,
          });
        });


        if (mounted) setMenuData(grouped);
      })
      .catch((err) => {
        console.error('❌ Erreur chargement menu :', err);
      });


    return () => {
      mounted = false;
    };
  }, []);


  // 2) Quand le menu est chargé, s’assurer que l’onglet actif existe
  useEffect(() => {
    const cats = Object.keys(menuData);
    if (!cats.length) return;


    if (!menuData[activeTab]) {
      setActiveTab(cats[0]); // bascule sur la 1re catégorie dispo
    }
  }, [menuData, activeTab]);


  return (
    <main className="menu-container">
      <section className="menu-intro">
        <h1>Découvrez nos plats</h1>
        <p>
          Savourez une sélection exquise de mets raffinés, préparés avec passion par nos chefs talentueux.
          Naviguez parmi nos catégories et laissez-vous tenter par l’exception gastronomique.
        </p>
      </section>


      <nav className="menu-tabs" role="tablist" aria-label="Catégories du menu">
        {Object.keys(menuData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={activeTab === category ? 'active' : ''}
            aria-selected={activeTab === category}
            role="tab"
            id={`tab-${category}`}
          >
            {category}
          </button>
        ))}
      </nav>


      <section
        className="menu-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {menuData[activeTab]?.length ? (
          menuData[activeTab].map(({ id, name, description, price, image_url }) => (
            <article key={id} className="menu-item">
              {image_url && <img src={image_url} alt={name} className="menu-item-image" />}
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <div className="menu-price">{price}</div>
            </article>
          ))
        ) : (
          <p>Aucun plat disponible pour cette catégorie.</p>
        )}
      </section>
    </main>
  );
}



