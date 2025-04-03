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

  const handleIrIngresarCable = () => {
    navigate('/ingresar-cable');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#00274d', color: 'white' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mapa y coordenadas */}
        {coords && (
          <div style={{
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}>
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
            <button
              onClick={handleCopy}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0070c0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              📋 Copiar coordenadas
            </button>
            {copiado && <span style={{ marginLeft: '1rem', color: 'green' }}>¡Copiado!</span>}
          </div>
        )}

        {/* Botón para ingresar cable */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleIrIngresarCable}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#00aaff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            ➕ Ingresar Cable Desmontado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





