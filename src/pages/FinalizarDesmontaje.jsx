import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FinalizarDesmontaje = () => {
  const [formulario, setFormulario] = useState({
    latitud_fin: '',
    longitud_fin: '',
    hora_fin: '',
    foto_fin: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [mapaCargado, setMapaCargado] = useState(false);
  const [registrado, setRegistrado] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const hora = new Date().toISOString().slice(0, 16);

        setFormulario((prev) => ({
          ...prev,
          latitud_fin: lat,
          longitud_fin: lng,
          hora_fin: hora
        }));
        setMapaCargado(true);
      },
      (err) => {
        console.error('Error al obtener ubicación:', err);
        setMensaje('❌ No se pudo obtener la ubicación');
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setFormulario((prev) => ({ ...prev, [name]: lector.result }));
      };
      lector.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!formulario.foto_fin) {
      setMensaje('❌ La foto final es obligatoria');
      return;
    }

    try {
      const res = await axios.put(
        'https://cnt-backend-1sug.onrender.com/api/desmontajes/finalizar',
        formulario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMensaje(res.data.mensaje || '✅ Desmontaje finalizado correctamente');
      setRegistrado(true);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al finalizar el desmontaje');
    }
  };

  const volver = () => navigate('/dashboard');

  return (
    <div style={fondo}>
      <Navbar />
      <div style={formularioCard}>
        <h2 style={{ color: '#00274d', marginBottom: '1rem' }}>📍 Finalizar Desmontaje</h2>

        {mapaCargado ? (
          <>
            <p><strong>Latitud:</strong> {formulario.latitud_fin}</p>
            <p><strong>Longitud:</strong> {formulario.longitud_fin}</p>
            <iframe
              title="mapa"
              width="100%"
              height="250"
              style={{ borderRadius: '8px', marginBottom: '1rem' }}
              src={`https://maps.google.com/maps?q=${formulario.latitud_fin},${formulario.longitud_fin}&z=16&output=embed`}
              loading="lazy"
            />
          </>
        ) : (
          <p>📍 Obteniendo ubicación...</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="datetime-local"
            name="hora_fin"
            value={formulario.hora_fin}
            readOnly
            style={input}
          />
          <input
            type="file"
            name="foto_fin"
            accept="image/*"
            onChange={handleChange}
            required
            style={input}
          />

          <button type="submit" style={boton}>Finalizar desmontaje</button>
        </form>

        {mensaje && (
          <div style={{
            marginTop: '1rem',
            backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
            padding: '0.8rem',
            borderRadius: '5px',
            color: mensaje.includes('✅') ? '#155724' : '#721c24'
          }}>
            {mensaje}
          </div>
        )}

        {registrado && (
          <button onClick={volver} style={{ ...boton, marginTop: '1rem', backgroundColor: '#28a745' }}>
            ⬅️ Volver al Dashboard
          </button>
        )}
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
  flexDirection: 'column'
};

const formularioCard = {
  maxWidth: '500px',
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const input = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginBottom: '1rem',
  fontSize: '1rem',
};

const boton = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#0070c0',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default FinalizarDesmontaje;

