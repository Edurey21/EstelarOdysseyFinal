// src/components/StoryList.js

// Importaciones necesarias para el componente de lista de historias
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './StoryList.css'; // Importa los estilos del componente

// Componente StoryList que muestra las historias destacadas
const StoryList = () => {
  const [stories, setStories] = useState([]); // Estado para almacenar las historias

  // useEffect que se ejecuta al cargar el componente para obtener las historias
  useEffect(() => {
    const fetchTopStories = async () => {
      // Consulta a la base de datos para obtener las historias junto con las colaboraciones
      const { data, error } = await supabase
        .from('Templates')
        .select('id, storyTitle, description, Collaborations (id)'); // Selecciona los datos de la tabla Templates

      if (error) {
        console.error('Error fetching stories:', error); // Muestra un error si ocurre algún problema en la consulta
        return;
      }

      if (data) {
        // Mapea las historias con la cantidad de colaboradores
        const storiesWithCollaborators = data.map(story => ({
          id: story.id,
          storyTitle: story.storyTitle,
          description: story.description,
          collaboratorCount: story.Collaborations.length // Cuenta el número de colaboradores
        }));

        // Ordena las historias por número de colaboradores y selecciona las 3 principales
        const sortedStories = storiesWithCollaborators
          .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
          .slice(0, 3); // Limita a las 3 historias con más colaboradores

        setStories(sortedStories); // Actualiza el estado con las historias destacadas
      }
    };

    fetchTopStories(); // Llama a la función para obtener las historias al cargar el componente
  }, []);

  // Renderizado del componente StoryList
  return (
    <div className="story-list">
      <h3>Historias Destacadas</h3> {/* Título de la sección */}
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <h4>{story.storyTitle}</h4> {/* Título de la historia */}
            <p>{story.description}</p> {/* Descripción de la historia */}
            <p><strong>Colaboradores:</strong> {story.collaboratorCount}</p> {/* Número de colaboradores */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
