// src/App.js

// Importaciones necesarias para el enrutamiento, gestión de estado y componentes
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Importa el cliente de Supabase
import AdminDashboard from './components/admin/AdminDashboard';
import Dashboard from './components/Dashboard';
import ExploreTemplates from './components/ExploreTemplates';
import CollaborationDetails from './components/CollaborationDetails';
import TemplateDetails from './components/TemplateDetails';
import ImageCarousel from './components/ImageCarousel';
import WelcomeMessage from './components/WelcomeMessage';
import WelcomeMessageUser from './components/WelcomeMessageUser';
import StoryList from './components/StoryList';
import CreateTemplate from './components/CreateTemplate';
import logo from './img/logo.png'; // Importa el logo
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css'; // Importa los estilos generales

// Importación de iconos espaciales para el componente ActiveCollaborators
import { FaRocket, FaStar, FaMeteor, FaUserAstronaut } from 'react-icons/fa';

function App() {
  // Estados para gestionar el inicio de sesión, ID del usuario y su nombre
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const adminUserId = 14; // ID fijo del administrador

  // Efecto para obtener la sesión actual desde Supabase cuando el componente se monta
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id); // Establece el ID del usuario actual
        setUsername(session.user.user_metadata.username); // Establece el nombre de usuario
      }
    };
    fetchSession();
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    window.location.href = '/'; // Redirige al inicio después del cierre de sesión
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            {isLoggedIn ? (
              <>
                {/* Si el usuario es administrador, muestra el enlace al Admin Dashboard */}
                {userId === adminUserId ? (
                  <Link to="/admin">Admin Dashboard</Link>
                ) : (
                  <>
                    {/* Enlaces para los usuarios no administradores */}
                    <Link to="/dashboard">Mis Historias</Link>
                    <Link to="/explore">Explorar Plantillas</Link>
                    <Link to="/create-template">Nueva Historia</Link>
                  </>
                )}
                <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
              </>
            ) : (
              <Link to="/login">Inicio de Sesión</Link>
            )}
          </div>
          <img src={logo} alt="Estelar Odyssey Logo" className="logo" /> {/* Muestra el logo */}
        </nav>
        <h1>Estelar Odyssey</h1> {/* Título principal */}

        {/* Configuración de rutas con protección de rutas basadas en el estado de inicio de sesión */}
        <Routes>
          <Route path="/" element={isLoggedIn ? <LoggedInHome username={username} /> : <DefaultHome />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setUsername={setUsername} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setUsername={setUsername} />} />
          <Route path="/admin" element={userId === adminUserId ? <AdminDashboard /> : <Navigate to="/" />} /> {/* Protege el acceso del admin */}
          {isLoggedIn && userId !== adminUserId && (
            <>
              {/* Rutas para usuarios no administradores */}
              <Route path="/dashboard" element={<Dashboard userId={userId} />} />
              <Route path="/explore" element={<ExploreTemplates userId={userId} />} />
              <Route path="/create-template" element={<CreateTemplate userId={userId} />} />
              <Route path="/collaboration/:id" element={<CollaborationDetails userId={userId} />} />
              <Route path="/template/:id" element={<TemplateDetails userId={userId} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

// Componente para la página de inicio si el usuario no ha iniciado sesión
const DefaultHome = () => (
  <div>
    <ImageCarousel /> {/* Muestra el carrusel de imágenes */}
    <WelcomeMessage /> {/* Muestra el mensaje de bienvenida */}
    <Home /> {/* Componente Home que contiene instrucciones para registrarse o iniciar sesión */}
    <StoryList /> {/* Lista de historias destacadas */}
  </div>
);

// Función para capitalizar la primera letra de un string
const capitalizeFirstLetter = (string) => {
  if (!string) return string; // Retorna el string original si es nulo o indefinido
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Componente para la página de inicio si el usuario ha iniciado sesión
const LoggedInHome = ({ username }) => (
  <div>
    <h2>Bienvenido de vuelta, {capitalizeFirstLetter(username)}</h2> {/* Mensaje personalizado */}
    <ImageCarousel /> {/* Muestra el carrusel de imágenes */}
    <WelcomeMessageUser /> {/* Muestra el mensaje de bienvenida personalizado para el usuario */}
    <StoryList showRecommendations={true} /> {/* Lista de historias destacadas o recomendadas */}
    <ActiveCollaborators /> {/* Muestra los colaboradores activos */}
  </div>
);

// Componente para mostrar los colaboradores activos
const ActiveCollaborators = () => {
  const [collaborators, setCollaborators] = useState([]);

  // Íconos espaciales para asignar a las historias
  const spaceIcons = [<FaRocket />, <FaStar />, <FaMeteor />, <FaUserAstronaut />];

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from('Collaborations')
        .select('user_id, Templates(storyTitle)')
        .limit(10); // Límite de resultados

      if (error) {
        console.error('Error fetching collaborators:', error); // Muestra un error si ocurre
      } else {
        const userPromises = data.map(async (collab) => {
          const { data: userData } = await supabase
            .from('Users')
            .select('username')
            .eq('id', collab.user_id)
            .single();
          return { ...collab, username: capitalizeFirstLetter(userData.username) }; // Asigna el nombre de usuario con la primera letra capitalizada
        });

        const usersWithNames = await Promise.all(userPromises);

        // Agrupa las historias por usuario
        const groupedByUser = usersWithNames.reduce((acc, collab) => {
          if (!acc[collab.username]) {
            acc[collab.username] = [];
          }
          acc[collab.username].push(collab.Templates.storyTitle); // Agrupa historias bajo el mismo usuario
          return acc;
        }, {});

        const sortedCollaborators = Object.entries(groupedByUser).slice(0, 3); // Limita a los 3 principales colaboradores
        setCollaborators(sortedCollaborators); // Establece los colaboradores en el estado
      }
    };

    fetchCollaborators();
  }, []);

  return (
    <div className="active-collaborators">
      <h3>Colaboradores Activos</h3>
      <ul>
        {Array.isArray(collaborators) && collaborators.map(([username, stories], index) => (
          <li key={index}>
            <p>
              <strong>{username}</strong> en{' '}
              {stories.map((story, storyIndex) => (
                <span key={storyIndex}>
                  {spaceIcons[storyIndex % spaceIcons.length]} <em>{story}</em>{' '}
                  {storyIndex < stories.length - 1 && ', '}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
