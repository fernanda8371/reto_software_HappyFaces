// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

// Get all users - siguiendo el patrón de leaderboard.js
export const getAllUsers = async () => {
  try {
    // Para pruebas, no requerimos token por ahora
    // const token = getToken()
    // if (!token) {
    //   throw new Error("No authentication token found")
    // }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch users")
    }

    const data = await response.json()
    console.log("Users data received:", data)
    return data.data || []
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    throw error
  }
}

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