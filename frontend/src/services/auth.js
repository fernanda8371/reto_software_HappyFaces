// src/services/auth.js
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Registrar un nuevo usuario
export const registerUser = async (name, email, password) => {
  try {
    // 1. Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Actualizar el perfil con el nombre
    await updateProfile(userCredential.user, { displayName: name });
    
    // 3. Registrar en nuestra base de datos
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firebase_uid: userCredential.user.uid,
        email: email,
        name: name,
        role: 'employee' // Por defecto todos son empleados
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    // 4. Obtener el token y datos del usuario
    const data = await response.json();
    
    // 5. Guardar token en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    // 1. Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. Iniciar sesión en nuestra API
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firebase_uid: userCredential.user.uid
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    // 3. Obtener el token y datos del usuario
    const data = await response.json();
    
    // 4. Guardar token en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // En tu consola o en un punto de depuración
    console.log('Base de datos conectada:', process.env.DB_NAME);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    // 1. Cerrar sesión en Firebase
    await signOut(auth);
    
    // 2. Eliminar datos de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Verificar token
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    
    const data = await response.json();
    
    // Actualizar datos del usuario en localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Token verification error:', error);
    // Limpiar localStorage si el token no es válido
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
};

// Obtener usuario actual desde localStorage
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Token retrieval function
export const getToken = () => {
  const token = localStorage.getItem('token');
  
  // Optional: Add token validation
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }

  return token;
}

// In auth.js
export const refreshToken = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        firebase_uid: user.firebase_uid 
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Redirect to login
    window.location.href = '/signin';
    return null;
  }
}