import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IngresarCable from './pages/IngresarCable';
import GestionCables from './pages/GestionCables';
import Notificaciones from './pages/Notificaciones';
import Logs from './pages/Logs';
import RegistrarUsuario from './pages/RegistrarUsuario';
import RecuperarContraseña from './pages/RecuperarContraseña'; // ← Método directo (opcional)
import GestionUsuarios from './pages/GestionUsuarios';
import SolicitarRecuperacion from './pages/SolicitarRecuperacion'; // ✅ Nueva vista para solicitar recuperación
import Restablecer from './pages/Restablecer'; // ✅ Vista para ingresar nueva contraseña con token

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />
        <Route path="/solicitar-recuperacion" element={<SolicitarRecuperacion />} />
        <Route path="/restablecer" element={<Restablecer />} />

        {/* 🔒 RUTAS PROTEGIDAS */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['tecnico']}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/ingresar-cable"
          element={
            <PrivateRoute roles={['tecnico']}>
              <IngresarCable />
            </PrivateRoute>
          }
        />

        <Route
          path="/gestion-cables"
          element={
            <PrivateRoute roles={['administrador', 'bodeguero']}>
              <GestionCables />
            </PrivateRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <PrivateRoute>
              <Notificaciones />
            </PrivateRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <PrivateRoute roles={['administrador']}>
              <Logs />
            </PrivateRoute>
          }
        />

        <Route
          path="/registrar-usuario"
          element={
            <PrivateRoute roles={['administrador']}>
              <RegistrarUsuario />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute roles={['administrador']}>
              <GestionUsuarios />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;









