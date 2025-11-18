//src/pages/NotificationBadge.jsx




import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './NotificationBadge.css';


const NotificationBadge = ({
  collectionName,
  firestoreFilter = {},
  localStorageKey = '',
  customFilter = () => true
}) => {
  const [count, setCount] = useState(0);
  const [hasSeen, setHasSeen] = useState(() => {
    return localStorageKey ? localStorage.getItem(localStorageKey) === 'true' : true;
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        let colRef = collection(db, collectionName);


        // Appliquer les filtres Firestore s’il y en a
        Object.entries(firestoreFilter).forEach(([key, value]) => {
          colRef = query(colRef, where(key, '==', value));
        });


        const snapshot = await getDocs(colRef);
        const docs = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(customFilter);


        setCount(docs.length);
      } catch (err) {
        console.error('Erreur dans NotificationBadge :', err);
      }
    };


    fetchData();
  }, [collectionName, firestoreFilter, customFilter]);


  if (count === 0) return null;


  const colorClass = hasSeen ? 'badge-blue' : 'badge-red';


  return (
    <span
      className={`notification-badge ${colorClass}`}
      role="status"
      aria-label={`${count} élément(s) à traiter`}
    >
      {count}
    </span>
  );
};


export default NotificationBadge;


