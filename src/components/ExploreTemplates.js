import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ExploreTemplates.css';

const ExploreTemplates = ({ userId }) => {
  const [templates, setTemplates] = useState([]);
  const [joinedTemplates, setJoinedTemplates] = useState([]); // Plantillas en las que ya está el usuario
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [role, setRole] = useState('Humano');
  const [message, setMessage] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchOtherTemplates = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*, Users(username)')
      .neq('user_id', userId); // Excluir plantillas creadas por el usuario actual

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data);
    }

    // Obtener plantillas en las que el usuario ya está participando
    const { data: collaborations, error: collabError } = await supabase
      .from('Collaborations')
      .select('template_id')
      .eq('user_id', userId);

    if (collabError) {
      console.error('Error fetching collaborations:', collabError);
    } else {
      const joinedTemplateIds = collaborations.map((collab) => collab.template_id);
      setJoinedTemplates(joinedTemplateIds);
    }
  };

  const handleJoinTemplate = async (templateId) => {
    const { data: existingCollaboration, error: checkError } = await supabase
      .from('Collaborations')
      .select('*')
      .eq('template_id', templateId)
      .eq('user_id', userId);

    if (checkError) {
      setMessage(`Error: ${checkError.message}`);
      return;
    }

    if (existingCollaboration && existingCollaboration.length > 0) {
      setMessage('Estás intentando unirte a una historia en la que ya participas con un rol.');
      return;
    }

    const { error } = await supabase.from('Collaborations').insert([
      { template_id: templateId, user_id: userId, role },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Te has unido a la plantilla exitosamente');
      setJoinedTemplates([...joinedTemplates, templateId]); // Actualiza la lista de plantillas en las que participa
    }
  };

  useEffect(() => {
    fetchOtherTemplates();
  }, [userId]);

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
      <p className="message">{message}</p>
    </div>
  );
};

export default ExploreTemplates;
