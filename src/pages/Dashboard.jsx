import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [desmontajeIniciado, setDesmontajeIniciado] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

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

    // Verificar desmontaje en proceso
    const desmontaje = localStorage.getItem('desmontaje_en_proceso');
    setDesmontajeIniciado(!!desmontaje);
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

  const handleFinalizarClick = () => {
    if (desmontajeIniciado) {
      navigate('/finalizar-desmontaje');
    } else {
      setMensajeAlerta('⚠️ Primero debes registrar el inicio del desmontaje.');
      setTimeout(() => setMensajeAlerta(''), 4000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#00274d', color: 'white' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {coords && (
          <div style={cuadroUbicacion}>
            <h3>📌 Tu ubicación actual</h3>
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
              📋 Copiar coordenadas
            </button>
            {copiado && <span style={{ marginLeft: '1rem', color: 'green' }}>¡Copiado!</span>}
          </div>
        )}

        {mensajeAlerta && (
          <div style={alertaEstilo}>
            {mensajeAlerta}
          </div>
        )}

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => navigate('/inicio-desmontaje')} style={botonDashboard}>
            🔧 Inicio de Desmontaje
          </button>

          <button onClick={handleFinalizarClick} style={{ ...botonDashboard, backgroundColor: '#28a745' }}>
            ✅ Finalizar Desmontaje
          </button>

          <button onClick={() => navigate('/ingresar-cable')} style={{ ...botonDashboard, backgroundColor: '#00aaff' }}>
            ➕ Ingresar Cable Desmontado
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 Estilos
const cuadroUbicacion = {
  background: '#fff',
  color: '#333',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const botonDashboard = {
  padding: '1rem 2rem',
  fontSize: '1.1rem',
  color: 'white',
  backgroundColor: '#ff9800',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  transition: 'background 0.3s',
};

const botonSecundario = {
  padding: '0.5rem 1rem',
  backgroundColor: '#0070c0',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const alertaEstilo = {
  backgroundColor: '#fff3cd',
  color: '#856404',
  padding: '1rem',
  marginBottom: '1.5rem',
  borderRadius: '5px',
  textAlign: 'center',
  fontWeight: 'bold',
};

export default Dashboard;






