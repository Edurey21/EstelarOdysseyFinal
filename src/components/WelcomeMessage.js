// src/components/WelcomeMessage.js

// Componente funcional para mostrar un mensaje de bienvenida estático
import React from 'react';

// Componente que muestra el mensaje de bienvenida general para Estelar Odyssey
const WelcomeMessage = () => {
  return (
    <div className="welcome-message">
      <h2>¡Bienvenido a Estelar Odyssey!</h2> {/* Título del mensaje de bienvenida */}
      <p>
        Únete a un universo de ciencia ficción donde puedes explorar, crear y colaborar en historias épicas. 
        Escoge tu rol, define tu misión y explora los confines del espacio.
      </p> {/* Descripción de la experiencia en el juego */}
    </div>
  );
};

export default WelcomeMessage;
