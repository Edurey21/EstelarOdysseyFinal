import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
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
import logo from './img/logo.png';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Importamos los iconos espaciales
import { FaRocket, FaStar, FaMeteor, FaUserAstronaut } from 'react-icons/fa';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const adminUserId = 14; // ID real del administrador

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
        setUsername(session.user.user_metadata.username);
      }
    };
    fetchSession();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    window.location.href = '/'; // Redirigir al inicio
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            {isLoggedIn ? (
              <>
                {userId === adminUserId ? (
                  <Link to="/admin">Admin Dashboard</Link>
                ) : (
                  <>
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
          <img src={logo} alt="Estelar Odyssey Logo" className="logo" />
        </nav>
        <h1>Estelar Odyssey</h1>

        <Routes>
          <Route path="/" element={isLoggedIn ? <LoggedInHome username={username} /> : <DefaultHome />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setUsername={setUsername} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setUsername={setUsername} />} />
          <Route path="/admin" element={userId === adminUserId ? <AdminDashboard /> : <Navigate to="/" />} />
          {isLoggedIn && userId !== adminUserId && (
            <>
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

// Componente para el inicio de sesión no autenticado
const DefaultHome = () => (
  <div>
    <ImageCarousel />
    <WelcomeMessage />
    <StoryList />
  </div>
);

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string) => {
  if (!string) return string; // Retorna el string original si es nulo o indefinido
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Componente para el inicio de sesión autenticado
const LoggedInHome = ({ username }) => (
  <div>
    <h2>Bienvenido de vuelta, {capitalizeFirstLetter(username)}</h2>
    <ImageCarousel />
    <WelcomeMessageUser />
    <StoryList showRecommendations={true} />
    <ActiveCollaborators />
  </div>
);

// Componente ActiveCollaborators con íconos espaciales y agrupación por usuario
const ActiveCollaborators = () => {
  const [collaborators, setCollaborators] = useState([]);

  // Íconos espaciales que se asignarán a las historias
  const spaceIcons = [<FaRocket />, <FaStar />, <FaMeteor />, <FaUserAstronaut />];

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from('Collaborations')
        .select('user_id, Templates(storyTitle)')
        .limit(10); // Cambia el límite si es necesario

      if (error) {
        console.error('Error fetching collaborators:', error);
      } else {
        const userPromises = data.map(async (collab) => {
          const { data: userData } = await supabase
            .from('Users')
            .select('username')
            .eq('id', collab.user_id)
            .single();
          return { ...collab, username: capitalizeFirstLetter(userData.username) };
        });

        const usersWithNames = await Promise.all(userPromises);

        // Agrupamos historias por usuario
        const groupedByUser = usersWithNames.reduce((acc, collab) => {
          if (!acc[collab.username]) {
            acc[collab.username] = [];
          }
          acc[collab.username].push(collab.Templates.storyTitle);
          return acc;
        }, {});

        const sortedCollaborators = Object.entries(groupedByUser).slice(0, 3); // Solo los 3 primeros colaboradores
        setCollaborators(sortedCollaborators);
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
