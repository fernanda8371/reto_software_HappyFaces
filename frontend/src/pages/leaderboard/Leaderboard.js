"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { SearchIcon, ChevronDownIcon, TrophyIcon, MedalIcon, StarIcon } from "./LeaderboardIcons"
import { fetchLeaderboard, fetchUserRank } from "../../services/leaderboard"
import "./Leaderboard.css"

function Leaderboard() {
  const [user, setUser] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Load user rank and leaderboard data
        loadData(parsedUser.user_id)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const loadData = async (userId) => {
    try {
      setLoading(true)

      // Fetch leaderboard data
      const leaderboard = await fetchLeaderboard()
      setLeaderboardData(leaderboard)

      // Fetch user's rank
      const rank = await fetchUserRank(userId)
      setUserRank(rank)

      setError(null)
    } catch (err) {
      setError("Failed to load leaderboard data. Please try again later.")
      console.error("Error loading leaderboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter leaderboard data based on search term
  const filteredLeaderboardData = leaderboardData.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.team.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get medal icon based on rank
  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="medal-icon gold" />
      case 2:
        return <MedalIcon className="medal-icon silver" />
      case 3:
        return <MedalIcon className="medal-icon bronze" />
      default:
        return <StarIcon className="medal-icon" />
    }
  }

  return (
    <DashboardLayout>
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="title-section">
            <h1 className="leaderboard-title">Leaderboard</h1>
            <p className="leaderboard-subtitle">Revisa los ganadores del semestre</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="user-profile">

            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando leaderboard...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="leaderboard-content">
            {/* User Rank Card - Separated from the leaderboard */}
            {userRank && (
              <div className="user-rank-card">
  */}
                <div className="user-rank-content">
                  <div className="user-avatar-container">
                    <div className="user-avatar">
                      <span>{userRank?.username?.charAt(0) || user?.name?.charAt(0) || "U"}</span>
                    </div>
                  </div>
                  <div className="user-rank-details">
                    <h3 className="user-name">{userRank?.username || user?.name || "Usuario"}</h3>
                    <div className="user-rank-stats">
                      <div className="rank-stat">
                        <span className="rank-label">Posición</span>
                        <span className="rank-value">#{userRank?.rank || "N/A"}</span>
                      </div>
                      <div className="rank-stat">
                        <span className="rank-label">Puntos</span>
                        <span className="rank-value">{userRank?.score || 0} pts</span>
                      </div>
                      <div className="rank-stat">
                        <span className="rank-label">Departamento</span>
                        <span className="rank-value">{userRank?.department || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table Card */}
            <div className="leaderboard-card">
              <div className="leaderboard-card-header">
                <h2>Top Participantes</h2>
                <div className="filter-dropdown">
                  <span>Global</span>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="rank-column">Pos.</div>
                  <div className="avatar-column"></div>
                  <div className="username-column">Nombre</div>
                  {/* <div className="userid-column">Email</div> */}
                  <div className="department-column">Departamento</div>
                  <div className="team-column">Equipo</div>
                  <div className="score-column">Puntos</div>
                </div>

                {filteredLeaderboardData.slice(0, 10).length > 0 ? (
    filteredLeaderboardData.slice(0, 10).map((item) => (
                    <div key={item.rank} className="table-row">
                      <div className="rank-column">{item.rank <= 3 ? getMedalIcon(item.rank) : item.rank}</div>
                      <div className="avatar-column">
                        <div className="table-avatar-placeholder">{item.username.charAt(0)}</div>
                      </div>
                      <div className="username-column">{item.username}</div>
                      {/* <div className="userid-column">{item.email}</div> */}
                      <div className="department-column">{item.department}</div>
                      <div className="team-column">{item.team}</div>
                      <div className="score-column">{item.score} pts</div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No se encontraron resultados para tu búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Leaderboard
