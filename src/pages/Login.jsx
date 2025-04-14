import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await axios.post('https://cnt-backend-1sug.onrender.com/api/auth/login', {
        email,
        contraseña,
      });

      const { token, usuario } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (usuario.rol === 'tecnico') {
        navigate('/dashboard');
      } else {
        navigate('/gestion-cables');
      }

    } catch (err) {
      setMensaje('❌ ' + (err.response?.data?.mensaje || 'Error al iniciar sesión'));
    }
  };

  return (
    <div style={fondoLogin}>
      <div style={contenedorFormulario}>
        <img
          src="/logo-cnt.png"
          alt="Logo CNT"
          style={{ width: '120px', marginBottom: '1rem' }}
        />

        <h1 style={{ fontSize: '1.5rem', color: '#003865', marginBottom: '1rem' }}>
          🧵 Sistema de Registro de Cables Desmontados
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={botonStyle}>
            Ingresar
          </button>
        </form>

        {mensaje && (
          <p style={{ marginTop: '1rem', color: 'red' }}>{mensaje}</p>
        )}

        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/solicitar-recuperacion" style={{ color: '#0095DB', textDecoration: 'none' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
};

// 🎨 Estilos
const fondoLogin = {
  minHeight: '100vh',
  backgroundImage: 'url("/fondo-cnt2025.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const contenedorFormulario = {
  maxWidth: '420px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const botonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#0095DB', // Azul institucional CNT
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

export default Login;







