
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  // SRS: vendor must be admin-approved to operate
  if (role === 'vendor' && !user.approved) {
    return <div className="container" role="alert" aria-live="assertive">
      <h2>Awaiting Admin Approval</h2>
      <p>Your account is pending approval. You’ll be notified when approved.</p>
    </div>;
  }
  return children;
}
