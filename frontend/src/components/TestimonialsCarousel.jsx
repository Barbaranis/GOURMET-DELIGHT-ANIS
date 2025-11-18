// src/components/TestimonialsCarousel.jsx


import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { db } from '../firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';


import 'swiper/css';
import 'swiper/css/pagination';
import '../Style/TestimonialsCarousel.css';


const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);


  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, 'temoignages'), where('validated', '==', true));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTestimonials(data.reverse());
      } catch (error) {
        console.error('Erreur lors du chargement des témoignages :', error);
      }
    };


    fetchTestimonials();
  }, []);


  return (
    <section className="testimonials">
      <h2>Avis clients</h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
      >
        {testimonials.map(({ id, name, content, stars }) => (
          <SwiperSlide key={id}>
            <blockquote>
              <p>{content}</p>
              <footer>
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i} role="img" aria-label="étoile">⭐</span>
                ))}
                {' — '}
                {name}
              </footer>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};


export default TestimonialsCarousel;

