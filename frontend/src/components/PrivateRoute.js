// // src/components/PrivateRoute.js
// import React, { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';

// // Componente para proteger rutas que requieren autenticación
// const PrivateRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Verificar si el usuario está autenticado (si hay datos de usuario en localStorage)
//     const checkAuth = () => {
//       const user = localStorage.getItem('user');
//       setIsAuthenticated(!!user);
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Mientras se verifica la autenticación, muestra un loader
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Cargando...</p>
//       </div>
//     );
//   }

//   // Si no hay usuario autenticado, redirige a la página de inicio de sesión
//   if (!isAuthenticated) {
//     return <Navigate to="/signin" />;
//   }

//   // Si hay usuario autenticado, muestra el contenido protegido
//   return children;
// };

// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  // Mostrar un loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirige a la página de inicio de sesión
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Si la ruta es solo para administradores y el usuario no es admin, redirige al dashboard
  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Si todo está bien, renderiza el contenido protegido
  return children;
};

export default PrivateRoute;