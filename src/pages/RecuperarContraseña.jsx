import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecuperarContraseña = () => {
  const [email, setEmail] = useState('');
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError(false);

    if (nueva.length < 6) {
      setError(true);
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/auth/recuperar', {
        email,
        nueva
      });

      setMensaje('✅ Contraseña actualizada correctamente. Comuníquese con el administrador para confirmar el acceso.');
      setEmail('');
      setNueva('');
    } catch (err) {
      setError(true);
      setMensaje('❌ ' + (err.response?.data?.mensaje || 'Error al actualizar la contraseña'));
    }
  };

  return (
    <div style={fondo}>
      <div style={contenedor}>
        <img src="/logo-cnt.jpg" alt="Logo CNT" style={logoStyle} />
        <h2 style={titulo}>🔐 Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={boton}>Restablecer Contraseña</button>
        </form>

        {mensaje && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            borderRadius: '5px',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            border: `1px solid ${error ? '#f5c6cb' : '#c3e6cb'}`,
            textAlign: 'center'
          }}>
            {mensaje}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={link}>← Volver al login</Link>
          <Link to="/dashboard" style={link}>🏠 Ir al menú</Link>
        </div>
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
};

const contenedor = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '2rem',
  borderRadius: '12px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  textAlign: 'center',
};

const logoStyle = {
  width: '100px',
  marginBottom: '1rem',
};

const titulo = {
  color: '#00274d',
  marginBottom: '1.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.95rem',
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
  cursor: 'pointer',
};

const link = {
  color: '#0070c0',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default RecuperarContraseña;



