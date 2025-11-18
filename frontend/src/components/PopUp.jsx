import React, { useEffect, useState } from 'react';
import '../Style/PopUp.css'; // On va gérer le style à part

const PopUp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const popupDisplayed = sessionStorage.getItem('popupDisplayed');
    if (!popupDisplayed) {
      setVisible(true);
      sessionStorage.setItem('popupDisplayed', 'true');
    }
  }, []);

  const closePopup = () => {
    setVisible(false);
    document.body.style.overflow = 'auto';
  };

  if (!visible) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>🎉 Offre Spéciale Gourmet ! 🎉</h2>
        <p>
          Bienvenue chez <strong>Gourmet Delight</strong>, où la gastronomie devient poésie.
          Pour célébrer votre venue, nous vous offrons une <strong>réduction de 20%</strong> sur votre première réservation !
        </p>
        <ul>
          <li>🍷 Plats raffinés et inoubliables</li>
          <li>🧁 Desserts d’exception faits maison</li>
          <li>🍾 Sélections de vins rares</li>
        </ul>
        <p>Profitez de cette offre exclusive maintenant.</p>
        <button onClick={closePopup}>Entrer dans l’univers</button>
      </div>
    </div>
  );
};

export default PopUp;

