// 📁 src/pages/PolitiqueConfidentialite.jsx
import React from 'react';
import '../Style/PolitiqueConfidentialite.css';


const PolitiqueConfidentialite = () => {
  return (
    <main className="politique-page" role="main" aria-labelledby="titre-politique">
      <h1 id="titre-politique">Politique de confidentialité</h1>


      <section aria-labelledby="section-intro">
        <h2 id="section-intro">1. Introduction</h2>
        <p>
          Bienvenue sur le site de Gourmet Delight. Cette politique vous explique comment nous collectons, utilisons et sécurisons vos données personnelles, conformément au <strong>Règlement Général sur la Protection des Données (RGPD - UE 2016/679)</strong>.
        </p>
      </section>


      <section aria-labelledby="section-responsable">
        <h2 id="section-responsable">2. Responsable du traitement</h2>
        <p>
          Le responsable du traitement est <strong>Gourmet Delight</strong>, situé au 26 rue des Anis, 75007 Paris. Représenté légalement par son dirigeant. Contact : <a href="mailto:contact@gourmet-delight.fr">contact@gourmet-delight.fr</a>.
        </p>
      </section>


      <section aria-labelledby="section-donnees">
        <h2 id="section-donnees">3. Données collectées</h2>
        <p>Données strictement nécessaires :</p>
        <ul>
          <li>Nom, prénom</li>
          <li>Email</li>
          <li>Téléphone (facultatif)</li>
          <li>Message ou réservation</li>
          <li>Données de navigation anonymes (cookies)</li>
        </ul>
      </section>


      <section aria-labelledby="section-base-legale">
        <h2 id="section-base-legale">4. Base légale du traitement</h2>
        <p>
          Les données sont traitées sur la base de :
        </p>
        <ul>
          <li>Votre consentement (formulaires, cookies)</li>
          <li>L’exécution d’un contrat (réservation)</li>
          <li>L’intérêt légitime (sécurité du site)</li>
        </ul>
      </section>


      <section aria-labelledby="section-finalites">
        <h2 id="section-finalites">5. Finalités de la collecte</h2>
        <p>Données utilisées pour :</p>
        <ul>
          <li>Gérer les réservations et messages</li>
          <li>Améliorer l’expérience utilisateur</li>
          <li>Garantir la sécurité</li>
          <li>Répondre aux obligations légales</li>
        </ul>
      </section>


      <section aria-labelledby="section-cookies">
        <h2 id="section-cookies">6. Cookies</h2>
        <p>
          Cookies essentiels uniquement. Consentement requis via bannière. Pas de cookies publicitaires. Vous pouvez les refuser à tout moment ou gérer vos préférences.
        </p>
      </section>


      <section aria-labelledby="section-conservation">
        <h2 id="section-conservation">7. Durée de conservation</h2>
        <p>
          Les données sont conservées 3 ans maximum après le dernier contact. Les cookies sont stockés 13 mois.
        </p>
      </section>


      <section aria-labelledby="section-securite">
        <h2 id="section-securite">8. Sécurité</h2>
        <p>
          Stockage sécurisé sur Firebase et PostgreSQL. Mesures de sécurité mises en place : chiffrement, protections XSS/CSRF, journalisation.
        </p>
      </section>


      <section aria-labelledby="section-transfert">
        <h2 id="section-transfert">9. Transferts hors UE</h2>
        <p>
          Certains traitements peuvent être opérés hors de l’UE (ex : Firebase de Google, hébergé aux États-Unis). Dans ce cas, nous nous assurons que les fournisseurs respectent les clauses contractuelles types (SCC) ou un cadre équivalent.
        </p>
      </section>


      <section aria-labelledby="section-droits">
        <h2 id="section-droits">10. Vos droits</h2>
        <p>Vous pouvez :</p>
        <ul>
          <li>Accéder à vos données</li>
          <li>Les rectifier ou les supprimer</li>
          <li>Vous opposer à leur traitement</li>
          <li>Demander la portabilité</li>
        </ul>
        <p>
          Exercez vos droits via : <a href="mailto:contact@gourmet-delight.fr">contact@gourmet-delight.fr</a>.
          En cas de litige, vous pouvez contacter la <strong>CNIL</strong> : <a href="https://www.cnil.fr">www.cnil.fr</a>.
        </p>
      </section>


      <section aria-labelledby="section-abus">
        <h2 id="section-abus">11. Messages abusifs</h2>
        <p>
          Tout contenu injurieux, menaçant ou discriminatoire pourra faire l’objet d’un signalement aux autorités compétentes.
        </p>
      </section>


      <section aria-labelledby="section-registre">
        <h2 id="section-registre">12. Registre des traitements</h2>
        <p>
          Gourmet Delight tient à jour un registre de ses traitements de données, conformément à l’article 30 du RGPD.
        </p>
      </section>


      <section aria-labelledby="section-modifs">
        <h2 id="section-modifs">13. Modifications</h2>
        <p>
          Cette politique peut être modifiée. Dernière mise à jour : <strong>22 juillet 2025</strong>.
        </p>
      </section>


      <p className="signature-politique">
        Merci de faire confiance à Gourmet Delight. Votre confidentialité est notre engagement.
      </p>
    </main>
  );
};


export default PolitiqueConfidentialite;



