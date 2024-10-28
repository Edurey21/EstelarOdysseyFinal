// src/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaUser, FaFileAlt, FaUsers } from 'react-icons/fa';
import './AdminDashboard.css'; // Importa el CSS aquí

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    templates: 0,
    collaborations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const [collaborationDetails, setCollaborationDetails] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: userCount } = await supabase
          .from('Users')
          .select('*', { count: 'exact', head: true });

        const { count: templateCount } = await supabase
          .from('Templates')
          .select('*', { count: 'exact', head: true });

        const { count: collaborationCount } = await supabase
          .from('Collaborations')
          .select('*', { count: 'exact', head: true });

        setStats({
          users: userCount || 0,
          templates: templateCount || 0,
          collaborations: collaborationCount || 0,
        });

        await fetchUserDetails();
        await fetchTemplateDetails();
        await fetchCollaborationDetails();
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      const { data: users, error } = await supabase.from('Users').select('id, username, created_at');
      if (error) console.error('Error fetching user details:', error);
      else setUserDetails(users || []);
    };

    const fetchTemplateDetails = async () => {
      const { data: templates, error } = await supabase.from('Templates').select('id, storyTitle, created_at, user_id');
      if (error) console.error('Error fetching template details:', error);
      else setTemplateDetails(templates || []);
    };

    const fetchCollaborationDetails = async () => {
      const { data: collaborations, error } = await supabase
        .from('Collaborations')
        .select('id, template_id, user_id, role, Templates(storyTitle), Users(username)');
      if (error) console.error('Error fetching collaboration details:', error);
      else setCollaborationDetails(collaborations || []);
    };

    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;

  return (
    <div>
      <h2>Estadísticas del Administrador</h2>
      <div className="dashboard-container">
        <div className="stat-card">
          <FaUser size={40} color="#4CAF50" />
          <h3>Usuarios Registrados</h3>
          <p><strong>{stats.users}</strong></p>
          <ul>
            {userDetails.map(user => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <FaFileAlt size={40} color="#2196F3" />
          <h3>Plantillas Creadas</h3>
          <p><strong>{stats.templates}</strong></p>
          <ul>
            {templateDetails.map(template => (
              <li key={template.id}>{template.storyTitle}</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <FaUsers size={40} color="#FF5722" />
          <h3>Colaboraciones Realizadas</h3>
          <p><strong>{stats.collaborations}</strong></p>
          <ul>
            {collaborationDetails.map(collab => (
              <li key={collab.id}>
                <strong>Historia:</strong> {collab.Templates?.storyTitle || 'Sin título'} |{' '}
                <strong>Usuario:</strong> {collab.Users?.username || 'Desconocido'} |{' '}
                <strong>Rol:</strong> {collab.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
