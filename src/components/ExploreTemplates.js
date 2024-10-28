// src/components/ExploreTemplates.js

// Importaciones necesarias para la funcionalidad de explorar plantillas
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ExploreTemplates.css'; // Importa el archivo CSS correspondiente

// Componente ExploreTemplates que permite unirse a plantillas creadas por otros usuarios
const ExploreTemplates = ({ userId }) => {
  const [templates, setTemplates] = useState([]); // Estado para almacenar plantillas disponibles
  const [joinedTemplates, setJoinedTemplates] = useState([]); // Estado para almacenar plantillas en las que ya participa el usuario
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Estado para la plantilla seleccionada
  const [role, setRole] = useState('Humano'); // Estado para el rol seleccionado
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes

  // Función para capitalizar la primera letra de una cadena
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Función para obtener las plantillas creadas por otros usuarios
  const fetchOtherTemplates = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*, Users(username)') // Incluye el nombre de usuario del creador
      .neq('user_id', userId); // Excluye las plantillas creadas por el usuario actual

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data); // Guarda las plantillas en el estado
    }

    // Obtener plantillas en las que el usuario ya está participando
    const { data: collaborations, error: collabError } = await supabase
      .from('Collaborations')
      .select('template_id')
      .eq('user_id', userId); // Filtra por el ID del usuario

    if (collabError) {
      console.error('Error fetching collaborations:', collabError);
    } else {
      const joinedTemplateIds = collaborations.map((collab) => collab.template_id);
      setJoinedTemplates(joinedTemplateIds); // Guarda las plantillas en las que participa el usuario
    }
  };

  // Función para unirse a una plantilla seleccionada
  const handleJoinTemplate = async (templateId) => {
    const { data: existingCollaboration, error: checkError } = await supabase
      .from('Collaborations')
      .select('*')
      .eq('template_id', templateId)
      .eq('user_id', userId); // Verifica si el usuario ya está en la plantilla

    if (checkError) {
      setMessage(`Error: ${checkError.message}`);
      return;
    }

    if (existingCollaboration && existingCollaboration.length > 0) {
      setMessage('Estás intentando unirte a una historia en la que ya participas con un rol.');
      return;
    }

    const { error } = await supabase.from('Collaborations').insert([
      { template_id: templateId, user_id: userId, role }, // Inserta la colaboración
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Te has unido a la plantilla exitosamente');
      setJoinedTemplates([...joinedTemplates, templateId]); // Actualiza la lista de plantillas en las que participa
    }
  };

  // useEffect para cargar las plantillas al montar el componente
  useEffect(() => {
    fetchOtherTemplates(); // Llama a la función para obtener plantillas de otros usuarios
  }, [userId]);

  // Renderizado del componente ExploreTemplates
  return (
    <div className="explore-container">
      <h2>Explorar Plantillas</h2>
      <p>Únete a las historias creadas por otros jugadores.</p>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <h4>{template.storyTitle}</h4>
            <p>{template.description}</p>
            <p><strong>Publicado por:</strong> {template.Users ? capitalizeFirstLetter(template.Users.username) : 'Desconocido'}</p>

            {/* Mostrar si ya está en la historia o permitir unirse */}
            {joinedTemplates.includes(template.id) ? (
              <button disabled className="already-joined">Ya estás en esta historia</button>
            ) : (
              <button onClick={() => setSelectedTemplate(template.id)}>Unirse a esta historia</button>
            )}
          </li>
        ))}
      </ul>

      {/* Contenedor para seleccionar rol al unirse a una plantilla */}
      {selectedTemplate && !joinedTemplates.includes(selectedTemplate) && (
        <div className="select-role-container">
          <h3>Elige tu rol para unirte</h3>
          <div className="custom-select">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Humano">Humano</option>
              <option value="Alien">Alien</option>
              <option value="Cyborg">Cyborg</option>
              <option value="Demonio">Demonio</option>
              <option value="Dios">Dios</option>
              <option value="Superheroe">Superheroe</option>
              <option value="Villano">Villano</option>
            </select>
          </div>
          <button onClick={() => handleJoinTemplate(selectedTemplate)}>Unirse</button>
        </div>
      )}

      {/* Mensaje de error o confirmación */}
      <p className="message">{message}</p>
    </div>
  );
};

export default ExploreTemplates;
