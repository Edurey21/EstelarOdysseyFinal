// src/components/TemplateDetails.js

// Importaciones necesarias para el componente de detalles de la plantilla
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate para la navegación
import { supabase } from '../supabaseClient';
import './TemplateDetails.css'; // Importa el archivo CSS

// Componente TemplateDetails que muestra los detalles de una plantilla específica
const TemplateDetails = ({ userId }) => {
  const { id } = useParams(); // Obtiene el ID de la plantilla desde los parámetros de la URL
  const navigate = useNavigate(); // Hook para navegar a otras rutas
  const [template, setTemplate] = useState(null); // Estado para almacenar los detalles de la plantilla
  const [comments, setComments] = useState([]); // Estado para los comentarios
  const [newComment, setNewComment] = useState(''); // Estado para el nuevo comentario
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes de error o éxito
  const [userColors, setUserColors] = useState({}); // Estado para asignar colores únicos a cada usuario
  const [participants, setParticipants] = useState([]); // Estado para los participantes de la historia
  const [currentUsername, setCurrentUsername] = useState(''); // Estado para el nombre de usuario actual

  // Paleta de colores para asignar a los usuarios en los comentarios
  const colorPalette = ['#1b263b', '#283845', '#3a506b', '#5bc0be', '#0b132b', '#6fffe9', '#2c3e50', '#4a69bd'];

  // Función para capitalizar la primera letra de un string
  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  // Función para obtener el nombre del usuario actual desde Supabase
  const fetchCurrentUser = async () => {
    const { data, error } = await supabase
      .from('Users')
      .select('username')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching current user:', error); // Muestra un error si ocurre un problema
    } else {
      setCurrentUsername(capitalizeFirstLetter(data.username)); // Establece el nombre de usuario en el estado
    }
  };

  // Función para obtener los detalles de la plantilla
  const fetchTemplateDetails = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*, Users(username)')
      .eq('id', id) // Busca la plantilla por su ID
      .single();

    if (error) {
      setMessage(`Error: ${error.message}`); // Muestra un mensaje si hay un error
    } else {
      setTemplate(data); // Establece la plantilla en el estado
      fetchComments(); // Obtiene los comentarios asociados a la plantilla
      fetchParticipants(data.Users.username); // Obtiene los participantes de la historia
    }
  };

  // Función para obtener los comentarios de la plantilla
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('Comments')
      .select('*, Users(username)')
      .eq('template_id', id) // Busca los comentarios asociados a la plantilla por su ID
      .order('created_at', { ascending: true }); // Ordena los comentarios por fecha de creación

    if (!error) {
      const colors = {};
      data.forEach((comment) => {
        if (!colors[comment.user_id]) {
          colors[comment.user_id] = colorPalette[Math.floor(Math.random() * colorPalette.length)]; // Asigna un color aleatorio a cada usuario
        }
      });
      setUserColors(colors); // Establece los colores en el estado
      setComments(data); // Establece los comentarios en el estado
    }
  };

  // Función para obtener los participantes de la plantilla
  const fetchParticipants = async (creatorUsername) => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('Users(username), role')
      .eq('template_id', id); // Busca las colaboraciones asociadas a la plantilla

    if (!error) {
      const participantNames = data.map((collab) => ({
        username: capitalizeFirstLetter(collab.Users.username),
        role: capitalizeFirstLetter(collab.role),
      }));

      // Agrega el creador de la plantilla a la lista de participantes si no está ya
      if (creatorUsername && !participantNames.some((p) => p.username === capitalizeFirstLetter(creatorUsername))) {
        participantNames.push({ username: capitalizeFirstLetter(creatorUsername), role: 'Creador' });
      }

      // Agrega el usuario actual a la lista de participantes si no está ya
      if (currentUsername && !participantNames.some((p) => p.username === currentUsername)) {
        participantNames.push({ username: currentUsername, role: 'Tú' });
      }

      setParticipants(participantNames); // Establece los participantes en el estado
    }
  };

  // Función para agregar un nuevo comentario
  const handleAddComment = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const { error } = await supabase.from('Comments').insert([
      {
        template_id: id, // ID de la plantilla
        user_id: userId, // ID del usuario actual
        content: newComment, // Contenido del comentario
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`); // Muestra un mensaje de error si ocurre un problema
    } else {
      setNewComment(''); // Limpia el campo de comentario
      fetchComments(); // Vuelve a cargar los comentarios
    }
  };

  // useEffect para obtener los detalles cuando el componente se monta o el ID cambia
  useEffect(() => {
    if (userId) {
      fetchCurrentUser(); // Obtiene el nombre del usuario actual
      fetchTemplateDetails(); // Obtiene los detalles de la plantilla
    }
  }, [userId, id]); // Ejecuta cuando userId o id cambian

  // Renderizado del componente TemplateDetails
  return (
    <div className="template-details-container">
      {template ? (
        <div>
          <h2 className="template-header">{template.storyTitle}</h2> {/* Título de la historia */}
          <div className="template-details-content">
            <p><strong>Descripción:</strong> {template.description}</p>
            <p><strong>Misión:</strong> {template.mission}</p>
            <p><strong>Rol:</strong> {template.role}</p>
            <p><strong>Planeta:</strong> {template.planet}</p>
          </div>

          <h3>Participantes</h3>
          <ul>
            {participants.map((participant, index) => (
              <li key={index}>
                {participant.username} ({participant.role}) {/* Nombre del participante y su rol */}
              </li>
            ))}
          </ul>

          <h3>Comentarios</h3>
          <div className="comments-section">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item"
                style={{ backgroundColor: userColors[comment.user_id] || '#2D3748' }} // Establece el color del comentario basado en el usuario
              >
                <p><strong>{capitalizeFirstLetter(comment.Users.username)}:</strong> {comment.content}</p> {/* Muestra el comentario */}
              </div>
            ))}
            <form onSubmit={handleAddComment}>
              <textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)} // Actualiza el valor del comentario
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>

          {/* Botón para volver a "Mis historias" */}
          <button className="go-back-button" onClick={() => navigate('/dashboard')}>Volver a Mis Historias</button>

        </div>
      ) : (
        <p>{message || "Cargando detalles de la plantilla..."}</p> // Mensaje mientras se cargan los detalles
      )}
    </div>
  );
};

export default TemplateDetails;
