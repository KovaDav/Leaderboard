import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Element {...rest} /> : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
