import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IngresarCable from './pages/IngresarCable';
import GestionCables from './pages/GestionCables';
import GestionDesmontajes from './pages/GestionDesmontajes';
import Notificaciones from './pages/Notificaciones';
import Logs from './pages/Logs';
import RegistrarUsuario from './pages/RegistrarUsuario';
import RecuperarContraseña from './pages/RecuperarContraseña';
import GestionUsuarios from './pages/GestionUsuarios';
import SolicitarRecuperacion from './pages/SolicitarRecuperacion';
import Restablecer from './pages/Restablecer';
import RegistrarDesmontaje from './pages/RegistrarDesmontaje';
import InicioDesmontaje from './pages/InicioDesmontaje';
import FinalizarDesmontaje from './pages/FinalizarDesmontaje';

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

        {/* Técnico */}
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
          path="/registrar-desmontaje"
          element={
            <PrivateRoute roles={['tecnico']}>
              <RegistrarDesmontaje />
            </PrivateRoute>
          }
        />
        <Route
          path="/inicio-desmontaje"
          element={
            <PrivateRoute roles={['tecnico']}>
              <InicioDesmontaje />
            </PrivateRoute>
          }
        />
        <Route
          path="/finalizar-desmontaje"
          element={
            <PrivateRoute roles={['tecnico']}>
              <FinalizarDesmontaje />
            </PrivateRoute>
          }
        />

        {/* Admin y Bodeguero */}
        <Route
          path="/gestion-cables"
          element={
            <PrivateRoute roles={['administrador', 'bodeguero']}>
              <GestionCables />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-desmontajes"
          element={
            <PrivateRoute roles={['administrador', 'bodeguero']}>
              <GestionDesmontajes />
            </PrivateRoute>
          }
        />

        {/* Todos los roles autenticados */}
        <Route
          path="/notificaciones"
          element={
            <PrivateRoute>
              <Notificaciones />
            </PrivateRoute>
          }
        />

        {/* Solo Administrador */}
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











