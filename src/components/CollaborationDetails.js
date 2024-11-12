// src/components/CollaborationDetails.js

// Importaciones necesarias para manejar los detalles de la colaboración
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import { supabase } from '../supabaseClient';
import './CollaborationDetails.css'; // Importa el archivo CSS correspondiente

// Componente CollaborationDetails que muestra los detalles y comentarios de una colaboración
const CollaborationDetails = ({ userId }) => {
  const { id } = useParams(); // Obtiene el id de la colaboración desde la URL
  const navigate = useNavigate(); // Definición de navigate para manejar la navegación
  const [details, setDetails] = useState(null); // Estado para almacenar los detalles de la colaboración
  const [comments, setComments] = useState([]); // Estado para los comentarios
  const [newComment, setNewComment] = useState(''); // Estado para almacenar el nuevo comentario
  const [message, setMessage] = useState(''); // Estado para mensajes de error o carga
  const [userColors, setUserColors] = useState({}); // Estado para almacenar los colores de cada usuario
  const [participants, setParticipants] = useState([]); // Estado para los participantes de la colaboración

  // Paleta de colores para asignar a los usuarios
  const colorPalette = ['#1b263b', '#283845', '#3a506b', '#5bc0be', '#0b132b', '#6fffe9', '#2c3e50', '#4a69bd'];

  // Función para capitalizar la primera letra de una cadena
  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  // Función para obtener los detalles de la colaboración
  const fetchCollaborationDetails = async () => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('*, Templates(storyTitle, description, mission, role, planet, Users(username))')
      .eq('id', id)
      .single();

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setDetails(data); // Guarda los detalles de la colaboración
      fetchComments(data.template_id); // Obtiene los comentarios asociados

      // Obtener el creador de la historia y su rol
      const creatorUsername = data?.Templates?.Users?.username ? capitalizeFirstLetter(data.Templates.Users.username) : null;
      const creatorRole = data?.role;
      fetchParticipants(data.template_id, creatorUsername, creatorRole); // Obtiene los participantes de la colaboración
    }
  };

  // Función para obtener los comentarios asociados a la plantilla
  const fetchComments = async (templateId) => {
    const { data, error } = await supabase
      .from('Comments')
      .select('*, Users(username)')
      .eq('template_id', templateId)
      .order('created_at', { ascending: true });

    if (!error) {
      const colors = {};
      // Asigna un color a cada usuario en base a su ID
      data.forEach((comment) => {
        if (!colors[comment.user_id]) {
          colors[comment.user_id] = colorPalette[Object.keys(colors).length % colorPalette.length];
        }
      });
      setUserColors(colors); // Guarda los colores de los usuarios
      setComments(data); // Guarda los comentarios
    }
  };

  // Función para obtener los participantes de la colaboración
  const fetchParticipants = async (templateId, creatorUsername, creatorRole) => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('Users(username), role')
      .eq('template_id', templateId);

    if (!error) {
      const allParticipants = data.map((d) => ({
        username: capitalizeFirstLetter(d.Users.username),
        role: d.role,
      }));
      // Añade el creador de la historia al inicio de la lista de participantes
      if (creatorUsername) {
        allParticipants.unshift({ username: creatorUsername, role: creatorRole });
      }
      setParticipants(allParticipants); // Guarda la lista de participantes
    }
  };

  // Función para añadir un nuevo comentario
  const handleAddComment = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('Comments').insert([
      {
        template_id: details.template_id,
        user_id: userId,
        content: newComment, // Añade el nuevo comentario
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setNewComment(''); // Limpia el campo de texto
      fetchComments(details.template_id); // Refresca los comentarios
    }
  };

  // useEffect para cargar los detalles de la colaboración cuando cambia el ID
  useEffect(() => {
    fetchCollaborationDetails();
  }, [id]);

  // Renderizado del componente CollaborationDetails
  return (
    <div className="collaboration-container">
      {details ? (
        <div>
          <h2 className="collaboration-header">{details.Templates.storyTitle}</h2>
          <div className="collaboration-details">
            <p><strong>Descripción:</strong> {details.Templates.description}</p>
            <p><strong>Misión:</strong> {details.Templates.mission}</p>
            <p><strong>Rol en la historia:</strong> {details.role}</p>
            <p><strong>Planeta:</strong> {details.Templates.planet}</p>
            <p><strong>Historia Creada Por:</strong> {capitalizeFirstLetter(details.Templates.Users.username)}</p>
          </div>

          {/* Sección de participantes */}
          <div className="participants-section">
            <h3>Participantes</h3>
            <ul>
              {participants.map((participant, index) => (
                <li key={index}>
                  {participant.username} ({capitalizeFirstLetter(participant.role)})
                </li>
              ))}
            </ul>
          </div>

          {/* Sección de comentarios */}
          <h3>Comentarios</h3>
          <div className="comments">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment"
                style={{ backgroundColor: userColors[comment.user_id] || '#2D3748' }}
              >
                <p><strong>{capitalizeFirstLetter(comment.Users.username)}:</strong> {comment.content}</p>
              </div>
            ))}
          </div>

          {/* Formulario para añadir nuevos comentarios */}
          <form onSubmit={handleAddComment}>
            <textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Enviar</button>
          </form>

          {/* Botón para volver a la página de historias */}
          <button className="go-back-button" onClick={() => navigate('/dashboard')}>Volver a Mis Historias</button>

        </div>
      ) : (
        <p>{message || "Cargando detalles de la colaboración..."}</p>
      )}
    </div>
  );
};

export default CollaborationDetails;