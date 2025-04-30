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
  StarIcon,
  EnvelopeIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  FlameIcon,
  TrophyIcon,
  CodeIcon,
  GiftIcon,
  MedalGoldIcon,
  MedalSilverIcon,
  MedalBronzeIcon,
} from "./DashboardIcons"

// Import services
import { fetchUserChallengesProgress } from "../../services/challenges"
import { fetchLeaderboard } from "../../services/leaderboard"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentChallenges, setRecentChallenges] = useState([])
  const [leaderboardData, setLeaderboardData] = useState([])
  const [statsData, setStatsData] = useState({
    points: 0,
    totalChallenges: 0,
    completedChallenges: 0,
    incompleteChallenges: 0,
    streakDays: 0,
  })
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0)
  const navigate = useNavigate()

  // Prizes data
  const prizes = [
    {
      id: 1,
      title: "500 puntos",
      subtitle: "Taza personalizada",
      image: "/images/taza.jpg",
      backgroundColor: "#1e1e1e",
    },
    {
      id: 2,
      title: "1000 puntos",
      subtitle: "Audífonos inalámbricos",
      image: "/images/audi.png",
      backgroundColor: "#1e1e1e",
    },
    {
      id: 3,
      title: "1500 puntos",
      subtitle: "Mochila Tech Mahindra",
      image: "/images/mochila.jpeg",
      backgroundColor: "#1e1e1e",
    },
  ]

  // Challenge backgrounds
  const challengeBackgrounds = [
    "/images/code-bg-1.jpg",
    "/images/code-bg-2.jpg",
    "/images/code-bg-3.jpg",
    "/images/code-bg-4.jpg",
  ]

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Fetch user challenges and stats
        fetchUserData(parsedUser)

        // Fetch leaderboard
        fetchLeaderboardData()
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

  const fetchUserData = async (user) => {
    try {
      // Fetch user challenges progress
      const progressData = await fetchUserChallengesProgress()

      // Set stats data
      setStatsData({
        points: user.total_score || 0,
        totalChallenges: progressData.stats.totalChallenges || 0,
        completedChallenges: progressData.stats.completed || 0,
        incompleteChallenges: progressData.stats.notStarted || 0,
        streakDays: user.streak_days || 0,
      })

      // Get recent challenges (in progress or recently completed)
      const inProgressChallenges = progressData.challenges.filter((c) => c.status === "in_progress")

      const recentlyCompletedChallenges = progressData.challenges
        .filter((c) => c.status === "completed")
        .sort((a, b) => new Date(b.completed_date) - new Date(a.completed_date))
        .slice(0, 3)

      // Combine and limit to 4 challenges
      const recent = [...inProgressChallenges, ...recentlyCompletedChallenges].slice(0, 4)

      // Format for display
      const formattedRecent = recent.map((challenge, index) => ({
        id: challenge.challenge_id,
        title: challenge.title,
        progress: challenge.status === "completed" ? 100 : challenge.attempts > 0 ? 50 : 25, // Simple progress estimation
        image: challengeBackgrounds[index % challengeBackgrounds.length],
      }))

      setRecentChallenges(
        formattedRecent.length > 0
          ? formattedRecent
          : [
              {
                id: 1,
                title: "Two Sum",
                progress: 75,
                image: challengeBackgrounds[0],
              },
              {
                id: 2,
                title: "Number of Islands",
                progress: 25,
                image: challengeBackgrounds[1],
              },
              {
                id: 3,
                title: "Valid Parentheses",
                progress: 60,
                image: challengeBackgrounds[2],
              },
              {
                id: 4,
                title: "Merge Intervals",
                progress: 40,
                image: challengeBackgrounds[3],
              },
            ],
      )
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Use fallback data
      setRecentChallenges([
        {
          id: 1,
          title: "Two Sum",
          progress: 75,
          image: challengeBackgrounds[0],
        },
        {
          id: 2,
          title: "Number of Islands",
          progress: 25,
          image: challengeBackgrounds[1],
        },
        {
          id: 3,
          title: "Valid Parentheses",
          progress: 60,
          image: challengeBackgrounds[2],
        },
        {
          id: 4,
          title: "Merge Intervals",
          progress: 40,
          image: challengeBackgrounds[3],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboardData = async () => {
    try {
      const leaderboard = await fetchLeaderboard()
      // Get top 3 users
      setLeaderboardData(leaderboard.slice(0, 3))
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      // Fallback data
      setLeaderboardData([
        {
          username: "Daniela Caiceros",
          score: 34,
          avatar: null,
        },
        {
          username: "Reneé Ramos",
          score: 30,
          avatar: null,
        },
        {
          username: "Diego Sánchez",
          score: 29,
          avatar: null,
        },
      ])
    }
  }

  // Prize carousel navigation
  const nextPrize = () => {
    setCurrentPrizeIndex((prevIndex) => (prevIndex === prizes.length - 1 ? 0 : prevIndex + 1))
  }

  const prevPrize = () => {
    setCurrentPrizeIndex((prevIndex) => (prevIndex === 0 ? prizes.length - 1 : prevIndex - 1))
  }

  // Challenge card navigation
  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`)
  }

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

            {/* <div className="user-profile">
              <div className="avatar-dropdown">
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt="User avatar"
                  className="avatar-image"
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="dashboard-grid-layout">
          {/* Recent Challenges */}
          <div className="grid-item recent-challenges">
            <div className="section-header compact">
              <div className="section-title">
                <CodeIcon className="section-icon" />
                <h2>Retos recientes</h2>
              </div>
            </div>
            <div className="code-challenge-cards">
              {recentChallenges.slice(0, 4).map((challenge) => (
                <div
                  key={challenge.id}
                  className="code-challenge-card"
                  onClick={() => handleChallengeClick(challenge.id)}
                  style={{
                    backgroundImage: `url(/images/code.jpg)`,
                  }}
                >
                  <div className="code-challenge-overlay">
                    <div className="code-challenge-content">
                      <h3>{challenge.title}</h3>
                      <button className="resume-button">Resume</button>
                    </div>
                    <div className="progress-circle-container">
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

          {/* Prizes Carousel */}
          <div className="grid-item prizes-section">
            <div className="section-header compact">
              <div className="section-title">
                <GiftIcon className="section-icon" />
                <h2>Premios disponibles</h2>
              </div>
              <div className="section-controls">
                <button className="control-button" onClick={prevPrize}>
                  <ChevronLeftIcon />
                </button>
                <button className="control-button" onClick={nextPrize}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
            <div className="code-prizes-carousel">
              {prizes.map((prize, index) => (
                <div
                  key={prize.id}
                  className={`code-prize-card ${index === currentPrizeIndex ? "active" : ""}`}
                  style={{ backgroundImage: `url(${prize.image})` }}
                >
                  <div className="code-prize-overlay">
                    <div className="prize-content">
                      <h3>{prize.title}</h3>
                      <p>{prize.subtitle}</p>
                      <button
  className="claim-button"
  onClick={() =>
    navigate("/prizes/details", { state: { prize } })
  }
>
  Ver detalles
</button>                    </div>
                  </div>
                </div>
              ))}
              <div className="carousel-indicators">
                {prizes.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentPrizeIndex ? "active" : ""}`}
                    onClick={() => setCurrentPrizeIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="grid-item leaderboard-section">
            <div className="section-header compact">
              <div className="section-title">
                <TrophyIcon className="section-icon" />
                <h2>Leader Board</h2>
              </div>
            </div>
            <div className="compact-leaderboard-list">
              {leaderboardData.map((user, index) => (
                <div key={index} className="compact-leaderboard-item">
                  <div className="compact-user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder">{user.username.charAt(0)}</div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <p>{user.score} pts</p>
                  </div>
                  <div className="medal">
                    {index === 0 ? (
                      <MedalGoldIcon className="medal-icon" />
                    ) : index === 1 ? (
                      <MedalSilverIcon className="medal-icon" />
                    ) : (
                      <MedalBronzeIcon className="medal-icon" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid-item stats-section">
            <div className="section-header compact">
              <div className="section-title">
                <StarIcon className="section-icon" />
                <h2>Estadísticas</h2>
              </div>
            </div>
            <div className="compact-stats-grid">
              {/* Points */}
              <div className="compact-stats-card">
                <div className="stats-icon">
                  <StarIcon />
                </div>
                <div className="stats-value">{statsData.points}</div>
                <div className="stats-label">Puntos</div>
              </div>

              {/* Total Challenges */}
              <div className="compact-stats-card">
                <div className="stats-icon">
                  <EnvelopeIcon />
                </div>
                <div className="stats-value">{statsData.totalChallenges}</div>
                <div className="stats-label">Retos totales</div>
              </div>

              {/* Completed Challenges */}
              <div className="compact-stats-card">
                <div className="stats-icon">
                  <ThumbsUpIcon />
                </div>
                <div className="stats-value">{statsData.completedChallenges}</div>
                <div className="stats-label">Completados</div>
              </div>

              {/* Incomplete Challenges */}
              <div className="compact-stats-card">
                <div className="stats-icon">
                  <ThumbsDownIcon />
                </div>
                <div className="stats-value">{statsData.incompleteChallenges}</div>
                <div className="stats-label">Incompletos</div>
              </div>

              {/* Streak Days */}
              <div className="compact-stats-card">
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
