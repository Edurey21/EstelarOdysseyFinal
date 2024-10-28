// src/components/CreateTemplate.js

// Importaciones necesarias para manejar la creación de plantillas
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './CreateTemplate.css'; // Importa el archivo CSS correspondiente

// Plantillas predeterminadas para seleccionar
const defaultTemplates = [
  { title: 'La Misión a Marte', description: 'Explora Marte y descubre los misterios de este planeta rojo.', mission: 'Establecer una base en Marte.', role: 'Astronauta', planet: 'Marte' },
  { title: 'Invasión Alienígena', description: 'Defiende la Tierra contra una invasión alienígena inminente.', mission: 'Proteger a la humanidad.', role: 'Guerrero', planet: 'Tierra' },
  { title: 'Exploración de Krypton', description: 'Investiga el planeta Krypton y sus secretos.', mission: 'Recolectar muestras.', role: 'Científico', planet: 'Krypton' },
  { title: 'Conflicto en El Imperio', description: 'Enfrenta las tensiones entre facciones rivales en El Imperio.', mission: 'Restaurar el orden.', role: 'Diplomático', planet: 'El Imperio' },
  { title: 'El Ascenso del Cyborg', description: 'Descubre tu nueva identidad como un cyborg en un mundo post-apocalíptico.', mission: 'Reconstruir la civilización.', role: 'Cyborg', planet: 'Prioxinyta' },
  { title: 'Secretos de Palasvelta', description: 'Explora la selva mística de Palasvelta y encuentra sus secretos ocultos.', mission: 'Descifrar los antiguos manuscritos.', role: 'Explorador', planet: 'Palasvelta' },
  { title: 'La Rebelión de los Demonios', description: 'Lidera una rebelión en las profundidades de Apocolyps.', mission: 'Liberar a los prisioneros.', role: 'Demonio', planet: 'Apocolyps' },
  { title: 'Los Superhéroes de Tierra', description: 'Únete a un equipo de superhéroes y combate el crimen en la Tierra.', mission: 'Proteger a los ciudadanos.', role: 'Superheroe', planet: 'Tierra' },
  { title: 'La Búsqueda Divina', description: 'Emprende una misión divina en Marte, guiado por fuerzas sobrenaturales.', mission: 'Encontrar el objeto sagrado.', role: 'Dios', planet: 'Marte' },
  { title: 'La Invasión de Palasvelta', description: 'Protege la paz en Palasvelta mientras fuerzas externas tratan de invadir.', mission: 'Defender el territorio.', role: 'Guerrero', planet: 'Palasvelta' }
];

// Componente CreateTemplate que permite crear plantillas o usar plantillas prediseñadas
const CreateTemplate = ({ userId }) => {
  const [view, setView] = useState('selection'); // Estado para alternar entre vistas
  const [storyTitle, setStoryTitle] = useState(''); // Título de la historia
  const [description, setDescription] = useState(''); // Descripción de la historia
  const [mission, setMission] = useState(''); // Misión de la historia
  const [role, setRole] = useState('Humano'); // Rol del usuario
  const [planet, setPlanet] = useState('Tierra'); // Planeta seleccionado
  const [message, setMessage] = useState(''); // Mensaje de éxito o error
  const [showNotification, setShowNotification] = useState(false); // Estado para mostrar notificaciones
  const [usedTemplates, setUsedTemplates] = useState([]); // Estado para plantillas ya usadas por el usuario

  // useEffect para cargar las plantillas que ya ha usado el usuario
  useEffect(() => {
    const fetchUsedTemplates = async () => {
      const { data, error } = await supabase
        .from('Templates')
        .select('storyTitle')
        .eq('user_id', userId);

      if (error) console.error('Error fetching templates:', error);
      else setUsedTemplates(data.map(template => template.storyTitle)); // Guarda los títulos de las plantillas ya usadas
    };

    fetchUsedTemplates();
  }, [userId]);

  // Función para crear una plantilla nueva
  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('Templates').insert([
      {
        user_id: userId,
        storyTitle,
        description,
        mission,
        role,
        planet,
      }
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Plantilla creada exitosamente');
      setStoryTitle(''); // Limpia el campo de título
      setDescription(''); // Limpia el campo de descripción
      setMission(''); // Limpia el campo de misión
      setRole('Humano'); // Resetea el rol a "Humano"
      setPlanet('Tierra'); // Resetea el planeta a "Tierra"
      showTemporaryNotification(); // Muestra la notificación temporal
    }
  };

  // Función para usar una plantilla prediseñada
  const handleUseDefaultTemplate = async (template) => {
    const { error } = await supabase.from('Templates').insert([
      {
        user_id: userId,
        storyTitle: template.title,
        description: template.description,
        mission: template.mission,
        role: template.role,
        planet: template.planet,
      }
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`La plantilla "${template.title}" fue creada exitosamente`);
      setUsedTemplates([...usedTemplates, template.title]); // Agrega la plantilla usada a la lista
      showTemporaryNotification();
    }
  };

  // Función para mostrar una notificación temporal
  const showTemporaryNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Oculta la notificación después de 3 segundos
  };

  // Renderizado del componente CreateTemplate
  return (
    <div>
      <h2>Nueva Historia</h2>
      {showNotification && <div className="notification">{message}</div>}
      {view === 'selection' ? (
        <div className="button-group">
          <button onClick={() => setView('defaultTemplates')}>Seleccionar Plantilla por Defecto</button>
          <button onClick={() => setView('createNew')}>Crear Plantilla Nueva</button>
        </div>
      ) : view === 'defaultTemplates' ? (
        <>
          <h3>Plantillas Prediseñadas</h3>
          <ul>
            {defaultTemplates.map((template, index) => (
              <li key={index}>
                <h4>{template.title}</h4>
                <p><strong>Descripción:</strong> {template.description}</p>
                <p><strong>Misión:</strong> {template.mission}</p>
                <p><strong>Rol:</strong> {template.role}</p>
                <p><strong>Planeta:</strong> {template.planet}</p>
                <button 
                  onClick={() => handleUseDefaultTemplate(template)} 
                  disabled={usedTemplates.includes(template.title)} // Desactiva si ya fue usada
                >
                  {usedTemplates.includes(template.title) ? 'Ya usada' : 'Usar esta Plantilla'}
                </button>
              </li>
            ))}
          </ul>
          <button className="return-button" onClick={() => setView('selection')}>Volver</button>
        </>
      ) : (
        <>
          <h3>Crear Nueva Plantilla</h3>
          <form onSubmit={handleCreateTemplate}>
            <input
              type="text"
              placeholder="Título de la historia"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción de la historia"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <textarea
              placeholder="Misión de la historia"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Humano">Humano</option>
              <option value="Alien">Alien</option>
              <option value="Cyborg">Cyborg</option>
              <option value="Demonio">Demonio</option>
              <option value="Dios">Dios</option>
              <option value="Superheroe">Superheroe</option>
              <option value="Villano">Villano</option>
            </select>
            <select value={planet} onChange={(e) => setPlanet(e.target.value)}>
              <option value="Tierra">Tierra</option>
              <option value="Marte">Marte</option>
              <option value="Krypton">Krypton</option>
              <option value="Prioxinyta">Prioxinyta</option>
              <option value="Apocolyps">Apocolyps</option>
              <option value="El Imperio">El Imperio</option>
              <option value="Palasvelta">Palasvelta</option>
            </select>
            <button type="submit">Crear Plantilla</button>
          </form>
          <button className="return-button" onClick={() => setView('selection')}>Volver</button>
        </>
      )}
    </div>
  );
};

export default CreateTemplate;
