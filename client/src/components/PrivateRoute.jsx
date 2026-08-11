import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their default portal dashboard
    const roleDashboards = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      pharmacist: '/pharmacy/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={roleDashboards[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}
