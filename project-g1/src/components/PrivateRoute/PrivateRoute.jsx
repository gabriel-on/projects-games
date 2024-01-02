// PrivateRoute.jsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, adminOnly }) => {
  // Implemente lógica de verificação de autenticação e autorização aqui
  const isAuthenticated = true; // Exemplo: verificar se o usuário está autenticado
  const isAdmin = true; // Exemplo: verificar se o usuário é um administrador

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
