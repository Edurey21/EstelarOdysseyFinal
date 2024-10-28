import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { supabase } from '../supabaseClient';
import './CollaborationDetails.css';

const CollaborationDetails = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Define navigate
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [userColors, setUserColors] = useState({});
  const [participants, setParticipants] = useState([]);

  const colorPalette = ['#1b263b', '#283845', '#3a506b', '#5bc0be', '#0b132b', '#6fffe9', '#2c3e50', '#4a69bd'];

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  const fetchCollaborationDetails = async () => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('*, Templates(storyTitle, description, mission, role, planet, Users(username))')
      .eq('id', id)
      .single();

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setDetails(data);
      fetchComments(data.template_id);

      const creatorUsername = data?.Templates?.Users?.username ? capitalizeFirstLetter(data.Templates.Users.username) : null;
      const creatorRole = data?.role;
      fetchParticipants(data.template_id, creatorUsername, creatorRole);
    }
  };

  const fetchComments = async (templateId) => {
    const { data, error } = await supabase
      .from('Comments')
      .select('*, Users(username)')
      .eq('template_id', templateId)
      .order('created_at', { ascending: true });

    if (!error) {
      const colors = {};
      data.forEach((comment) => {
        if (!colors[comment.user_id]) {
          colors[comment.user_id] = colorPalette[Object.keys(colors).length % colorPalette.length];
        }
      });
      setUserColors(colors);
      setComments(data);
    }
  };

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
      if (creatorUsername) {
        allParticipants.unshift({ username: creatorUsername, role: creatorRole });
      }
      setParticipants(allParticipants);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('Comments').insert([
      {
        template_id: details.template_id,
        user_id: userId,
        content: newComment,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setNewComment('');
      fetchComments(details.template_id);
    }
  };

  useEffect(() => {
    fetchCollaborationDetails();
  }, [id]);

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

          <form onSubmit={handleAddComment}>
            <textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Enviar</button>
          </form>

          {/* Botón para volver a "Mis historias" */}
          <button className="go-back-button" onClick={() => navigate('/dashboard')}>Volver a Mis Historias</button>

        </div>
      ) : (
        <p>{message || "Cargando detalles de la colaboración..."}</p>
      )}
    </div>
  );
};

export default CollaborationDetails;
