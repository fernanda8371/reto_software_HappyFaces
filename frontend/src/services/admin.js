// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"
// src/services/admin.js - add this function to your existing file


// Get all challenges
export const getAllChallenges = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/admin/challenges`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching challenges');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

// Corrige la función getChallengeById en src/services/admin.js

// Get challenge by ID
export const getChallengeById = async (challengeId) => {
  try {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token); // Log para depuración
    
    if (!token) {
      console.warn("No token found in localStorage");
    }
    
    const response = await fetch(`${API_URL}/admin/challenges/${challengeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status); // Ver el estado de la respuesta
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Error: ${response.status}`;
      } catch (e) {
        errorMessage = `Error status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Verifica que data.data exista, si no existe, devuelve el objeto data directamente
    return data.data || data;
  } catch (error) {
    console.error('Error fetching challenge details:', error);
    throw error;
  }
};

// Get submissions for a challenge
export const getSubmissionsForChallenge = async (challengeId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn("No token found in localStorage");
    }
    
    const response = await fetch(`${API_URL}/admin/challenges/${challengeId}/submissions`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("Submissions response status:", response.status);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Error: ${response.status}`;
      } catch (e) {
        errorMessage = `Error status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// Get all users - siguiendo el patrón de leaderboard.js
// Modify frontend/src/services/admin.js to properly use tokens

// Get all users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching users');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    // const token = getToken()
    // if (!token) {
    //   throw new Error("No authentication token found")
    // }

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch user")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

// Create new user
export const createUser = async (userData) => {
  try {
    // const token = getToken()
    // if (!token) {
    //   throw new Error("No authentication token found")
    // }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create user")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update user
export const updateUser = async (userId, userData) => {
  try {
    // const token = getToken()
    // if (!token) {
    //   throw new Error("No authentication token found")
    // }

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update user")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    // const token = getToken()
    // if (!token) {
    //   throw new Error("No authentication token found")
    // }

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete user")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Obtener insights de los desafíos (con datos hardcodeados para pruebas)
export const fetchChallengeInsights = async () => {
  try {
    // Simular un retraso para pruebas
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Datos simulados
    const mockData = {
      mostPopular: {
        title: "Reto de Arrays",
        attempts: 120,
      },
      mostCompleted: {
        title: "Reto de Strings",
        completions: 95,
      },
      mostFailed: {
        title: "Reto de Recursión",
        failures: 80,
      },
      highestSuccessRate: {
        title: "Reto de Condicionales",
        successRate: 85.5,
      },
    };

    return mockData;
  } catch (error) {
    console.error("Error en fetchChallengeInsights (mock):", error);
    throw error;
  }
};

// Add this function to your frontend/src/services/admin.js file

// Create new challenge
export const createChallenge = async (challengeData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(`${API_URL}/admin/challenges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(challengeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create challenge");
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }
};