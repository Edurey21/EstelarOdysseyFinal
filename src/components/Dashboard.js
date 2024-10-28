// src/components/Dashboard.js

// Importaciones necesarias para gestionar el tablero
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css'; // Importa el archivo CSS correspondiente

// Componente Dashboard para mostrar las historias y colaboraciones del usuario
const Dashboard = ({ userId }) => {
  const [templates, setTemplates] = useState([]); // Estado para almacenar las plantillas
  const [collaborations, setCollaborations] = useState([]); // Estado para almacenar las colaboraciones

  // Función para obtener las plantillas del usuario
  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*')
      .eq('user_id', userId); // Filtra por el ID del usuario

    if (error) {
      console.error('Error fetching templates:', error); // Muestra un error si ocurre
    } else {
      setTemplates(data); // Guarda las plantillas en el estado
    }
  };

  // Función para obtener las colaboraciones del usuario
  const fetchCollaborations = async () => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('*, Templates(storyTitle)') // Obtiene las colaboraciones y sus plantillas
      .eq('user_id', userId); // Filtra por el ID del usuario

    if (error) {
      console.error('Error fetching collaborations:', error); // Muestra un error si ocurre
    } else {
      setCollaborations(data); // Guarda las colaboraciones en el estado
    }
  };

  // useEffect para cargar las plantillas y colaboraciones cuando cambia el ID del usuario
  useEffect(() => {
    if (userId) {
      fetchTemplates(); // Llama a la función para obtener plantillas
      fetchCollaborations(); // Llama a la función para obtener colaboraciones
    }
  }, [userId]); // Se ejecuta cada vez que cambia el userId

  // Renderizado del componente Dashboard
  return (
    <div>
      <h2>Bienvenido a tus historias</h2>
      <p>Bienvenido a tu tablero. Aquí podrás ver y gestionar tus historias.</p>

      {/* Sección de plantillas del usuario */}
      <h3>Tus Plantillas</h3>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <Link to={`/template/${template.id}`}>
              <h4>{template.storyTitle}</h4>
            </Link>
            <p><strong>Descripción:</strong> {template.description}</p>
          </li>
        ))}
      </ul>

      {/* Sección de colaboraciones del usuario */}
      <h3>Tus Colaboraciones</h3>
      <ul>
        {collaborations.map((collab) => (
          <li key={collab.id}>
            <Link to={`/collaboration/${collab.id}`}>
              <h4>{collab.Templates.storyTitle}</h4>
            </Link>
            <p><strong>Rol en la historia:</strong> {collab.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
