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
            <div style={{ height: '300px', marginBottom: '1rem' }}>
              <iframe
                title="mapa-ubicacion"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=es&z=16&output=embed`}
              ></iframe>
            </div>
            <p><strong>Latitud:</strong> {coords.lat}</p>
            <p><strong>Longitud:</strong> {coords.lng}</p>
            <button onClick={handleCopy} style={botonSecundario}>
              📋 Copiar Coordenadas
            </button>
            {copiado && <span style={{ marginLeft: '1rem', color: 'green' }}>¡Copiado!</span>}
          </div>
        )}

        <div style={contenedorBotones}>
          <button onClick={() => navigate('/inicio-desmontaje')} style={botonDashboard}>
            🔧 Inicio de Desmontaje de Cable
          </button>

          <button onClick={() => navigate('/finalizar-desmontaje')} style={{ ...botonDashboard, backgroundColor: '#28a745' }}>
            ✅ Finalizar Desmontaje de Cable
          </button>

          <button onClick={() => navigate('/ingresar-cable')} style={{ ...botonDashboard, backgroundColor: '#0077b6' }}>
            ➕ Ingresar Cable Desmontado
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 Estilos con fondo institucional
const fondo = {
  minHeight: '100vh',
  backgroundColor: '#003865', // Azul institucional CNT
  color: '#ffffff',
};

const contenedor = {
  padding: '2rem',
  maxWidth: '960px',
  margin: '0 auto',
};

const cuadroUbicacion = {
  background: '#ffffff',
  color: '#222',
  borderRadius: '10px',
  padding: '1.5rem',
  marginBottom: '2.5rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const botonSecundario = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#0070c0',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.95rem',
};

const contenedorBotones = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.4rem',
};

const botonDashboard = {
  padding: '1rem 2rem',
  fontSize: '1.05rem',
  color: '#fff',
  backgroundColor: '#ff9800',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'background 0.3s',
};

export default Dashboard;








