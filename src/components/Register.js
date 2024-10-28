// src/components/Register.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data: existingUser, error: fetchError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email);

    if (fetchError) {
      setMessage(`Error: ${fetchError.message}`);
      return;
    }

    if (existingUser && existingUser.length > 0) {
      setMessage('Este correo electrónico ya está registrado.');
      return;
    }

    const { error } = await supabase.from('Users').insert([{ email, username, password }]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Usuario registrado exitosamente');
      setTimeout(() => {
        navigate('/login'); // Redirigir al login después de un registro exitoso
      }, 2000); // Esperar 2 segundos antes de redirigir
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Nombre de usuario" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registrarse</button>
      </form>
      <p>{message}</p>
      <button type="button" onClick={() => navigate('/login')}>¿Ya tienes cuenta? Inicia sesión aquí</button>
    </div>
  );
};

export default Register;
