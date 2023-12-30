// ./components/PrivateRoute/PrivateRoute.jsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PrivateRoute({ element, ...props }) {
  const { user } = useAuth();

  console.log('user:', user); // Adicione este console.log para depuração

  return <Route {...props} element={user ? element : <Navigate to="/login" />} />;
}

export default PrivateRoute;