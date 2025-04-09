// src/services/leaderboard.js
import { getToken } from "./auth"

// URL base de la API
const API_URL = "http://localhost:3001/api"

// Fetch leaderboard data
export const fetchLeaderboard = async () => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error fetching leaderboard data")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    throw error
  }
}

// Fetch user's rank
export const fetchUserRank = async (userId) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/leaderboard/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error fetching user rank data")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching user rank:", error)
    throw error
  }
}
