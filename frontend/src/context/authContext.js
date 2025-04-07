// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  verifyToken, 
  getCurrentUser 
} from '../services/auth';

// Crear contexto
const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar obtener usuario de localStorage primero
        const storedUser = getCurrentUser();
        if (storedUser) {
          setCurrentUser(storedUser);
        }
        
        // Verificar token con el backend
        const user = await verifyToken();
        setCurrentUser(user);
        setError(null);
      } catch (err) {
        console.error('Auth verification error:', err);
        setCurrentUser(null);
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para registrar usuario
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(name, email, password);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, password);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;