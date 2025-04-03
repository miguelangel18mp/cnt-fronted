import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const RegistrarUsuario = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    rol: 'tecnico',
  });

  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      await axios.post('http://localhost:3000/api/usuarios', formulario, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje('✅ Usuario registrado correctamente');
      setFormulario({
        nombre: '',
        email: '',
        contraseña: '',
        rol: 'tecnico',
      });
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al registrar usuario');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#00274d', color: '#fff' }}>
      <Navbar />

      <div style={contenedorFormulario}>
        <h2 style={{ textAlign: 'center', color: '#00274d', marginBottom: '1.5rem' }}>
          🧑‍💼 Registrar Nuevo Usuario
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formulario.nombre}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Correo institucional"
            value={formulario.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formulario.contraseña}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="rol"
            value={formulario.rol}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="tecnico">Técnico</option>
            <option value="bodeguero">Bodeguero</option>
            <option value="administrador">Administrador</option>
          </select>

          <button type="submit" style={botonStyle}>Registrar</button>
        </form>

        {mensaje && (
          <p style={{
            marginTop: '1rem',
            padding: '0.8rem',
            backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
            color: mensaje.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

// 🎨 Estilos
const contenedorFormulario = {
  maxWidth: '600px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  color: '#333',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '0.95rem',
};

const botonStyle = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#0070c0',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default RegistrarUsuario;

