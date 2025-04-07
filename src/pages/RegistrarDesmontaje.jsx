import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const RegistrarDesmontaje = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formulario, setFormulario] = useState({
    tipo: '',
    capacidad: '',
    latitud_inicio: '',
    longitud_inicio: '',
    hora_inicio: '',
    foto_inicio: '',
    latitud_fin: '',
    longitud_fin: '',
    hora_fin: '',
    foto_fin: ''
  });

  const [mensaje, setMensaje] = useState('');

  const getUbicacion = (campo) => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const hora = new Date().toISOString().slice(0, 19).replace("T", " ");
      setFormulario(prev => ({
        ...prev,
        [`latitud_${campo}`]: latitude,
        [`longitud_${campo}`]: longitude,
        [`hora_${campo}`]: hora
      }));
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setFormulario((prev) => ({ ...prev, [name]: lector.result }));
      };
      lector.readAsDataURL(files[0]);
    } else {
      setFormulario((prev) => ({ ...prev, [name]: value }));
    }

    // Autocompletar capacidad
    if (name === 'tipo') {
      const esHilos = value.includes('H');
      const match = value.match(/\d+/);
      const capacidad = match ? `${match[0]} ${esHilos ? 'HILOS' : 'PARES'}` : '';
      setFormulario(prev => ({ ...prev, tipo: value, capacidad }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await axios.post(
        'https://cnt-backend-1sug.onrender.com/api/desmontajes',
        formulario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMensaje(res.data.mensaje || '✅ Desmontaje registrado correctamente');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al registrar el desmontaje');
    }
  };

  return (
    <div style={fondo}>
      <div style={formularioCard}>
        <h2 style={{ color: '#00274d', marginBottom: '1rem' }}>🧵 Registrar Desmontaje</h2>

        <form onSubmit={handleSubmit}>
          <select name="tipo" value={formulario.tipo} onChange={handleChange} required style={input}>
            <option value="">-- Selecciona el tipo de cable --</option>
            {tiposCable.map((op, i) => (
              <option key={i} value={op}>{op}</option>
            ))}
          </select>

          <input type="text" name="capacidad" value={formulario.capacidad} readOnly placeholder="Capacidad" style={input} />

          <button type="button" onClick={() => getUbicacion('inicio')} style={botonSecundario}>📍 Capturar Ubicación Inicio</button>
          <input type="file" name="foto_inicio" accept="image/*" onChange={handleChange} required style={input} />

          <button type="button" onClick={() => getUbicacion('fin')} style={botonSecundario}>📍 Capturar Ubicación Fin</button>
          <input type="file" name="foto_fin" accept="image/*" onChange={handleChange} required style={input} />

          <button type="submit" style={boton}>✅ Registrar desmontaje</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={botonCancelar}>🔙 Regresar</button>
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
  padding: '0.9rem',
  backgroundColor: '#0070c0',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem'
};

const botonSecundario = {
  ...boton,
  backgroundColor: '#ffc107',
  color: '#000'
};

const botonCancelar = {
  ...boton,
  backgroundColor: '#6c757d',
};

export default RegistrarDesmontaje;

