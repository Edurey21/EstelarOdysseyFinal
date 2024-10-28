// src/components/Dashboard.js 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css';


const Dashboard = ({ userId }) => {
  const [templates, setTemplates] = useState([]);
  const [collaborations, setCollaborations] = useState([]);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data);
    }
  };

  const fetchCollaborations = async () => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('*, Templates(storyTitle)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching collaborations:', error);
    } else {
      setCollaborations(data);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTemplates();
      fetchCollaborations();
    }
  }, [userId]);

  return (
    <div>
      <h2>Bienvenido a tus historias</h2>
      <p>Bienvenido a tu tablero. Aquí podrás ver y gestionar tus historias.</p>

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
