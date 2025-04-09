"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import {
  SearchIcon,
  ChevronDownIcon,
  ListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
} from "./CodeChallengesIcons"
import { fetchChallenges } from "../../services/challenges"
import "./CodeChallenges.css"

function CodeChallenges() {
  const [user, setUser] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [sortOption, setSortOption] = useState("default") // default, title-asc, title-desc, difficulty-asc, difficulty-desc
  const [filterOption, setFilterOption] = useState("all") // all, completed, incomplete
  const sortMenuRef = useRef(null)
  const itemsPerPage = 4
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

  useEffect(() => {
    // Fetch challenges from API
    const loadChallenges = async () => {
      try {
        setLoading(true)
        const data = await fetchChallenges()
        setChallenges(data)
        setError(null)
      } catch (err) {
        setError("Failed to load challenges. Please try again later.")
        console.error("Error loading challenges:", err)
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipVisible && !event.target.closest(".tooltip")) {
        setTooltipVisible(false)
      }

      if (sortMenuOpen && sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [tooltipVisible, sortMenuOpen])

  // Function to navigate to challenge detail
  const goToChallenge = (challengeId) => {
    navigate(`/challenge/${challengeId}`)
  }

  // Filter challenges based on search term and filter option
  const filteredChallenges = challenges
    .filter((challenge) => {
      // Apply search filter
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply status filter
      if (filterOption === "all") return matchesSearch
      if (filterOption === "completed") return matchesSearch && challenge.status === "completed"
      if (filterOption === "incomplete") return matchesSearch && challenge.status !== "completed"

      return matchesSearch
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "difficulty-asc":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "difficulty-desc":
          const difficultyOrderDesc = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrderDesc[b.difficulty] - difficultyOrderDesc[a.difficulty]
        default:
          return a.challenge_id - b.challenge_id // Default sort by ID
      }
    })

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
      case "easy":
        return "badge-easy"
      case "medium":
        return "badge-medium"
      case "hard":
        return "badge-hard"
      default:
        return "badge-easy"
    }
  }

  // Toggle sort menu
  const toggleSortMenu = () => {
    setSortMenuOpen(!sortMenuOpen)
  }

  // Handle sort option selection
  const handleSortOptionSelect = (option) => {
    setSortOption(option)
    setSortMenuOpen(false)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  // Handle filter option selection
  const handleFilterOptionSelect = (option) => {
    setFilterOption(option)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Get sort option display text
  const getSortOptionText = () => {
    switch (sortOption) {
      case "title-asc":
        return "Título (A-Z)"
      case "title-desc":
        return "Título (Z-A)"
      case "difficulty-asc":
        return "Dificultad (Fácil-Difícil)"
      case "difficulty-desc":
        return "Dificultad (Difícil-Fácil)"
      default:
        return "Ordenar"
    }
  }

  // Translate difficulty to Spanish
  const translateDifficulty = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "fácil"
      case "medium":
        return "regular"
      case "hard":
        return "difícil"
      default:
        return difficulty
    }
  }

  // Translate status to Spanish
  const translateStatus = (status) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in_progress":
        return "En progreso"
      case "not_started":
        return "Sin completar"
      default:
        return status
    }
  }

  return (
    <DashboardLayout>
      <div className="challenges-container">
        {/* Header */}
        <div className="challenges-header">
          <div className="title-section">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 className="challenges-title">Code Challenges</h1>
              <div className="tooltip">
                <button
                  className="info-button"
                  onClick={() => setTooltipVisible(!tooltipVisible)}
                  aria-label="Information about points"
                >
                  <InfoIcon />
                </button>
                <div className={`tooltip-content ${tooltipVisible ? "visible" : ""}`}>
                  <h3 className="tooltip-title">Sistema de Puntos</h3>
                  <ul className="points-list">
                    <li className="points-item">
                      <span className="difficulty-indicator difficulty-easy"></span>
                      <span>Fácil: 2 puntos</span>
                    </li>
                    <li className="points-item">
                      <span className="difficulty-indicator difficulty-medium"></span>
                      <span>Regular: 3 puntos</span>
                    </li>
                    <li className="points-item">
                      <span className="difficulty-indicator difficulty-hard"></span>
                      <span>Difícil: 5 puntos</span>
                    </li>
                    <li className="points-item">
                      <span className="bonus-indicator"></span>
                      <span>Bonus: +1 punto por buena complejidad de tiempo y espacio</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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

            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-category">
            <div className="filter-buttons">
              <button
                className={`filter-button ${filterOption === "all" ? "active" : ""}`}
                onClick={() => handleFilterOptionSelect("all")}
              >
                <ListIcon />
                <span>Todo</span>
              </button>
              <button
                className={`filter-button ${filterOption === "completed" ? "active" : ""}`}
                onClick={() => handleFilterOptionSelect("completed")}
              >
                <span>Completados</span>
              </button>
              <button
                className={`filter-button ${filterOption === "incomplete" ? "active" : ""}`}
                onClick={() => handleFilterOptionSelect("incomplete")}
              >
                <span>Sin completar</span>
              </button>
            </div>
          </div>

          <div className="filter-sort" ref={sortMenuRef}>
            <button className="sort-button" onClick={toggleSortMenu}>
              <span>{getSortOptionText()}</span>
              <ChevronDownIcon />
            </button>
            {sortMenuOpen && (
              <div className="sort-menu">
                <button
                  className={`sort-option ${sortOption === "default" ? "active" : ""}`}
                  onClick={() => handleSortOptionSelect("default")}
                >
                  Por defecto
                </button>
                <button
                  className={`sort-option ${sortOption === "title-asc" ? "active" : ""}`}
                  onClick={() => handleSortOptionSelect("title-asc")}
                >
                  Título (A-Z)
                </button>
                <button
                  className={`sort-option ${sortOption === "title-desc" ? "active" : ""}`}
                  onClick={() => handleSortOptionSelect("title-desc")}
                >
                  Título (Z-A)
                </button>
                <button
                  className={`sort-option ${sortOption === "difficulty-asc" ? "active" : ""}`}
                  onClick={() => handleSortOptionSelect("difficulty-asc")}
                >
                  Dificultad (Fácil-Difícil)
                </button>
                <button
                  className={`sort-option ${sortOption === "difficulty-desc" ? "active" : ""}`}
                  onClick={() => handleSortOptionSelect("difficulty-desc")}
                >
                  Dificultad (Difícil-Fácil)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Challenges List */}
        <div className="challenges-list">
          {loading ? (
            <div className="loading-challenges">
              <div className="loading-spinner"></div>
              <p>Cargando desafíos...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : currentChallenges.length > 0 ? (
            currentChallenges.map((challenge) => (
              <div
                key={challenge.challenge_id}
                className="challenge-item"
                onClick={() => goToChallenge(challenge.challenge_id)}
                style={{ cursor: "pointer" }}
              >
                <div className="challenge-info">
                  <h2 className="challenge-title">{challenge.title}</h2>
                  <p className="challenge-languages">
                    {challenge.tags ? challenge.tags.map((tag) => tag.name).join(" | ") : "Sin etiquetas"}
                  </p>
                </div>

                <div className="challenge-status">
                  <div className={`challenge-badge ${getDifficultyBadge(challenge.difficulty)}`}>
                    {translateDifficulty(challenge.difficulty)}
                  </div>
                  <div className="challenge-completion">{translateStatus(challenge.status)}</div>
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
