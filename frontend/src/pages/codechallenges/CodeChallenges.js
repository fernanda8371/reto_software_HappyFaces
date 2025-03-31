"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { SearchIcon, ChevronDownIcon, ListIcon } from "./CodeChallengesIcons"
import "./CodeChallenges.css"

function CodeChallenges() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Function to navigate to challenge detail
  const goToChallenge = (challengeId) => {
    navigate(`/challenge/${challengeId}`)
  }

  // Mock challenges data
  const challengesData = [
    {
      id: 1,
      title: "TwoSum",
      languages: ["Python", "Java", "C++"],
      status: "Completado",
      difficulty: "fácil",
    },
    {
      id: 2,
      title: "Number of Islands",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "regular",
    },
    {
      id: 3,
      title: "Palindrome Number",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "fácil",
    },
    {
      id: 4,
      title: "Longest Valid Parenthesis",
      languages: ["Python", "Java", "C++"],
      status: "Completado",
      difficulty: "difícil",
    },
  ]

  // Get difficulty badge class
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
        return "badge-easy"
      case "regular":
        return "badge-medium"
      case "difícil":
        return "badge-hard"
      default:
        return "badge-easy"
    }
  }

  return (
    <DashboardLayout>
      <div className="challenges-container">
        {/* Header */}
        <div className="challenges-header">
          <div className="title-section">
            <h1 className="challenges-title">Code Challenges</h1>
            <p className="challenges-subtitle">Completa los retos para ganar puntos</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Buscar" />
            </div>

            <div className="user-profile">
              <div className="notification-bell">
                <span className="bell-icon">🔔</span>
              </div>
              <div className="avatar-dropdown">
                <img
                  src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt="User avatar"
                  className="avatar-image"
                />
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-category">
            <ListIcon />
            <span>Todo</span>
          </div>

          <div className="filter-sort">
            <span>Ordenar</span>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Challenges List */}
        <div className="challenges-list">
          {challengesData.map((challenge) => (
            <div
              key={challenge.id}
              className="challenge-item"
              onClick={() => goToChallenge(challenge.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="challenge-info">
                <h2 className="challenge-title">{challenge.title}</h2>
                <p className="challenge-languages">{challenge.languages.join(" | ")}</p>
              </div>

              <div className="challenge-status">
                <div className={`challenge-badge ${getDifficultyBadge(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </div>
                <div className="challenge-completion">{challenge.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-button">Siguiente página</button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CodeChallenges

