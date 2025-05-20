"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { SearchIcon, PlusIcon, SortIcon } from "./AdminIcons"
import { getAllChallenges } from "../../services/admin"
import "./Admin.css"

function AdminChallenges() {
  const [challenges, setChallenges] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await getAllChallenges()
      console.log("Challenges fetched successfully:", data)
      setChallenges(data)
    } catch (err) {
      console.error("Error fetching challenges:", err)
      setError("Failed to load challenges. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter challenges based on search term
  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddChallenge = () => {
    navigate("/admin/challenges/add")
  }

  const handleViewChallenge = (challengeId) => {
    navigate(`/admin/challenges/${challengeId}`)
  }

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "difficulty-easy"
      case "medium":
        return "difficulty-medium"
      case "hard":
        return "difficulty-hard"
      default:
        return "difficulty-easy"
    }
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div className="title-section">
            <h1 className="admin-title">Code Challenges</h1>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            
          </div>
        </div>

        <div className="admin-content">
          <div className="challenges-header">
            <div className="filter-tabs">
              <button className="filter-tab active">
                All
              </button>
            </div>

            <div className="challenges-actions">
              <button className="sort-button">
                Sort
              </button>
              <button className="add-button" onClick={handleAddChallenge}>
                <PlusIcon />
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchChallenges} className="retry-button">
                Retry
              </button>
            </div>
          )}

          <div className="challenges-list">
            {isLoading ? (
              <div className="loading-message">Loading challenges...</div>
            ) : filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge) => (
                <div
                  key={challenge.challenge_id}
                  className="challenge-card"
                  onClick={() => handleViewChallenge(challenge.challenge_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="challenge-info">
                    <h3 className="challenge-title" style={{ color: "#111827", fontWeight: "bold" }}>
                      {challenge.title || "No Title"}
                    </h3>
                    <p className="challenge-languages">
                      {challenge.tags ? challenge.tags.map(tag => tag.name).join(" | ") : "No tags"}
                    </p>
                  </div>
                  <div className="challenge-status">
                    <div className={`difficulty-badge ${getDifficultyClass(challenge.difficulty)}`}>
                      {challenge.difficulty || "Unknown"}
                    </div>
                    <div className="completion-status">{challenge.active ? "Active" : "Inactive"}</div>
                    <div className="completion-rate">
                      <span className="rate-label">Completion rate:</span>
                      <span className="rate-value">{challenge.completion_rate || 0}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">No challenges found</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminChallenges