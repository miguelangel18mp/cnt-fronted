import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <nav
      style={{
        backgroundColor: '#00274d',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        flexWrap: 'wrap',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      {/* Info del usuario */}
      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        👤 {usuario?.nombre} <span style={{ fontWeight: 'normal' }}>({usuario?.rol})</span>
      </div>

      {/* Menú de navegación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.95rem' }}>
        {usuario?.rol === 'tecnico' && (
          <>
            <Link to="/dashboard" style={linkStyle}>🏠 Dashboard</Link>
            <Link to="/ingresar-cable" style={linkStyle}>➕ Ingresar Cable</Link>
            <Link to="/inicio-desmontaje" style={linkStyle}>🚧 Inicio Desmontaje</Link>
            <Link to="/finalizar-desmontaje" style={linkStyle}>✅ Finalizar Desmontaje</Link>
          </>
        )}

        {usuario?.rol !== 'tecnico' && (
          <>
            <Link to="/gestion-cables" style={linkStyle}>📋 Ver Cables</Link>
            <Link to="/gestion-desmontajes" style={linkStyle}>🧰 Ver Desmontajes</Link> {/* ✅ NUEVO */}
          </>
        )}

        <Link to="/notificaciones" style={linkStyle}>🔔 Notificaciones</Link>

        {usuario?.rol === 'administrador' && (
          <>
            <Link to="/logs" style={linkStyle}>📊 Logs</Link>
            <Link to="/registrar-usuario" style={linkStyle}>🧑‍💼 Registrar Usuario</Link>
            <Link to="/usuarios" style={linkStyle}>👥 Usuarios</Link>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            padding: '0.4rem 0.9rem',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseOver={(e) => (e.target.style.background = '#0055a5')}
          onMouseOut={(e) => (e.target.style.background = 'transparent')}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.2s',
};

export default Navbar;










