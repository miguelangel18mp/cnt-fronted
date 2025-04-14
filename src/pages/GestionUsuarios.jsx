import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('https://cnt-backend-1sug.onrender.com/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const iniciarEdicion = (usuario) => {
    setEditando(usuario.id);
    setForm({ ...usuario, contraseña: '' });
  };

  const guardarCambios = async () => {
    try {
      await axios.put(`https://cnt-backend-1sug.onrender.com/api/usuarios/${editando}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('✅ Usuario actualizado correctamente');
      setEditando(null);
      fetchUsuarios();
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al actualizar el usuario');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await axios.delete(`https://cnt-backend-1sug.onrender.com/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('✅ Usuario eliminado correctamente');
      fetchUsuarios();
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al eliminar usuario');
    }
  };

  return (
    <>
      <Navbar />
      <div style={fondo}>
        <h2 style={{ textAlign: 'center', color: '#003865' }}>👥 Gestión de Usuarios</h2>

        {mensaje && (
          <p style={{
            textAlign: 'center',
            color: mensaje.includes('✅') ? '#155724' : '#721c24',
            backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
            padding: '0.8rem',
            margin: '1rem auto',
            borderRadius: '6px',
            fontWeight: 'bold',
            maxWidth: '600px'
          }}>
            {mensaje}
          </p>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={tablaEstilo}>
            <thead style={theadEstilo}>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Nueva Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ textAlign: 'center' }}>
                  <td>
                    {editando === u.id ? (
                      <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    ) : u.nombre}
                  </td>
                  <td>
                    {editando === u.id ? (
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    ) : u.email}
                  </td>
                  <td>
                    {editando === u.id ? (
                      <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                        <option value="tecnico">Técnico</option>
                        <option value="bodeguero">Bodeguero</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    ) : u.rol}
                  </td>
                  <td>
                    {editando === u.id ? (
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={form.contraseña}
                        onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                      />
                    ) : '••••••••'}
                  </td>
                  <td>
                    {editando === u.id ? (
                      <>
                        <button onClick={guardarCambios} style={botonVerde}>💾</button>
                        <button onClick={() => setEditando(null)} style={botonGris}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => iniciarEdicion(u)} style={botonAmarillo}>✏️</button>
                        <button onClick={() => eliminarUsuario(u.id)} style={botonRojo}>🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// 🎨 Estilos aplicados institucionalmente
const fondo = {
  padding: '2rem',
  backgroundColor: '#f4f6f9',
  minHeight: '100vh',
};

const tablaEstilo = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const theadEstilo = {
  backgroundColor: '#003865',
  color: '#ffffff',
  textAlign: 'center',
};

// Botones
const botonVerde = {
  backgroundColor: '#0095DB',
  color: '#fff',
  padding: '0.4rem 0.6rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '0.3rem',
};

const botonGris = {
  backgroundColor: '#046693',
  color: '#fff',
  padding: '0.4rem 0.6rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const botonAmarillo = {
  backgroundColor: '#0095DB',
  color: '#fff',
  padding: '0.4rem 0.6rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '0.3rem',
};

const botonRojo = {
  backgroundColor: '#0095DB',
  color: '#fff',
  padding: '0.4rem 0.6rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default GestionUsuarios;

