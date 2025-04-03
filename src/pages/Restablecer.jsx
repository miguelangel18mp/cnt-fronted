import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restablecer = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError(false);
    setExito(false);

    if (nueva.length < 6) {
      setError(true);
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await axios.post(`https://cnt-backend-1sug.onrender.com/api/auth/restablecer/${token}`, {
        nueva,
      });

      setMensaje('✅ Contraseña restablecida. Comuníquese con el administrador.');
      setExito(true);
      setNueva('');

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError(true);
      setMensaje('❌ ' + (err.response?.data?.mensaje || 'Token inválido o expirado'));
    }
  };

  return (
    <div style={fondo}>
      <div style={card}>
        <img src="/logo-cnt.jpg" alt="Logo CNT" style={logo} />
        <h2 style={{ color: '#00274d' }}>🔐 Restablecer Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            required
            style={input}
            disabled={exito}
          />
          <button type="submit" style={boton} disabled={exito}>✅ Cambiar contraseña</button>
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

export default Restablecer;

