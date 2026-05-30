import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
