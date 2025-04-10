"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import "./Dashboard.css"

// Import icons
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  StarIcon,
  EnvelopeIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  FlameIcon,
} from "./DashboardIcons"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setLoading(false)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setLoading(false)
      }
    } else {
      // Si no hay datos de usuario, redirigir al inicio de sesión
      console.log("No user data found, redirecting to signin")
      navigate("/signin")
    }
  }, [navigate])

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // Si no hay usuario después de cargar, no renderizar el dashboard
  if (!user) {
    return null
  }

  // Recent challenges data
  const recentChallenges = [
    {
      id: 1,
      title: "Two Sum",
      progress: 75,
      image: "/code.jpg",
    },
    {
      id: 2,
      title: "Number of Islands",
      progress: 25,
      image: "/code.jpg",
    },
  ]

  // Leaderboard data
  const leaderboardData = [
    {
      name: "Daniela Caiceros",
      points: 34,
      avatar: null,
    },
    {
      name: "Reneé Ramos",
      points: 30,
      avatar: null,
    },
    {
      name: "Diego Sánchez",
      points: 29,
      avatar: null,
    },
  ]

  // Stats data
  const statsData = {
    lastParticipation: "12 Aug, 2023",
    points: 12,
    totalChallenges: 32,
    completedChallenges: 12,
    incompleteChallenges: 3,
    streakDays: 4,
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="dashboard-title">¡Bienvenido {user?.name || "[User]"}!</h1>
            <p className="dashboard-subtitle">Vamos a Aprender!</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Buscar" />
            </div>

            <div className="user-profile">
              <div className="notification-bell">
                {/* <span className="bell-icon">🔔</span> */}
              </div>
              {/* <div className="avatar-dropdown">
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt="User avatar"
                  className="avatar-image"
                />
                <span className="dropdown-arrow">▼</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Recent Challenges Section */}
          <div className="content-row">
            <div className="section-header">
              <div className="section-title">
                {/* <span className="section-icon">📝</span> */}
                <h2>Retos recientes</h2>
              </div>
              <div className="section-controls">
                <button className="control-button">
                  <ChevronLeftIcon />
                </button>
                <button className="control-button">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div className="challenge-cards">
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="challenge-card">
                  <div 
                    className="challenge-image" 
                    style={{ 
                      backgroundColor: "#333", 
                      backgroundImage: challenge.image ? `url(${challenge.image})` : 'none'
                    }}
                  >
                    <div className="challenge-overlay">
                      <div className="challenge-info">
                        <h3>{challenge.title}</h3>
                        <button className="resume-button">Resume</button>
                      </div>
                      <div className="progress-circle">
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#444" strokeWidth="4" opacity="0.3" />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke={challenge.progress >= 50 ? "#4CAF50" : "#F44336"}
                            strokeWidth="4"
                            strokeDasharray={`${challenge.progress * 1.26} 126`}
                            strokeLinecap="round"
                            transform="rotate(-90 24 24)"
                          />
                          <text x="24" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                            {challenge.progress}%
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard and Stats Section */}
          <div className="content-row">
            {/* Leaderboard */}
            <div className="leaderboard-section">
              <div className="section-header">
                <div className="section-title">
                  {/* <span className="section-icon">🏆</span> */}
                  <h2>Leader Board</h2>
                </div>
              </div>

              <div className="leaderboard-list">
                {leaderboardData.map((user, index) => (
                  <div key={index} className="leaderboard-item">
                    <div className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder"></div>
                      )}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p>{user.points} puntos</p>
                    </div>
                    <div className="medal">
                      {/* <span className="medal-icon">🏅</span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {/* Last Participation */}
              <div className="stats-card participation-card">
                <h3>Último día de participación</h3>
                <div className="calendar-display">
                  <CalendarIcon />
                  <div className="date">{statsData.lastParticipation}</div>
                </div>
                <button className="start-button">Comienza ahora</button>
              </div>

              {/* Points */}
              <div className="stats-card points-card">
                <div className="stats-icon">
                  <StarIcon />
                </div>
                <div className="stats-value">{statsData.points}</div>
                <div className="stats-label">Puntos</div>
              </div>

              {/* Total Challenges */}
              <div className="stats-card total-card">
                <div className="stats-icon">
                  <EnvelopeIcon />
                </div>
                <div className="stats-value">{statsData.totalChallenges}</div>
                <div className="stats-label">Retos totales</div>
              </div>

              {/* Completed Challenges */}
              <div className="stats-card completed-card">
                <div className="stats-icon">
                  <ThumbsUpIcon />
                </div>
                <div className="stats-value">{statsData.completedChallenges}</div>
                <div className="stats-label">Retos completados</div>
              </div>

              {/* Incomplete Challenges */}
              <div className="stats-card incomplete-card">
                <div className="stats-icon">
                  <ThumbsDownIcon />
                </div>
                <div className="stats-value">{statsData.incompleteChallenges}</div>
                <div className="stats-label">Retos incompletos</div>
              </div>

              {/* Streak Days */}
              <div className="stats-card streak-card">
                <div className="stats-icon">
                  <FlameIcon />
                </div>
                <div className="stats-value">{statsData.streakDays}</div>
                <div className="stats-label">Días de racha</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard