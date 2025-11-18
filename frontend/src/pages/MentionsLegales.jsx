//src/pages/MentionsLegales.jsx




import React from 'react';
import '../Style/MentionsLegales.css';



const MentionsLegales = () => {
  return (
    <main className="mentions-legales" role="main" aria-labelledby="mentions-title">
      
      <h1 id="mentions-title">Mentions légales</h1>


      <section>
        <h2>Éditeur du site</h2>
        <p><strong>Nom du site :</strong> Gourmet Delight</p>
        <p><strong>Responsable de la publication :</strong> Anis Barbara</p>
        <p><strong>Email :</strong> contact@gourmet-delight.fr</p>
        <p><strong>Adresse :</strong> 26 rue des Anis, 75007 Paris, France</p>
      </section>


      <section>
        <h2>Hébergement</h2>
        <p><strong>Hébergeur :</strong> Netlify</p>
        <p><strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, CA 94107</p>
        <p><strong>Site :</strong> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">www.netlify.com</a></p>
      </section>


      <section>
        <h2>Propriété intellectuelle</h2>
        <p>Le contenu du site (textes, images, logos, etc.) est protégé par les lois en vigueur sur la propriété intellectuelle et est la propriété exclusive de Gourmet Delight. Toute reproduction ou utilisation sans autorisation écrite est interdite.</p>
      </section>


      <section>
        <h2>Protection des données</h2>
        <p>Les données collectées via nos formulaires sont utilisées uniquement dans le cadre de la gestion des réservations, des avis et des messages. Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles. Pour exercer vos droits, contactez-nous à <a href="mailto:contact@gourmet-delight.fr">contact@gourmet-delight.fr</a>.</p>
      </section>


      <section>
        <h2>Cookies</h2>
        <p>Des cookies peuvent être installés automatiquement dans votre navigateur pour améliorer l’expérience utilisateur. Vous pouvez les gérer ou les désactiver dans les paramètres de votre navigateur. Un bandeau d’information et de consentement est affiché à la première visite.</p>
      </section>


      <section>
        <h2>Responsabilité</h2>
        <p>Gourmet Delight ne peut être tenu responsable des erreurs typographiques ou inexactitudes techniques. Les liens vers d'autres sites sont fournis à titre informatif ; nous ne pouvons être tenus responsables de leur contenu.</p>
      </section>


      <p className="footer-note">Dernière mise à jour : Juillet 2025</p>
    </main>
  );
};


export default MentionsLegales;

