import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
// Check if there is a saved user
  const user = localStorage.getItem('user');

  if (!user) {
    // If you are not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  // If logged in, render the child component (the protected page)
  return children;
};


export default ProtectedRoute;