// src/pages/SolicitarRecuperacion.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError(false);

    try {
      const res = await axios.post('http://localhost:3000/api/auth/solicitar-recuperacion', { email });
      setMensaje('✅ Su contraseña fue restablecida. Comuníquese con el administrador.');
    } catch (err) {
      setError(true);
      setMensaje('❌ ' + (err.response?.data?.mensaje || 'Error al solicitar recuperación'));
    }
  };

  return (
    <div style={fondo}>
      <div style={card}>
        <img src="/logo-cnt.jpg" alt="Logo CNT" style={logo} />
        <h2 style={{ color: '#00274d' }}>🔐 Recuperar Contraseña</h2>
        <p style={{ marginBottom: '1rem' }}>
          Ingresa tu correo institucional para enviarte un enlace de recuperación.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
          />
          <button type="submit" style={boton}>📩 Enviar enlace</button>
        </form>

        {mensaje && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            border: `1px solid ${error ? '#f5c6cb' : '#c3e6cb'}`,
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.95rem'
          }}>
            {mensaje}
          </div>
        )}

        <Link to="/" style={{ marginTop: '1.5rem', display: 'block', color: '#0070c0', fontWeight: 'bold' }}>
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
};

// 🎨 Estilos
const fondo = {
  minHeight: '100vh',
  backgroundImage: 'url("/fondo-cnt.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const card = {
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '2rem',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
};

const logo = {
  width: '100px',
  marginBottom: '1rem'
};

const input = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginBottom: '1rem',
  fontSize: '1rem'
};

const boton = {
  width: '100%',
  padding: '0.9rem',
  backgroundColor: '#0070c0',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default SolicitarRecuperacion;

