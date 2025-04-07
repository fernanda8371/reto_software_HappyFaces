"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { SearchIcon, ChevronDownIcon } from "./LeaderboardIcons"
import "./Leaderboard.css"

function Leaderboard() {
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

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 4,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 6,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
    {
      rank: 7,
      avatar: "/placeholder.svg?height=40&width=40",
      username: "username",
      userId: "user id",
      department: "department",
      team: "team",
      city: "city",
    },
  ]

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
              <input type="text" placeholder="Buscar" />
            </div>

            <div className="user-profile">
              <div className="notification-bell">
                <span className="bell-icon">🔔</span>
              </div>
              {/* <div className="avatar-dropdown">
                <img
                  src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt="User avatar"
                  className="avatar-image"
                />
                <span className="dropdown-arrow">▼</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="leaderboard-content">
          <div className="leaderboard-card">
            {/* User Info and Filter Row */}
            <div className="user-info-row">
              <div className="user-avatar-container">
                <div className="user-avatar">
                  <span>User avatar</span>
                </div>
              </div>

              <div className="user-name-container">
                <h2 className="user-name">user name</h2>
                <p className="user-rank">#30</p>
              </div>

              <div className="filter-dropdown">
                <span>Top Participants</span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="leaderboard-table">
              {leaderboardData.map((item) => (
                <div key={item.rank} className="table-row">
                  <div className="rank-column">{item.rank}</div>
                  <div className="avatar-column">
                    <img
                      src={item.avatar || "/placeholder.svg"}
                      alt={`Rank ${item.rank} user`}
                      className="table-avatar"
                    />
                  </div>
                  <div className="username-column">{item.username}</div>
                  <div className="userid-column">{item.userId}</div>
                  <div className="department-column">{item.department}</div>
                  <div className="team-column">{item.team}</div>
                  <div className="city-column">{item.city}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Leaderboard

