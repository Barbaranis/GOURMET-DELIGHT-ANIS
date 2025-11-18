import React, { useEffect, useState } from 'react';
import '../Style/About.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseClient'; // Assurez-vous que ce chemin est correct


const About = () => {
  const [contenu, setContenu] = useState({
    aProposHistoire: '',
    aProposMission: '',
    aProposHommage: ''
  });


  useEffect(() => {
    const fetchContenu = async () => {
      try {
        const docRef = doc(db, 'contenuSite', 'Principal');
        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
          setContenu(docSnap.data());
        } else {
          console.error('Document non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du contenu :', error);
      }
    };


    fetchContenu();
  }, []);


  return (
    <main className="about-page">
      <section className="intro section">
        <h2>Notre histoire</h2>
        <p>{contenu.aProposHistoire}</p>
      </section>


      <section className="mission section">
        <h2>Notre mission</h2>
        <p>{contenu.aProposMission}</p>
      </section>


      <section className="values section">
        <h2>Nos valeurs</h2>
        <ul>
          <li><strong>Excellence :</strong> La recherche constante de la perfection.</li>
          <li><strong>Authenticité :</strong> Ingrédients locaux et respect des saisons.</li>
          <li><strong>Créativité :</strong> Fusion entre tradition et modernité.</li>
          <li><strong>Hospitalité :</strong> Accueil chaleureux et service attentif.</li>
        </ul>
      </section>


      <section className="legacy section">
        <h2>Un hommage à Anis</h2>
        <p>{contenu.aProposHommage}</p>
      </section>
    </main>
  );
};


export default About;

