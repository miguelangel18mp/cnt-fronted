import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const tiposCable = [
  "CABLE AEREO FO 12H G.652D FIG.8",
  "CABLE AEREO FO 24H G.652D FIG.8",
  "CABLE AEREO FO 48H G.652D FIG.8",
  "CABLE ADSS FO 12 H G.652 D VANO 120 M",
  "CABLE ADSS FO 24 H G.652 D VANO 120 M",
  "CABLE ADSS FO 48 H G.655 C VANO 120 M",
  "CABLE AEREO 10 PARES",
  "CABLE CANALIZADO 10 PARES",
  "CABLE AEREO 100 PARES",
  "CABLE CANALIZADO 100 PARES",
  "CABLE CANALIZADO 1200 PARES",
  "CABLE AEREO 150 PARES",
  "CABLE CANALIZADO 150 PARES",
  "CABLE CANALIZADO 1500 PARES",
  "CABLE CANALIZADO 1800 PARES",
  "CABLE AEREO 20 PARES",
  "CABLE CANALIZADO 20 PARES",
  "CABLE AEREO 200 PARES",
  "CABLE CANALIZADO 200 PARES",
  "CABLE AERO 30 PARES",
  "CABLE CANALIZADO 300 PARES",
  "CABLE CANALIZADO 400 PARES",
  "CABLE CANALIZADO 50 PARES",
  "CABLE AEREO 50 PARES",
  "CABLE CANALIZADO 600 PARES",
  "CABLE AEREO 70 PARES",
  "CABLE CANALIZADO 70 PARES",
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
  const [coordenadasCargadas, setCoordenadasCargadas] = useState(false);
  const [opcionesCapacidad, setOpcionesCapacidad] = useState([]);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormulario((prev) => ({
            ...prev,
            latitud: pos.coords.latitude.toFixed(6),
            longitud: pos.coords.longitude.toFixed(6),
          }));
          setCoordenadasCargadas(true);
        },
        (err) => {
          console.warn('Error de ubicación:', err.message);
        }
      );
    }
  };

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  // Detectar tipo de capacidad según el tipo de cable
  useEffect(() => {
    const tipo = formulario.tipo.toLowerCase();
    if (tipo.includes('fo') || tipo.includes('adss')) {
      setOpcionesCapacidad(['12 HILOS', '24 HILOS', '48 HILOS']);
    } else if (tipo.includes('pares')) {
      setOpcionesCapacidad(['10 PARES', '20 PARES', '30 PARES', '50 PARES', '70 PARES', '90 PARES',
        '100 PARES', '150 PARES', '200 PARES', '300 PARES', '400 PARES', '600 PARES',
        '1200 PARES', '1500 PARES', '1800 PARES']);
    } else {
      setOpcionesCapacidad([]);
    }
  }, [formulario.tipo]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
      setMensaje(`📋 Coordenada copiada: ${texto}`);
      setTimeout(() => setMensaje(''), 3000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      await axios.post(
        'https://cnt-backend-1sug.onrender.com/api/cables',
        {
          ...formulario,
          ingresado_por: usuario.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormulario((prev) => ({
        tipo: '',
        capacidad: '',
        metraje: '',
        latitud: prev.latitud,
        longitud: prev.longitud,
      }));

      setMensaje('✅ Cable ingresado correctamente');
      setTimeout(() => setMensaje(''), 5000);
    } catch (err) {
      setMensaje('❌ Error al ingresar el cable');
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#00274d', color: '#fff' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{
          background: '#fff', padding: '2rem', borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', color: '#333'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>➕ Ingreso de Cable</h2>

          <form onSubmit={handleSubmit}>
            <select
              name="tipo"
              value={formulario.tipo}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">-- Selecciona el tipo de cable --</option>
              {tiposCable.map((opcion, i) => (
                <option key={i} value={opcion}>{opcion}</option>
              ))}
            </select>

            <select
              name="capacidad"
              value={formulario.capacidad}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">-- Capacidad --</option>
              {opcionesCapacidad.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>

            <input type="number" name="metraje" placeholder="Metraje" value={formulario.metraje}
              onChange={handleChange} required style={inputStyle} />
            <input type="text" name="latitud" placeholder="Latitud" value={formulario.latitud}
              onChange={handleChange} required style={inputStyle} />
            <input type="text" name="longitud" placeholder="Longitud" value={formulario.longitud}
              onChange={handleChange} required style={inputStyle} />

            <button type="submit" style={botonStyle}>Guardar Cable</button>
          </form>

          {mensaje && (
            <p style={{
              marginTop: '1rem', padding: '0.8rem',
              backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
              color: mensaje.includes('✅') ? '#155724' : '#721c24',
              border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '5px', textAlign: 'center'
            }}>{mensaje}</p>
          )}

          {coordenadasCargadas && (
            <div style={{ marginTop: '2rem' }}>
              <h4>📍 Ubicación actual</h4>
              <p><strong>Latitud:</strong>{' '}
                <span onClick={() => copiarAlPortapapeles(formulario.latitud)}
                  style={{ color: '#0070c0', cursor: 'pointer' }}>
                  {formulario.latitud}
                </span>
              </p>
              <p><strong>Longitud:</strong>{' '}
                <span onClick={() => copiarAlPortapapeles(formulario.longitud)}
                  style={{ color: '#0070c0', cursor: 'pointer' }}>
                  {formulario.longitud}
                </span>
              </p>

              <button onClick={obtenerUbicacion} style={actualizarBtn}>
                📍 Actualizar ubicación actual
              </button>

              <MapContainer
                center={[parseFloat(formulario.latitud), parseFloat(formulario.longitud)]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '300px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[parseFloat(formulario.latitud), parseFloat(formulario.longitud)]}>
                  <Popup>Ubicación del técnico</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '0.7rem', marginBottom: '1rem',
  borderRadius: '5px', border: '1px solid #ccc',
};

const selectStyle = {
  ...inputStyle,
  backgroundColor: '#f9f9f9',
  fontWeight: 'bold',
  appearance: 'none',
  paddingRight: '2rem',
  backgroundImage:
    'url("data:image/svg+xml;utf8,<svg fill=\'%23333\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.7rem center',
  backgroundSize: '1rem',
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
  marginTop: '1rem',
};

const actualizarBtn = {
  marginBottom: '1rem',
  backgroundColor: '#0070c0',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
};

export default IngresarCable;





