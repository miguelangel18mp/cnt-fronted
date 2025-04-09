import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DownloadTableExcel } from 'react-export-table-to-excel';

const formatFechaHora = (fecha) => {
  if (!fecha) return '-';
  try {
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return '-';

    
    const ajustada = new Date(dateObj.getTime() + (5 * 60 * 60 * 1000));

    return ajustada.toLocaleString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error);
    return '-';
  }
};


const GestionDesmontajes = () => {
  const [desmontajes, setDesmontajes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modalImg, setModalImg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const tableRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDesmontajes();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalVisible(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDesmontajes = async () => {
    try {
      const res = await axios.get('https://cnt-backend-1sug.onrender.com/api/desmontajes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesmontajes(res.data);
    } catch (err) {
      console.error('Error al obtener los desmontajes:', err);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Desmontajes', 14, 16);
    let y = 30;

    for (let d of desmontajes.filter(d => (filtroTipo ? d.tipo === filtroTipo : true))) {
      doc.setFontSize(10);
      doc.text(`Tipo: ${d.tipo}`, 14, y);
      doc.text(`Capacidad: ${d.capacidad}`, 80, y);
      doc.text(`Usuario: ${d.nombre_usuario}`, 140, y);

      y += 6;
      doc.text(`Inicio:`, 14, y);
      doc.text(`Lat: ${d.latitud_inicio}`, 40, y);
      doc.text(`Long: ${d.longitud_inicio}`, 90, y);
      doc.text(`Hora: ${formatFechaHora(d.hora_inicio)}`, 140, y);

      y += 5;
      doc.text(`Fin:`, 14, y);
      doc.text(`Lat: ${d.latitud_fin || '-'}`, 40, y);
      doc.text(`Long: ${d.longitud_fin || '-'}`, 90, y);
      doc.text(`Hora: ${formatFechaHora(d.hora_fin)}`, 140, y);

      try {
        if (d.foto_inicio) doc.addImage(d.foto_inicio, 'JPEG', 14, y + 6, 40, 30);
        if (d.foto_fin) doc.addImage(d.foto_fin, 'JPEG', 60, y + 6, 40, 30);
      } catch (e) {
        console.warn('❌ Error al cargar imágenes');
      }

      y += 40;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save('reporte_desmontajes.pdf');
  };

  const desmontajesFiltrados = filtroTipo
    ? desmontajes.filter((d) => d.tipo === filtroTipo)
    : desmontajes;

  const abrirModal = (src) => {
    setModalImg(src);
    setModalVisible(true);
  };

  const descargarImagen = () => {
    const link = document.createElement('a');
    link.href = modalImg;
    link.download = `foto-desmontaje-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', backgroundColor: '#e6f0ff', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#00274d' }}>🛠 Gestión de Desmontajes</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="filtroTipo" style={{ marginRight: '0.5rem' }}>Filtrar por tipo:</label>
          <select
            id="filtroTipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px' }}
          >
            <option value="">Todos</option>
            {[...new Set(desmontajes.map((d) => d.tipo))].map((tipo, i) => (
              <option key={i} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
          <DownloadTableExcel
            filename="reporte_desmontajes"
            sheet="Desmontajes"
            currentTableRef={tableRef.current}
          >
            <button style={botonAccion}>📥 Excel</button>
          </DownloadTableExcel>
          <button onClick={exportarPDF} style={botonAccion}>📄 PDF</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table ref={tableRef} style={tablaEstilo}>
            <thead style={theadEstilo}>
              <tr>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>📸 Foto Inicio</th>
                <th>🕒 Hora Inicio</th>
                <th>Lat Inicio</th>
                <th>Long Inicio</th>
                <th>📍 Mapa Inicio</th>
                <th>Lat Fin</th>
                <th>Long Fin</th>
                <th>📸 Foto Fin</th>
                <th>📍 Mapa Fin</th>
                <th>🕒 Hora Fin</th>
                <th>👤 Usuario</th>
              </tr>
            </thead>
            <tbody>
              {desmontajesFiltrados.map((d) => (
                <tr key={d.id}>
                  <td>{d.tipo}</td>
                  <td>{d.capacidad}</td>
                  <td>
                    {d.foto_inicio && (
                      <img
                        src={d.foto_inicio}
                        alt={`foto-inicio-${d.id}`}
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => abrirModal(d.foto_inicio)}
                      />
                    )}
                  </td>
                  <td>{formatFechaHora(d.hora_inicio)}</td>
                  <td>{d.latitud_inicio}</td>
                  <td>{d.longitud_inicio}</td>
                  <td>
                    <a href={`https://www.google.com/maps?q=${d.latitud_inicio},${d.longitud_inicio}`} target="_blank" rel="noreferrer">
                      Ver
                    </a>
                  </td>
                  <td>{d.latitud_fin || '-'}</td>
                  <td>{d.longitud_fin || '-'}</td>
                  <td>
                    {d.foto_fin && (
                      <img
                        src={d.foto_fin}
                        alt={`foto-fin-${d.id}`}
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => abrirModal(d.foto_fin)}
                      />
                    )}
                  </td>
                  <td>
                    {d.latitud_fin && d.longitud_fin ? (
                      <a href={`https://www.google.com/maps?q=${d.latitud_fin},${d.longitud_fin}`} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    ) : '-'}
                  </td>
                  <td>{formatFechaHora(d.hora_fin)}</td>
                  <td>{d.nombre_usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalVisible && (
          <div style={modalEstilo} onClick={() => setModalVisible(false)}>
            <div style={modalContenido} onClick={(e) => e.stopPropagation()}>
              <img src={modalImg} alt="vista" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
              <button onClick={descargarImagen} style={botonDescargar}>⬇️ Descargar Imagen</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// 🎨 Estilos
const botonAccion = {
  backgroundColor: '#0070c0',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const tablaEstilo = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#f2f9ff',
  fontSize: '0.88rem',
  textAlign: 'center',
};

const theadEstilo = {
  backgroundColor: '#00274d',
  color: '#fff',
};

const modalEstilo = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalContenido = {
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '8px',
  textAlign: 'center',
};

const botonDescargar = {
  marginTop: '1rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default GestionDesmontajes;










