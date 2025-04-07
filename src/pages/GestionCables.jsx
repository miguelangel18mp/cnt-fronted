import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const tiposCable = [
  "CABLE AEREO FO 12H G.652D FIG.8",
  "CABLE AEREO FO 24H G.652D FIG.8",
  "CABLE AEREO FO 48H G.652D FIG.8",
  "CABLE ADSS FO  12 H G.652 D VANO 120 M",
  "CABLE ADSS FO  24 H G.652 D VANO 120 M",
  "CABLE ADSS FO  48 H G.655 C VANO 120 M",
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

const GestionCables = () => {
  const [cables, setCables] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({});
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => { fetchCables(); }, []);

  const fetchCables = async () => {
    try {
      const res = await axios.get('https://cnt-backend-1sug.onrender.com/api/cables', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCables(res.data);
    } catch (err) {
      console.error('Error al obtener los cables:', err);
    }
  };

  const iniciarEdicion = (cable) => {
    setEditando(cable.id);
    setFormEdicion({ ...cable });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setFormEdicion({});
  };

  const guardarEdicion = async (id) => {
    try {
      await axios.put(`https://cnt-backend-1sug.onrender.com/api/cables/${id}`, {
        ...formEdicion,
        editado_por: usuario.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('✅ Cable actualizado correctamente');
      fetchCables();
      cancelarEdicion();
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al actualizar el cable');
    }
  };

  const eliminarCable = async (id) => {
    if (!window.confirm('¿Deseas marcar este cable como INACTIVO?')) return;
    try {
      await axios.delete(`https://cnt-backend-1sug.onrender.com/api/cables/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { eliminado_por: usuario.id },
      });
      setMensaje('✅ Cable marcado como inactivo');
      fetchCables();
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al inactivar el cable');
    }
  };

  const exportarExcel = () => {
    const data = cablesFiltrados.map(c => ({
      Tipo: c.tipo,
      Capacidad: c.capacidad,
      Metraje: c.metraje,
      Latitud: c.latitud,
      Longitud: c.longitud,
      Estado: c.estado,
      'Ingresado por': c.nombre_usuario
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cables');
    XLSX.writeFile(workbook, 'reporte_cables.xlsx');
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Cables', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [['Tipo', 'Capacidad', 'Metraje', 'Latitud', 'Longitud', 'Estado', 'Ingresado por']],
      body: cablesFiltrados.map(c => [
        c.tipo, c.capacidad, c.metraje, c.latitud, c.longitud, c.estado, c.nombre_usuario
      ]),
    });
    doc.save('reporte_cables.pdf');
  };

  const handleTipoChange = (e) => {
    const tipoSeleccionado = e.target.value;
    const esHilos = tipoSeleccionado.includes('H');
    const valorCapacidad = esHilos
      ? `${tipoSeleccionado.match(/\d+/)} HILOS`
      : `${tipoSeleccionado.match(/\d+/)} PARES`;

    setFormEdicion({ ...formEdicion, tipo: tipoSeleccionado, capacidad: valorCapacidad });
  };

  const cablesFiltrados = filtroTipo
    ? cables.filter((c) => c.tipo === filtroTipo)
    : cables;

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', backgroundColor: '#e6f0ff', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#00274d' }}>📋 Gestión de Cables</h2>

        {mensaje && (
          <div style={{
            backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
            color: mensaje.includes('✅') ? '#155724' : '#721c24',
            padding: '0.8rem',
            borderRadius: '6px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '1rem auto'
          }}>{mensaje}</div>
        )}

        {!editando && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="filtroTipo" style={{ marginRight: '0.5rem' }}>Filtrar por tipo de cable:</label>
              <select
                id="filtroTipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '5px' }}
              >
                <option value="">Todos</option>
                {[...new Set(cables.map((c) => c.tipo))].map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
              <button onClick={exportarExcel} style={botonAccion}>📥 Excel</button>
              <button onClick={exportarPDF} style={botonAccion}>📄 PDF</button>
            </div>
          </>
        )}

        {/* ... la tabla y la lógica de edición quedan igual, solo cambia cables por cablesFiltrados */}

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#f2f9ff',
            fontSize: '0.95rem',
            textAlign: 'center',
          }}>
            <thead style={{ backgroundColor: '#00274d', color: '#fff' }}>
              <tr>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Metraje</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Estado</th>
                <th>Ingresado por</th>
                <th>Mapa</th>
                {usuario.rol !== 'tecnico' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cablesFiltrados.map(c => (
                <tr key={c.id}>
                  <td>{c.tipo}</td>
                  <td>{c.capacidad}</td>
                  <td>{c.metraje} m</td>
                  <td>{c.latitud}</td>
                  <td>{c.longitud}</td>
                  <td>{c.estado}</td>
                  <td>{c.nombre_usuario}</td>
                  <td>
                    <a
                      href={`https://www.google.com/maps?q=${c.latitud},${c.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0070c0', fontWeight: 'bold' }}
                    >📍 Ver</a>
                  </td>
                  {usuario.rol !== 'tecnico' && (
                    <td>
                      <button onClick={() => iniciarEdicion(c)} style={botonEditar}>✏️</button>
                      <button onClick={() => eliminarCable(c.id)} style={botonEliminar}>🗑</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Estilos
const inputStyle = {
  width: '100%',
  padding: '0.6rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginBottom: '0.9rem',
};

const botonAccion = {
  backgroundColor: '#0070c0',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const botonEditar = {
  backgroundColor: '#ffc107',
  color: '#000',
  padding: '0.4rem',
  border: 'none',
  borderRadius: '5px',
  marginRight: '0.3rem',
  cursor: 'pointer',
};

const botonEliminar = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '0.4rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const botonGuardar = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const botonCancelar = {
  backgroundColor: '#6c757d',
  color: '#fff',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default GestionCables;










