// 📁 src/pages/CGUCGV.jsx
import React from 'react';
import '../Style/CGUCGV.css';


const CGUCGV = () => {
  return (
    <main className="cgu-cgv" role="main" aria-label="Conditions générales du site Gourmet Delight">
      <h1>Conditions Générales d’Utilisation & de Vente (CGU/CGV)</h1>


      <section>
        <h2>1. Présentation du site</h2>
        <p>
          Le site <strong>Gourmet Delight</strong> est une plateforme de présentation, réservation et commande de prestations gastronomiques
          proposées par notre restaurant. Il est édité par la société Gourmet Delight, dont le siège est situé au 26 rue des Anis, 75007 Paris.
        </p>
      </section>


      <section>
        <h2>2. Acceptation des conditions</h2>
        <p>
          L’accès au site implique l’acceptation pleine et entière des présentes conditions générales. En utilisant le site, vous vous engagez à les respecter.
        </p>
      </section>


      <section>
        <h2>3. Réservations et commandes</h2>
        <p>
          Les réservations peuvent être effectuées via notre formulaire dédié. Toute réservation est confirmée par email. Les commandes spécifiques
          (par ex. pour événements) sont traitées individuellement.
        </p>
      </section>


      <section>
        <h2>4. Tarifs et paiements</h2>
        <p>
          Les prix sont indiqués en euros TTC. Le paiement s’effectue sur place au restaurant. Pour les événements privatisés, un acompte peut être demandé.
        </p>
      </section>


      <section>
        <h2>5. Propriété intellectuelle</h2>
        <p>
          Tous les contenus (textes, images, recettes, logos, design) sont la propriété de Gourmet Delight. Toute reproduction est interdite sans autorisation.
        </p>
      </section>


      <section>
        <h2>6. Données personnelles</h2>
        <p>
          Les informations collectées via les formulaires sont utilisées uniquement pour la gestion des réservations, avis et messages. Elles ne sont en aucun cas revendues. Voir notre <a href="/politique-confidentialite">politique de confidentialité</a>.
        </p>
      </section>


      <section>
        <h2>7. Responsabilités</h2>
        <p>
          Gourmet Delight décline toute responsabilité en cas d’interruption de service ou de perte de données due à un événement extérieur (cyberattaque, incident serveur, etc.).
        </p>
      </section>


      <section>
        <h2>8. Litiges</h2>
        <p>
          En cas de litige, une tentative de médiation sera privilégiée. À défaut, le litige sera porté devant les juridictions compétentes de Paris.
        </p>
      </section>


      <p className="cgu-note">Dernière mise à jour : Juillet 2025</p>
    </main>
  );
};


export default CGUCGV;

