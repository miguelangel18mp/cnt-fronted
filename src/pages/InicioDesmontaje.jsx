import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const tiposCable = [
  "CABLE AEREO FO 12H G.652D FIG.8", "CABLE AEREO FO 24H G.652D FIG.8", "CABLE AEREO FO 48H G.652D FIG.8",
  "CABLE ADSS FO 12 H G.652 D VANO 120 M", "CABLE ADSS FO 24 H G.652 D VANO 120 M", "CABLE ADSS FO 48 H G.655 C VANO 120 M",
  "CABLE AEREO 10 PARES", "CABLE CANALIZADO 10 PARES", "CABLE AEREO 100 PARES", "CABLE CANALIZADO 100 PARES",
  "CABLE CANALIZADO 1200 PARES", "CABLE AEREO 150 PARES", "CABLE CANALIZADO 150 PARES", "CABLE CANALIZADO 1500 PARES",
  "CABLE CANALIZADO 1800 PARES", "CABLE AEREO 20 PARES", "CABLE CANALIZADO 20 PARES", "CABLE AEREO 200 PARES",
  "CABLE CANALIZADO 200 PARES", "CABLE AERO 30 PARES", "CABLE CANALIZADO 300 PARES", "CABLE CANALIZADO 400 PARES",
  "CABLE CANALIZADO 50 PARES", "CABLE AEREO 50 PARES", "CABLE CANALIZADO 600 PARES", "CABLE AEREO 70 PARES",
  "CABLE CANALIZADO 70 PARES", "CABLE CANALIZADO 90 PARES"
];

const InicioDesmontaje = () => {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [hora, setHora] = useState('');
  const [foto, setFoto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(pos.coords.latitude.toFixed(6));
        setLongitud(pos.coords.longitude.toFixed(6));

        const fecha = new Date();
        const horaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');
        setHora(horaFormateada);
      },
      () => setMensaje('❌ No se pudo obtener la ubicación')
    );
  }, []);

  const handleTipo = (e) => {
    const seleccionado = e.target.value;
    setTipo(seleccionado);
    const esHilo = seleccionado.includes("H");
    const cantidad = seleccionado.match(/\d+/)?.[0] || '';
    setCapacidad(`${cantidad} ${esHilo ? 'HILOS' : 'PARES'}`);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!tipo || !capacidad || !latitud || !longitud || !hora || !foto) {
      setMensaje('❌ Todos los campos son obligatorios');
      return;
    }

    try {
      const body = {
        tipo,
        capacidad,
        latitud_inicio: latitud,
        longitud_inicio: longitud,
        hora_inicio: hora,
        foto_inicio: foto
      };

      await axios.post('https://cnt-backend-1sug.onrender.com/api/desmontajes', body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('✅ Inicio de desmontaje registrado correctamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('❌ Error al registrar inicio:', err);
      setMensaje('❌ Ocurrió un error al registrar el desmontaje');
    }
  };

  return (
    <div style={fondo}>
      <div style={card}>
        <h2 style={{ color: '#00274d', marginBottom: '1rem' }}>🚧 Inicio de Desmontaje</h2>

        <form onSubmit={handleSubmit}>
          <select value={tipo} onChange={handleTipo} required style={input}>
            <option value="">-- Selecciona el tipo de cable --</option>
            {tiposCable.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

          <input type="text" value={capacidad} readOnly placeholder="Capacidad" style={input} />
          <input type="text" value={latitud} readOnly placeholder="Latitud" style={input} />
          <input type="text" value={longitud} readOnly placeholder="Longitud" style={input} />
          <input type="text" value={hora} readOnly placeholder="Hora de inicio" style={input} />
          <input type="file" accept="image/*" onChange={handleFoto} required style={input} />

          {latitud && longitud && (
            <iframe
              title="Mapa"
              width="100%"
              height="250"
              style={{ borderRadius: '10px', marginBottom: '1rem' }}
              src={`https://maps.google.com/maps?q=${latitud},${longitud}&z=17&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          )}

          <button type="submit" style={boton}>Registrar inicio</button>
        </form>

        <button onClick={() => navigate('/dashboard')} style={botonAtras}>⬅️ Atrás</button>

        {mensaje && (
          <div style={{
            marginTop: '1rem',
            backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
            padding: '0.8rem',
            borderRadius: '6px',
            color: mensaje.includes('✅') ? '#155724' : '#721c24'
          }}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

const fondo = {
  minHeight: '100vh',
  backgroundImage: 'url("/fondo-cnt.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem'
};

const card = {
  width: '100%',
  maxWidth: '500px',
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const input = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
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
  cursor: 'pointer',
  marginBottom: '1rem'
};

const botonAtras = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default InicioDesmontaje;




