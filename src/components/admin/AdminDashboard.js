// src/components/admin/AdminDashboard.js

// Importaciones de React y Supabase para manejo de estado y acceso a base de datos
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// Importaciones de íconos para la interfaz gráfica del dashboard
import { FaUser, FaFileAlt, FaUsers } from 'react-icons/fa';

// Importación de useNavigate para la navegación programada entre rutas
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Estilos específicos del dashboard de administrador

// Componente funcional del dashboard de administrador
const AdminDashboard = () => {
  // Estados locales para almacenar las estadísticas y los detalles de usuarios, plantillas y colaboraciones
  const [stats, setStats] = useState({
    users: 0,
    templates: 0,
    collaborations: 0,
  });
  const [loading, setLoading] = useState(true); // Estado para controlar la visualización de carga
  const [userDetails, setUserDetails] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const [collaborationDetails, setCollaborationDetails] = useState([]);
  const navigate = useNavigate(); // Inicialización del hook useNavigate para redireccionar al usuario

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Consulta a Supabase para obtener el conteo de usuarios
        const { count: userCount } = await supabase
          .from('Users')
          .select('*', { count: 'exact', head: true });

        // Consulta para obtener el conteo de plantillas
        const { count: templateCount } = await supabase
          .from('Templates')
          .select('*', { count: 'exact', head: true });

        // Consulta para obtener el conteo de colaboraciones
        const { count: collaborationCount } = await supabase
          .from('Collaborations')
          .select('*', { count: 'exact', head: true });

        // Actualización de los estados con los datos obtenidos
        setStats({
          users: userCount || 0,
          templates: templateCount || 0,
          collaborations: collaborationCount || 0,
        });

        // Llamadas a funciones para obtener detalles adicionales
        await fetchUserDetails();
        await fetchTemplateDetails();
        await fetchCollaborationDetails();
      } catch (error) {
        console.error('Error fetching stats:', error); // Manejo de errores en las consultas
      } finally {
        setLoading(false); // Establece loading a false una vez completadas las consultas
      }
    };

    // Funciones para obtener detalles específicos de usuarios, plantillas y colaboraciones
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

    // Ejecución inicial de la función para cargar estadísticas
    fetchStats();
  }, []);

  // Renderizado condicional durante la carga de datos
  if (loading) return <p>Cargando estadísticas...</p>;

  // Renderizado de la interfaz de usuario del dashboard
  return (
    <div>
      <h2>Estadísticas del Administrador</h2>
      <button
        onClick={() => navigate('/admin/AdminGraphStats')} // Botón para navegar a las estadísticas gráficas
        className="view-graphs-button"
      >
        Ver estadísticas gráficas
      </button>

      <div className="dashboard-container">
        {/* Tarjetas de estadísticas para usuarios, plantillas y colaboraciones */}
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
