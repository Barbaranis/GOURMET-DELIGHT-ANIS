import React, { useState, useEffect } from 'react';
import './Style/Slider.css'; // On fera un CSS à part pour le style

const images = [
  '/assets/slide1.jpg',
  '/assets/slide2.jpg',
  '/assets/slide3.jpg',
  '/assets/slide4.jpg',
  // Ajoute autant d’images que tu veux ici
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Change d’image toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      {images.map((src, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden={index !== currentIndex}
        ></div>
      ))}
      <div className="slider-controls">
        {images.map((_, index) => (
          <button
            key={index}
            aria-label={`Afficher la diapositive ${index + 1}`}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;

