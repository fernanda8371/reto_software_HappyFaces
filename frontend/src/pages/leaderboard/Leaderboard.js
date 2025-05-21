"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { 
  SearchIcon, 
  ChevronDownIcon, 
  TrophyIcon, 
  MedalIcon, 
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InfoIcon
} from "./LeaderboardIcons"
import { fetchLeaderboard, fetchUserRank } from "../../services/leaderboard"
import "./Leaderboard.css"

function Leaderboard() {
  const [user, setUser] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState("This Month")
  const [categoryFilter, setCategoryFilter] = useState("Overall")
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
      // Añade manejo específico para errores de autenticación
      if (err.message === 'No authentication token found' || err.message === 'Token expired') {
        // Redirigir al inicio de sesión
        navigate('/signin')
        // Limpiar datos de usuario
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } else {
        setError("Failed to load leaderboard data. Please try again later.")
        console.error("Error loading leaderboard data:", err)
      }
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

  // Get top 3 users for podium
  const topThreeUsers = filteredLeaderboardData.slice(0, 3)

  // Get change indicator
  // const getChangeIndicator = (change) => {
  //   if (!change) return null
    
  //   if (change > 0) {
  //     return <ArrowUpIcon className="change-indicator up" />
  //   } else if (change < 0) {
  //     return <ArrowDownIcon className="change-indicator down" />
  //   }
  //   return null
  // }

  return (
    <DashboardLayout>
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="title-section">
            <h1 className="leaderboard-title">Leaderboard</h1>
            <p className="leaderboard-subtitle">Check the semester winners</p>
          </div>

          <div className="leaderboard-controls">
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </div>
            </div>

            <div className="filter-section">

              
              <div className="time-filter">
                <button 
                  className={`time-filter-btn ${timeFilter === "This Month" ? "active" : ""}`}
                  onClick={() => setTimeFilter("This Month")}
                >
                  This Month
                </button>
                <button 
                  className={`time-filter-btn ${timeFilter === "All Time" ? "active" : ""}`}
                  onClick={() => setTimeFilter("All Time")}
                >
                  All Time
                </button>
              </div>
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
            {/* Podium Section */}
            <div className="podium-section">
              {topThreeUsers.length >= 3 && (
                <>
                  <div className="podium-item second">
                    <div className="podium-avatar">
                    <img 
            src="/images/badge_blue.png" /* Imagen del badge para el segundo lugar */
            alt={topThreeUsers[1].username}
            className="podium-img"
          />
                    </div>
                    <div className="podium-name">{topThreeUsers[1].username}</div>
                    <div className="podium-level">Level 3</div>
                    <div className="podium-position">2</div>
                  </div>
                  
                  <div className="podium-item first">
                    <div className="podium-avatar">
                    <img 
            src="/images/badge_pink.png" /* Imagen del badge para el segundo lugar */
            alt={topThreeUsers[1].username}
            className="podium-img"
          />
                    </div>
                    <div className="podium-name">{topThreeUsers[0].username}</div>
                    <div className="podium-level">Level 3</div>
                    <div className="podium-position">1</div>
                  </div>
                  
                  <div className="podium-item third">
                    <div className="podium-avatar">
                    <img 
            src="/images/badge_yellow.png" /* Imagen del badge para el segundo lugar */
            alt={topThreeUsers[1].username}
            className="podium-img"
          />
                    </div>
                    <div className="podium-name">{topThreeUsers[2].username}</div>
                    <div className="podium-level">Level 3</div>
                    <div className="podium-position">3</div>
                  </div>
                </>
              )}
              <div className="podium-zoom">
                <button className="zoom-btn">
                  <SearchIcon />
                </button>
              </div>
            </div>

            <div className="leaderboard-main-content">
              {/* Leaderboard Table */}
              <div className="leaderboard-table-container">
                <div className="leaderboard-table">
                  {filteredLeaderboardData.slice(0, 10).length > 0 ? (
                    filteredLeaderboardData.slice(0, 10).map((item, index) => (
                      <div key={item.rank} className="leaderboard-row">
                        <div className="rank-cell">{item.rank}</div>
                        <div className="user-cell">

                          <div className="user-info">
                            <div className="user-name">{item.username}</div>
                            <div className="department-column">{item.department}</div>
                      {/* <div className="team-column">{item.team}</div> */}
                          </div>
                        </div>
                        <div className="change-cell">
                          {/* {getChangeIndicator(index % 2 === 0 ? 5 : -2)} */}
                          <span className="change-text">
                          <div className="score-column">{item.score} pts</div>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No se encontraron resultados para tu búsqueda.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* User Profile Section */}
              <div className="user-profile-section">
                {userRank && (
                  <>
                    <div className="user-profile-header">
                      <div className="user-profile-info">
                        <h2 className="profile-name">{userRank.username}</h2>
                      </div>
                      <div className="user-rank-stats">
                        <div className="rank-stat">
                          <span className="rank-label">Position</span>
                          <span className="rank-value">#{userRank?.rank || "N/A"}</span>
                        </div>
                        <div className="rank-stat">
                          <span className="rank-label">Points</span>
                          <span className="rank-value">{userRank?.score || 0} pts</span>
                        </div>
                        <div className="rank-stat">
                          <span className="rank-label">Department</span>
                          <span className="rank-value">{userRank?.department || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                  

                    <div className="user-achievements">
                      <h3 className="achievements-title">Achievements</h3>
                      <div className="achievements-grid">
                        <div className="achievement-item">
                          <div className="achievement-icon level1">
                            <span>05</span>
                          </div>
                          <div className="achievement-info">
                            <div className="achievement-level">Level 1 <InfoIcon /></div>
                            <div className="achievement-name">Talk to Listen Ratio</div>
                          </div>
                          <div className="achievement-rank">1</div>
                        </div>
                        
                        <div className="achievement-item">
                          <div className="achievement-icon level3">
                            <span>30</span>
                          </div>
                          <div className="achievement-info">
                            <div className="achievement-level">Level 3 <InfoIcon /></div>
                            <div className="achievement-name">Positive Sentiment</div>
                          </div>
                          <div className="achievement-rank">1</div>
                        </div>
                        
                        <div className="achievement-item">
                          <div className="achievement-icon level4">
                            <span>60</span>
                          </div>
                          <div className="achievement-info">
                            <div className="achievement-level">Level 4 <InfoIcon /></div>
                            <div className="achievement-name">Number of Questions</div>
                          </div>
                          <div className="achievement-rank">2</div>
                        </div>
                        
                        <div className="achievement-item">
                          <div className="achievement-icon level2">
                            <span>15</span>
                          </div>
                          <div className="achievement-info">
                            <div className="achievement-level">Level 2 <InfoIcon /></div>
                            <div className="achievement-name">Conversations</div>
                          </div>
                          <div className="achievement-rank">1</div>
                        </div>
                      </div>
                      
                      <button className="more-achievements-btn">+ 5 More Achievements</button>
                      
                      
                    </div>
                  </>
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