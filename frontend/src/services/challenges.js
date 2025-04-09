// src/services/challenges.js
import { getToken } from "./auth"

// URL base de la API
const API_URL = "http://localhost:3001/api"

// Fetch all challenges
export const fetchChallenges = async () => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/challenges`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error fetching challenges")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching challenges:", error)
    throw error
  }
}

// Fetch a single challenge by ID
export const fetchChallengeById = async (challengeId) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/challenges/${challengeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error fetching challenge")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching challenge:", error)
    throw error
  }
}

// Submit a solution for a challenge
export const submitSolution = async (challengeId, code, language = "javascript") => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/challenges/${challengeId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, language }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error submitting solution")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error submitting solution:", error)
    throw error
  }
}

// Fetch user's progress on challenges
export const fetchUserChallengesProgress = async () => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/challenges/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error fetching user challenges progress")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching user challenges progress:", error)
    throw error
  }
}
