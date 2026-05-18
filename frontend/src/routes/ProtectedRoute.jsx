import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { token, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
