// src/components/ImageCarousel.js
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Estilos del carrusel

// Importa las imágenes que se mostrarán en el carrusel
import img1 from '../img/img1.jpg';
import img2 from '../img/img2.jpg';
import img3 from '../img/img3.jpg';
import './ImageCarousel.css'; // Archivo CSS para estilos personalizados

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onChange = (index) => {
    setCurrentIndex(index);
  };

  // Títulos y descripciones para cada imagen
  const captions = [
    { title: "Explora el Universo", description: "Descubre planetas lejanos y civilizaciones extraterrestres." },
    { title: "Furia de las Estrellas", description: "Participa en batallas épicas entre galaxias." },
    { title: "Misterios del Espacio", description: "Resuelve los enigmas más profundos del cosmos." }
  ];

  return (
    <div className="carousel-text-animated">
      <Carousel
        selectedItem={currentIndex}
        onChange={onChange}
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={1000}
        useKeyboardArrows
        emulateTouch
      >
        {captions.map((caption, index) => (
          <div key={index} className="carousel-slide">
            <img src={[img1, img2, img3][index]} alt={`Imagen ${index + 1}`} className="carousel-image" />
            <div className="carousel-caption-container">
              <h2 className="carousel-title">{caption.title}</h2>
              <p className="carousel-description">{caption.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
