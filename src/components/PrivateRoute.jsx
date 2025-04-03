import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay token o usuario, redirigir al login
  if (!token || !usuario) {
    return <Navigate to="/" />;
  }

  // Si la ruta tiene restricciones de roles y el rol del usuario no está permitido
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/notificaciones" />; // o a otra página si prefieres
  }

  // Acceso permitido
  return children;
};

export default PrivateRoute;

