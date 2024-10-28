// src/components/WelcomeMessageUser.js

// Componente funcional para mostrar un mensaje de bienvenida dinámico con frases inspiradoras
import React, { useState, useEffect } from 'react';

// Componente que muestra un mensaje personalizado al usuario
const WelcomeMessageUser = () => {
  // Lista de frases inspiradoras relacionadas con el universo del juego
  const quotes = [
    "Explora nuevos mundos, descubre misterios inimaginables.",
    "Cada decisión forma el destino del universo.",
    "Únete a la odisea y deja tu marca entre las estrellas.",
    "La aventura te espera, cada estrella un destino por descubrir."
  ];

  // Función que genera un mensaje diario de bienvenida basado en el día de la semana
  const getDailyMessage = () => {
    const today = new Date(); // Obtiene la fecha actual
    const dayOfWeek = today.getDay(); // Obtiene el número del día de la semana (0-6)
    
    // Lista de mensajes de bienvenida según el día de la semana
    const messages = [
      "¡Empieza la semana con una nueva aventura!",  // Domingo - index 0
      "Es lunes, un gran día para explorar el cosmos.",
      "Martes: sigue tu curiosidad a nuevas historias.",
      "Mitad de semana: perfecto para una nueva misión.",  // Miércoles - index 3
      "Jueves de leyendas: escribe la tuya.",
      "Viernes, el preludio de épicas aventuras de fin de semana.",
      "Sábado de descubrimientos, ¿qué encontrarás hoy?"
    ];

    return messages[dayOfWeek]; // Retorna el mensaje correspondiente al día actual
  };

  // Estado para almacenar la frase inspiradora aleatoria
  const [quote, setQuote] = useState('');

  // useEffect para seleccionar una frase aleatoria cuando el componente se monta
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]; // Selecciona una frase aleatoria
    setQuote(randomQuote); // Establece la frase en el estado
  }, []);

  // Renderizado del componente WelcomeMessageUser
  return (
    <div className="welcome-message">
      <h2>¡Bienvenido a Estelar Odyssey!</h2> {/* Título del mensaje de bienvenida */}
      <p>{getDailyMessage()}</p> {/* Muestra el mensaje diario */}
      <p>{quote}</p> {/* Muestra la frase inspiradora aleatoria */}
    </div>
  );
};

export default WelcomeMessageUser;
