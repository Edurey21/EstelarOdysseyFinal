import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsLoggedIn, setUserId, setUsername }) => {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (error || data.length === 0) {
      setMessage('Nombre de usuario o contraseña incorrectos');
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      setUserId(data[0].id);
      setUsername(data[0].username);
      setMessage('Inicio de sesión exitoso');
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          onChange={(e) => setUsernameInput(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>{message}</p>
      <button type="button" onClick={() => navigate('/register')}>
        ¿No tienes una cuenta? Regístrate aquí
      </button>
    </div>
  );
};

export default Login;
