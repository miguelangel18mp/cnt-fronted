import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  const obtenerNotificaciones = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/notificaciones/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificaciones(res.data);
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Mis Notificaciones</h2>
        {notificaciones.length === 0 ? (
          <p>No tienes notificaciones aún.</p>
        ) : (
          <ul>
            {notificaciones.map((n) => (
              <li key={n.id}>
                📌 {n.mensaje} <br />
                <small>📅 {new Date(n.fecha).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notificaciones;
