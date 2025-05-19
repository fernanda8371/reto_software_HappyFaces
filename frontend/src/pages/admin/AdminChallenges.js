"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { SearchIcon, PlusIcon, SortIcon } from "./AdminIcons"
import "./Admin.css"

function AdminChallenges() {
  const [challenges, setChallenges] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate fetching challenges data
    const fetchChallenges = () => {
      setIsLoading(true)
      // Mock data - in a real app, this would be an API call
      const mockChallenges = [
        {
          id: 1,
          title: "TwoSum",
          languages: ["Python", "Java", "C++"],
          difficulty: "easy",
          status: "Completed",
          completionRate: 78,
        },
        {
          id: 2,
          title: "Number of Islands",
          languages: ["Python", "Java", "C++"],
          difficulty: "medium",
          status: "Not completed",
          completionRate: 45,
        },
        {
          id: 3,
          title: "Palindrome Number",
          languages: ["Python", "Java", "C++"],
          difficulty: "easy",
          status: "Not completed",
          completionRate: 62,
        },
        {
          id: 4,
          title: "Longest Valid Parenthesis",
          languages: ["Python", "Java", "C++"],
          difficulty: "hard",
          status: "Completed",
          completionRate: 32,
        },
      ]

      console.log("Setting challenges:", mockChallenges) // Debug log
      setChallenges(mockChallenges)
      setIsLoading(false)
    }

    fetchChallenges()
  }, [])

  // Filter challenges based on search term
  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddChallenge = () => {
    // Navigate to add challenge page
    navigate("/admin/challenges/add")
  }

  const handleViewChallenge = (challengeId) => {
    // Navigate to challenge detail page
    navigate(`/admin/challenges/${challengeId}`)
  }

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  console.log("Current challenges:", challenges)
  console.log("Filtered challenges:", filteredChallenges)
  console.log("Is loading:", isLoading)

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

          <div className="challenges-list">
            {isLoading ? (
              <div className="loading-message">Loading challenges...</div>
            ) : filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge) => {
                console.log("Rendering challenge:", challenge) // Debug each challenge
                return (
                  <div
                    key={challenge.id}
                    className="challenge-card"
                    onClick={() => handleViewChallenge(challenge.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="challenge-info">
                      <h3 className="challenge-title" style={{ color: "#111827", fontWeight: "bold" }}>
                        {challenge.title || "No Title"}
                      </h3>
                      <p className="challenge-languages">
                        {challenge.languages ? challenge.languages.join(" | ") : "No languages"}
                      </p>
                    </div>
                    <div className="challenge-status">
                      <div className={`difficulty-badge ${getDifficultyClass(challenge.difficulty)}`}>
                        {challenge.difficulty || "Unknown"}
                      </div>
                      <div className="completion-status">{challenge.status || "Unknown"}</div>
                      <div className="completion-rate">
                        <span className="rate-label">Completion rate:</span>
                        <span className="rate-value">{challenge.completionRate || 0}%</span>
                      </div>
                    </div>
                  </div>
                )
              })
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