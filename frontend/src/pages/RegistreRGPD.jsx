// 📁 src/pages/RegistreRGPD.jsx
import React from 'react';
import '../Style/RegistreRGPD.css';

const RegistreRGPD = () => {
  return (
    <main className="registre-rgpd" role="main" aria-labelledby="titre-registre">
      <h1 id="titre-registre">Registre des traitements de données</h1>

      <p>
        Ce registre décrit les traitements de données à caractère personnel effectués sur le site <strong>Gourmet Delight</strong>, conformément aux obligations du RGPD.
      </p>

      <section>
        <h2>1. Fiche de traitement – Réservations clients</h2>
        <ul>
          <li><strong>Finalité :</strong> Gérer les réservations de tables</li>
          <li><strong>Données traitées :</strong> nom, prénom, email, date, heure, nombre de personnes, message</li>
          <li><strong>Base légale :</strong> Exécution d’un contrat (article 6.1.b du RGPD)</li>
          <li><strong>Durée de conservation :</strong> 3 ans après le dernier contact</li>
          <li><strong>Accès :</strong> Employés autorisés, responsables salle</li>
          <li><strong>Sécurité :</strong> Firestore sécurisé + Logging</li>
        </ul>
      </section>

      <section>
        <h2>2. Fiche de traitement – Formulaire de contact</h2>
        <ul>
          <li><strong>Finalité :</strong> Répondre aux demandes des utilisateurs</li>
          <li><strong>Données traitées :</strong> nom, email, message</li>
          <li><strong>Base légale :</strong> Intérêt légitime (article 6.1.f du RGPD)</li>
          <li><strong>Durée de conservation :</strong> 3 ans après réception</li>
          <li><strong>Accès :</strong> Admin et gestionnaire de contenu</li>
          <li><strong>Sécurité :</strong> Firestore + accès restreint</li>
        </ul>
      </section>

      <section>
        <h2>3. Fiche de traitement – Avis utilisateurs</h2>
        <ul>
          <li><strong>Finalité :</strong> Collecte de témoignages</li>
          <li><strong>Données traitées :</strong> prénom, avis</li>
          <li><strong>Base légale :</strong> Consentement (article 6.1.a)</li>
          <li><strong>Durée de conservation :</strong> 1 an (ou jusqu’au retrait du consentement)</li>
          <li><strong>Accès :</strong> Admin uniquement</li>
          <li><strong>Sécurité :</strong> Validation manuelle + Firestore</li>
        </ul>
      </section>

      <section>
        <h2>4. Fiche de traitement – Données des employés</h2>
        <ul>
          <li><strong>Finalité :</strong> Gestion du personnel et des accès</li>
          <li><strong>Données traitées :</strong> nom, prénom, email, mot de passe chiffré, rôle</li>
          <li><strong>Base légale :</strong> Obligations contractuelles</li>
          <li><strong>Durée de conservation :</strong> 3 ans après départ</li>
          <li><strong>Accès :</strong> Administrateur</li>
          <li><strong>Sécurité :</strong> PostgreSQL + chiffrement + JWT</li>
        </ul>
      </section>

      <p className="registre-note">
        Pour toute demande d’accès, de modification ou de suppression de vos données, veuillez nous contacter à : <strong>contact@gourmet-delight.fr</strong>.
      </p>
    </main>
  );
};

export default RegistreRGPD;

