import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Error obteniendo ubicación:', err.message);
        }
      );
    }
  }, []);

  const handleCopy = () => {
    if (coords) {
      const texto = `${coords.lat}, ${coords.lng}`;
      navigator.clipboard.writeText(texto).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  };

  return (
    <div style={fondo}>
      <Navbar />
      <div style={contenedor}>
        {coords && (
          <div style={cuadroUbicacion}>
            <h3 style={{ marginBottom: '1rem', color: '#003865' }}>📍 Tu Ubicación Actual</h3>
            <div style={{ height: '280px', marginBottom: '1rem' }}>
              <iframe
                title="mapa-ubicacion"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '6px' }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=es&z=16&output=embed`}
              ></iframe>
            </div>
            <p><strong>Latitud:</strong> {coords.lat}</p>
            <p><strong>Longitud:</strong> {coords.lng}</p>
            <button onClick={handleCopy} style={botonAccion}>📋 Copiar Coordenadas</button>
            {copiado && <span style={{ marginLeft: '1rem', color: '#28a745' }}>¡Copiado!</span>}
          </div>
        )}

        <div style={contenedorBotones}>
          <button onClick={() => navigate('/inicio-desmontaje')} style={botonAccion}>
            🔧 Inicio de Desmontaje de Cable
          </button>

          <button onClick={() => navigate('/finalizar-desmontaje')} style={botonAccion}>
            ✅ Finalizar Desmontaje de Cable
          </button>

          <button onClick={() => navigate('/ingresar-cable')} style={botonAccion}>
            ➕ Ingresar Cable Desmontado
          </button>
        </div>
      </div>
    </div>
  );
};

const fondo = {
  minHeight: '100vh',
  backgroundColor: '#f4f6f9', 
  color: '#ffffff',
};


const contenedor = {
  padding: '2rem',
  maxWidth: '960px',
  margin: '0 auto',
};

const cuadroUbicacion = {
  backgroundColor: '#f5f5f5', // Gris claro
  color: '#333333',
  borderRadius: '6px',
  padding: '1.5rem',
  marginBottom: '2.5rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const contenedorBotones = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.2rem',
};

const botonAccion = {
  padding: '1rem 2rem',
  fontSize: '1rem',
  color: '#ffffff',
  backgroundColor: '#0095DB', // Azul CNT
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '420px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  transition: 'background 0.3s ease',
};

export default Dashboard;











