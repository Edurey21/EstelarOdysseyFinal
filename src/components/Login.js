// src/components/Login.js

// Importaciones necesarias para el componente de inicio de sesión
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importa los estilos del login

// Componente Login que permite al usuario iniciar sesión
const Login = ({ setIsLoggedIn, setUserId, setUsername }) => {
  const [username, setUsernameInput] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes de error o éxito
  const navigate = useNavigate(); // Hook para redireccionar a otra página

  // Función que maneja el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('username', username)
      .eq('password', password); // Verifica las credenciales del usuario

    if (error || data.length === 0) {
      setMessage('Nombre de usuario o contraseña incorrectos'); // Mensaje si las credenciales son incorrectas
      setIsLoggedIn(false); // Establece el estado de sesión como no iniciada
    } else {
      setIsLoggedIn(true); // Establece el estado de sesión como iniciada
      setUserId(data[0].id); // Guarda el ID del usuario en el estado
      setUsername(data[0].username); // Guarda el nombre de usuario en el estado
      setMessage('Inicio de sesión exitoso'); // Muestra mensaje de éxito
      navigate('/'); // Redirecciona a la página principal
    }
  };

  // Renderizado del componente Login
  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          onChange={(e) => setUsernameInput(e.target.value)} // Actualiza el nombre de usuario
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)} // Actualiza la contraseña
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>{message}</p> {/* Muestra mensajes de error o éxito */}
      <button type="button" onClick={() => navigate('/register')}>
        ¿No tienes una cuenta? Regístrate aquí
      </button>
    </div>
  );
};

export default Login;
