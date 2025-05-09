import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const tiposCable = [
  "CABLE AEREO FO 12H G.652D FIG.8", "CABLE AEREO FO 24H G.652D FIG.8", "CABLE AEREO FO 48H G.652D FIG.8",
  "CABLE ADSS FO 12 H G.652 D VANO 120 M", "CABLE ADSS FO 24 H G.652 D VANO 120 M", "CABLE ADSS FO 48 H G.655 C VANO 120 M",
  "CABLE AEREO 10 PARES", "CABLE CANALIZADO 10 PARES", "CABLE AEREO 100 PARES", "CABLE CANALIZADO 100 PARES",
  "CABLE CANALIZADO 1200 PARES", "CABLE AEREO 150 PARES", "CABLE CANALIZADO 150 PARES",
  "CABLE CANALIZADO 1500 PARES", "CABLE CANALIZADO 1800 PARES", "CABLE AEREO 20 PARES",
  "CABLE CANALIZADO 20 PARES", "CABLE AEREO 200 PARES", "CABLE CANALIZADO 200 PARES", "CABLE AERO 30 PARES",
  "CABLE CANALIZADO 300 PARES", "CABLE CANALIZADO 400 PARES", "CABLE CANALIZADO 50 PARES",
  "CABLE AEREO 50 PARES", "CABLE CANALIZADO 600 PARES", "CABLE AEREO 70 PARES", "CABLE CANALIZADO 70 PARES",
  "CABLE CANALIZADO 90 PARES"
];

const IngresarCable = () => {
  const [formulario, setFormulario] = useState({
    tipo: '',
    capacidad: '',
    metraje: '',
    latitud: '',
    longitud: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [coords, setCoords] = useState(null);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setCoords({ lat, lng });
        setFormulario((prev) => ({ ...prev, latitud: lat, longitud: lng }));
      },
      (err) => console.warn('Error ubicando:', err)
    );
  }, []);

  useEffect(() => {
    const tipo = formulario.tipo.toUpperCase();
    let capacidadDetectada = '';

    const hilosMatch = tipo.match(/(\d+)\s*H/i);
    const paresMatch = tipo.match(/(\d+)\s*PARES/i);

    if (hilosMatch) {
      capacidadDetectada = `${hilosMatch[1]} HILOS`;
    } else if (paresMatch) {
      capacidadDetectada = `${paresMatch[1]} PARES`;
    }

    if (capacidadDetectada) {
      setFormulario((prev) => ({ ...prev, capacidad: capacidadDetectada }));
    }
  }, [formulario.tipo]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      await axios.post('https://cnt-backend-1sug.onrender.com/api/cables', {
        ...formulario,
        ingresado_por: usuario.id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('✅ Cable ingresado correctamente');
      setFormulario((prev) => ({
        tipo: '',
        capacidad: '',
        metraje: '',
        latitud: prev.latitud,
        longitud: prev.longitud,
      }));
    } catch (error) {
      setMensaje('❌ Error al ingresar el cable');
      console.error(error);
    }
  };

  return (
    <div style={fondo}>
      <Navbar />
      <div style={formularioCard}>
        <h2 style={{ color: '#00274d', marginBottom: '1rem', textAlign: 'center' }}>➕ Ingreso de Cable</h2>

        <form onSubmit={handleSubmit}>
          <select name="tipo" value={formulario.tipo} onChange={handleChange} required style={input}>
            <option value="">-- Selecciona el tipo de cable --</option>
            {tiposCable.map((op, i) => <option key={i} value={op}>{op}</option>)}
          </select>

          <input
            type="text"
            name="capacidad"
            value={formulario.capacidad}
            placeholder="Capacidad"
            readOnly
            style={{ ...input, backgroundColor: '#e9ecef' }}
          />

          <input type="number" name="metraje" placeholder="Metraje" value={formulario.metraje} onChange={handleChange} required style={input} />
          <input type="text" name="latitud" placeholder="Latitud" value={formulario.latitud} onChange={handleChange} required style={input} />
          <input type="text" name="longitud" placeholder="Longitud" value={formulario.longitud} onChange={handleChange} required style={input} />

          <button type="submit" style={botonPrincipal}>Guardar Cable</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={botonSecundario}>
            ⬅️ Atrás
          </button>
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

        {coords && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4>📍 Ubicación actual</h4>
            <MapContainer center={[coords.lat, coords.lng]} zoom={16} style={{ height: '300px', width: '100%', borderRadius: '10px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Ubicación del técnico</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎨 Estilos institucionales
const fondo = {
  minHeight: '100vh',
  backgroundColor: '#f4f6f9',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  flexDirection: 'column',
};

const formularioCard = {
  maxWidth: '500px',
  width: '100%',
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const input = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginBottom: '1rem',
  fontSize: '1rem',
};

const botonPrincipal = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#0095DB',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const botonSecundario = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#046693',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.8rem',
};

export default IngresarCable;






