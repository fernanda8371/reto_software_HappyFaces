// frontend/src/utils/apiClient.js
import { getToken, refreshToken } from '../services/auth';

export const apiClient = async (url, options = {}) => {
  let token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      token = await refreshToken();
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return fetch(url, {
          ...options,
          headers
        });
      }
    }

    return response;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}