import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const empId = localStorage.getItem('employeeId');
    setIsLoggedIn(!!empId);
    setIsReady(true);
  }, []);

  if (!isReady) return null; // or a loader/spinner

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AuthGuard;
