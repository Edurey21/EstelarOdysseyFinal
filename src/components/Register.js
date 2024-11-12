// Importaciones necesarias para el componente de registro
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importa los estilos

// Componente Register para registrar nuevos usuarios
const Register = () => {
  const [email, setEmail] = useState(''); // Estado para el correo electrónico
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes de error o éxito
  const navigate = useNavigate(); // Hook para redirigir a otras páginas

  // Función para validar el correo electrónico
  const validateEmail = (email) => {
    // Expresión regular que valida si el correo termina en .(extension), por ejemplo .com o .mx
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); // Retorna true si el correo es válido, false si no lo es
  };

  // Función que maneja el registro del usuario
  const handleRegister = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validar el correo electrónico antes de proceder con el registro
    if (!validateEmail(email)) {
      setMessage('Por favor, introduce un correo electrónico válido que termine en .com, .mx, etc.'); // Mensaje de error si el correo no es válido
      return;
    }

    // Verificar si el correo ya está registrado en la base de datos
    const { data: existingUser, error: fetchError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email); // Busca el correo en la base de datos

    if (fetchError) {
      setMessage(`Error: ${fetchError.message}`); // Muestra un mensaje de error si ocurre algún problema en la búsqueda
      return;
    }

    if (existingUser && existingUser.length > 0) {
      setMessage('Este correo electrónico ya está registrado.'); // Mensaje si el correo ya está registrado
      return;
    }

    // Inserta el nuevo usuario en la base de datos si todo es correcto
    const { error } = await supabase.from('Users').insert([{ email, username, password }]); // Crea el usuario en la tabla Users
    if (error) {
      // Verificar si el error es por nombre de usuario duplicado
      if (error.message.includes('duplicate key value violates unique constraint "Users_username_key"')) {
        setMessage('Este usuario ya está registrado'); // Mensaje personalizado
      } else {
        setMessage(`Error: ${error.message}`); // Otro tipo de error
      }
    } else {
      setMessage('Usuario registrado exitosamente'); // Muestra un mensaje de éxito si el registro fue correcto
      setTimeout(() => {
        navigate('/login'); // Redirigir al login después de un registro exitoso
      }, 2000); // Espera 2 segundos antes de redirigir al login
    }
  };

  // Renderizado del componente Register
  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del correo electrónico
          required
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          onChange={(e) => setUsername(e.target.value)} // Actualiza el estado del nombre de usuario
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
          required
        />
        <button type="submit">Registrarse</button> {/* Botón para enviar el formulario */}
      </form>
      <p>{message}</p> {/* Muestra mensajes de error o éxito */}
      <button type="button" onClick={() => navigate('/login')}>
        ¿Ya tienes cuenta? Inicia sesión aquí
      </button>
    </div>
  );
};

export default Register;
