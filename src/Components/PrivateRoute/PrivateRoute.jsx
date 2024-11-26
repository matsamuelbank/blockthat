import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.userInfo.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/connexion-admin" />;
}
