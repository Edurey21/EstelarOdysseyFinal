import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './CreateTemplate.css';

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

const CreateTemplate = ({ userId }) => {
  const [view, setView] = useState('selection');
  const [storyTitle, setStoryTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [role, setRole] = useState('Humano');
  const [planet, setPlanet] = useState('Tierra');
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [usedTemplates, setUsedTemplates] = useState([]);

  useEffect(() => {
    const fetchUsedTemplates = async () => {
      const { data, error } = await supabase
        .from('Templates')
        .select('storyTitle')
        .eq('user_id', userId);

      if (error) console.error('Error fetching templates:', error);
      else setUsedTemplates(data.map(template => template.storyTitle));
    };

    fetchUsedTemplates();
  }, [userId]);

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
      setStoryTitle('');
      setDescription('');
      setMission('');
      setRole('Humano');
      setPlanet('Tierra');
      showTemporaryNotification();
    }
  };

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
      setUsedTemplates([...usedTemplates, template.title]);
      showTemporaryNotification();
    }
  };

  const showTemporaryNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Se oculta después de 3 segundos
  };

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
                  disabled={usedTemplates.includes(template.title)}
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
