import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { supabase } from '../supabaseClient';
import './TemplateDetails.css';

const TemplateDetails = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Define navigate
  const [template, setTemplate] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [userColors, setUserColors] = useState({});
  const [participants, setParticipants] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');

  const colorPalette = ['#1b263b', '#283845', '#3a506b', '#5bc0be', '#0b132b', '#6fffe9', '#2c3e50', '#4a69bd'];

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  const fetchCurrentUser = async () => {
    const { data, error } = await supabase
      .from('Users')
      .select('username')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching current user:', error);
    } else {
      setCurrentUsername(capitalizeFirstLetter(data.username));
    }
  };

  const fetchTemplateDetails = async () => {
    const { data, error } = await supabase
      .from('Templates')
      .select('*, Users(username)')
      .eq('id', id)
      .single();

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setTemplate(data);
      fetchComments();
      fetchParticipants(data.Users.username);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('Comments')
      .select('*, Users(username)')
      .eq('template_id', id)
      .order('created_at', { ascending: true });

    if (!error) {
      const colors = {};
      data.forEach((comment) => {
        if (!colors[comment.user_id]) {
          colors[comment.user_id] = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        }
      });
      setUserColors(colors);
      setComments(data);
    }
  };

  const fetchParticipants = async (creatorUsername) => {
    const { data, error } = await supabase
      .from('Collaborations')
      .select('Users(username), role')
      .eq('template_id', id);

    if (!error) {
      const participantNames = data.map((collab) => ({
        username: capitalizeFirstLetter(collab.Users.username),
        role: capitalizeFirstLetter(collab.role),
      }));

      if (creatorUsername && !participantNames.some((p) => p.username === capitalizeFirstLetter(creatorUsername))) {
        participantNames.push({ username: capitalizeFirstLetter(creatorUsername), role: 'Creador' });
      }

      if (currentUsername && !participantNames.some((p) => p.username === currentUsername)) {
        participantNames.push({ username: currentUsername, role: 'Tú' });
      }

      setParticipants(participantNames);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('Comments').insert([
      {
        template_id: id,
        user_id: userId,
        content: newComment,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCurrentUser();
      fetchTemplateDetails();
    }
  }, [userId, id]);

  return (
    <div className="template-details-container">
      {template ? (
        <div>
          <h2 className="template-header">{template.storyTitle}</h2>
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
                {participant.username} ({participant.role})
              </li>
            ))}
          </ul>

          <h3>Comentarios</h3>
          <div className="comments-section">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item"
                style={{ backgroundColor: userColors[comment.user_id] || '#2D3748' }}
              >
                <p><strong>{capitalizeFirstLetter(comment.Users.username)}:</strong> {comment.content}</p>
              </div>
            ))}
            <form onSubmit={handleAddComment}>
              <textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>

          {/* Botón para volver a "Mis historias" */}
          <button className="go-back-button" onClick={() => navigate('/dashboard')}>Volver a Mis Historias</button>

        </div>
      ) : (
        <p>{message || "Cargando detalles de la plantilla..."}</p>
      )}
    </div>
  );
};

export default TemplateDetails;
