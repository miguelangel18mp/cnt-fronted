import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    obtenerLogs();
  }, []);

  const obtenerLogs = async () => {
    try {
      const res = await axios.get('https://cnt-backend-1sug.onrender.com/api/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Error al obtener logs:', err);
    }
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      logs.map(log => ({
        ID: log.id,
        Usuario: log.nombre_usuario,
        Acción: log.accion,
        Descripción: log.descripcion,
        Fecha: new Date(log.fecha).toLocaleString()
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
    XLSX.writeFile(workbook, `reporte_logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();

    const img = new Image();
    img.src = '/logo-cnt.jpg';

    img.onload = () => {
      doc.addImage(img, 'JPEG', 10, 10, 30, 15);
      doc.setFontSize(16);
      doc.text('Reporte de Logs del Sistema - CNT EP', 50, 20);

      autoTable(doc, {
        startY: 30,
        head: [['ID', 'Usuario', 'Acción', 'Descripción', 'Fecha']],
        body: logs.map(log => [
          log.id,
          log.nombre_usuario || 'N/A',
          log.accion,
          log.descripcion,
          new Date(log.fecha).toLocaleString()
        ]),
        theme: 'grid'
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(`📅 Fecha: ${fecha}`, 14, pageHeight - 10);
      doc.text(`👤 Usuario: ${usuario?.nombre || 'N/A'}`, 130, pageHeight - 10);

      doc.save(`reporte_logs_${new Date().toISOString().slice(0, 10)}.pdf`);
    };
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', backgroundColor: '#f1f5fb', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#00274d' }}>📊 Historial de Acciones</h2>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={exportarExcel} style={botonExportar}>📥 Excel</button>
          <button onClick={exportarPDF} style={botonExportar}>📄 PDF</button>
        </div>

        {logs.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No hay registros de acciones aún.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
            <table style={tablaEstilo}>
              <thead style={{ backgroundColor: '#00274d', color: '#fff' }}>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ backgroundColor: '#f9f9f9' }}>
                    <td>{log.id}</td>
                    <td>{log.nombre_usuario || 'N/A'}</td>
                    <td>{log.accion}</td>
                    <td>{log.descripcion}</td>
                    <td>{new Date(log.fecha).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const tablaEstilo = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  fontSize: '0.95rem',
};

const botonExportar = {
  backgroundColor: '#0070c0',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Logs;


