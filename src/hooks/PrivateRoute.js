import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, allowedRoles, ...rest }) => {
  // Replace this with your actual role checking logic
  const userRole = 'user'; // For demonstration purposes

  // Check if the user's role is allowed for the route
  if (!allowedRoles.includes(userRole)) {
    // If not allowed, redirect to some other route
    return <Navigate to="/" />;
  }

  // If allowed, render the element
  return <Route {...rest} element={<Element />} />;
};

export default PrivateRoute;
