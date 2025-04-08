import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Cierra el menú si haces clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  return (
    <nav style={estilos.navbar}>
      {/* Nombre del usuario */}
      <div style={estilos.usuario}>
        👤 {usuario?.nombre} <span style={{ fontWeight: 'normal' }}>({usuario?.rol})</span>
      </div>

      {/* Enlaces principales visibles */}
      <div style={estilos.links}>
        {usuario?.rol === 'tecnico' && (
          <>
            <Link to="/dashboard" style={estilos.link}>🏠 Inicio</Link>
            <Link to="/ingresar-cable" style={estilos.link}>➕ Ingresar Cable</Link>
            <Link to="/inicio-desmontaje" style={estilos.link}>🚧 Inicio Desmontaje</Link>
            <Link to="/finalizar-desmontaje" style={estilos.link}>✅ Finalizar Desmontaje</Link>
          </>
        )}

        {usuario?.rol === 'administrador' && (
          <>
            <Link to="/gestion-cables" style={estilos.link}>📋 Ver Cables</Link>
            <Link to="/gestion-desmontajes" style={estilos.link}>🧰 Ver Desmontajes</Link>
            <Link to="/registrar-usuario" style={estilos.link}>🧑‍💼 Registrar Usuario</Link>
            <Link to="/usuarios" style={estilos.link}>👥 Usuarios</Link>
          </>
        )}

        {usuario?.rol === 'bodeguero' && (
          <>
            <Link to="/gestion-cables" style={estilos.link}>📋 Ver Cables</Link>
            <Link to="/gestion-desmontajes" style={estilos.link}>🧰 Ver Desmontajes</Link>
          </>
        )}
      </div>

      {/* Botón hamburguesa */}
      <div style={estilos.hamburguesa} onClick={toggleMenu}>
        ☰
      </div>

      {/* Menú hamburguesa para ítems adicionales */}
      {menuAbierto && (
        <div ref={menuRef} style={estilos.menuDesplegable}>
          {(usuario?.rol === 'administrador' || usuario?.rol === 'tecnico' || usuario?.rol === 'bodeguero') && (
            <Link to="/notificaciones" style={estilos.menuLink} onClick={() => setMenuAbierto(false)}>🔔 Notificaciones</Link>
          )}

          {usuario?.rol === 'administrador' && (
            <Link to="/logs" style={estilos.menuLink} onClick={() => setMenuAbierto(false)}>📊 Logs</Link>
          )}

          <button onClick={handleLogout} style={estilos.logout}>🚪 Cerrar sesión</button>
        </div>
      )}
    </nav>
  );
};

const estilos = {
  navbar: {
    backgroundColor: '#00274d',
    padding: '1rem 1.5rem',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1000,
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: '1rem',
    flex: '1 1 100%',
    marginBottom: '0.5rem',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.95rem',
    flex: '1 1 auto',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap'
  },
  hamburguesa: {
    fontSize: '1.6rem',
    cursor: 'pointer',
    marginLeft: 'auto',
    padding: '0.3rem 0.8rem',
    background: 'none',
    border: 'none',
    color: '#fff'
  },
  menuDesplegable: {
    position: 'absolute',
    top: '100%',
    right: '1rem',
    backgroundColor: '#00274d',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    minWidth: '180px',
  },
  menuLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  logout: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Navbar;















