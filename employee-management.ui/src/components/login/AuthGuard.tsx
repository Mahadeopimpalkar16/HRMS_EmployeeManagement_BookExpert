import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('employeeId'); // or use access token

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AuthGuard;
