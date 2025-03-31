"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { SearchIcon, ChevronDownIcon, ListIcon, ChevronLeftIcon, ChevronRightIcon } from "./CodeChallengesIcons"
import "./CodeChallenges.css"

function CodeChallenges() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
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

  // Mock challenges data - expanded to demonstrate pagination
  const allChallengesData = [
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
    {
      id: 5,
      title: "Valid Anagram",
      languages: ["Python", "Java", "C++"],
      status: "Completado",
      difficulty: "fácil",
    },
    {
      id: 6,
      title: "Merge Two Sorted Lists",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "fácil",
    },
    {
      id: 7,
      title: "Maximum Subarray",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "regular",
    },
    {
      id: 8,
      title: "Binary Tree Level Order Traversal",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "regular",
    },
    {
      id: 9,
      title: "Reverse Linked List",
      languages: ["Python", "Java", "C++"],
      status: "Completado",
      difficulty: "fácil",
    },
    {
      id: 10,
      title: "Word Break",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "difícil",
    },
    {
      id: 11,
      title: "Trapping Rain Water",
      languages: ["Python", "Java", "C++"],
      status: "Sin completar",
      difficulty: "difícil",
    },
    {
      id: 12,
      title: "Course Schedule",
      languages: ["Python", "Java", "C++"],
      status: "Completado",
      difficulty: "regular",
    },
  ]

  // Filter challenges based on search term
  const filteredChallenges = allChallengesData.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage)

  // Get current page challenges
  const indexOfLastChallenge = currentPage * itemsPerPage
  const indexOfFirstChallenge = indexOfLastChallenge - itemsPerPage
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge)

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
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
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
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
          {currentChallenges.length > 0 ? (
            currentChallenges.map((challenge) => (
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
            ))
          ) : (
            <div className="no-challenges">
              <p>No se encontraron retos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredChallenges.length > 0 && (
          <div className="pagination">
            <button
              className={`pagination-nav-button ${currentPage === 1 ? "disabled" : ""}`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon />
              <span>Anterior</span>
            </button>

            <div className="pagination-numbers">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`pagination-number ${currentPage === number ? "active" : ""}`}
                  onClick={() => goToPage(number)}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              className={`pagination-nav-button ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <span>Siguiente</span>
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CodeChallenges

