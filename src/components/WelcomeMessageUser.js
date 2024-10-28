import React, { useState, useEffect } from 'react';

const WelcomeMessageUser = () => {
  // Frases inspiradoras relacionadas con el universo del juego
  const quotes = [
    "Explora nuevos mundos, descubre misterios inimaginables.",
    "Cada decisión forma el destino del universo.",
    "Únete a la odisea y deja tu marca entre las estrellas.",
    "La aventura te espera, cada estrella un destino por descubrir."
  ];

  // Mensaje de bienvenida que cambia según el día de la semana
  const getDailyMessage = () => {
    // Ajustar para tomar la fecha actual y calcular el día de la semana correctamente
    const today = new Date();
    const dayOfWeek = today.getDay();
    const messages = [
      "¡Empieza la semana con una nueva aventura!",  // Domingo - index 0
      "Es lunes, un gran día para explorar el cosmos.",
      "Martes: sigue tu curiosidad a nuevas historias.",
      "Mitad de semana: perfecto para una nueva misión.",  // Miércoles - index 3
      "Jueves de leyendas: escribe la tuya.",
      "Viernes, el preludio de épicas aventuras de fin de semana.",
      "Sábado de descubrimientos, ¿qué encontrarás hoy?"
    ];
    return messages[dayOfWeek];
  };

  // Estado para almacenar la frase inspiradora aleatoria
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Seleccionar una frase aleatoria cada vez que el componente se monta
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="welcome-message">
      <h2>¡Bienvenido a Estelar Odyssey!</h2>
      <p>{getDailyMessage()}</p>
      <p>{quote}</p>
    </div>
  );
};

export default WelcomeMessageUser;
