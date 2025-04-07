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
import "./CodeChallenges.css"

function CodeChallenges() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [sortOption, setSortOption] = useState("default") // default, title-asc, title-desc, difficulty-asc, difficulty-desc
  const [filterOption, setFilterOption] = useState("all") // all, completed, incomplete
  const sortMenuRef = useRef(null)
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

  // Filter challenges based on search term and filter option
  const filteredChallenges = allChallengesData
    .filter((challenge) => {
      // Apply search filter
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply status filter
      if (filterOption === "all") return matchesSearch
      if (filterOption === "completed") return matchesSearch && challenge.status === "Completado"
      if (filterOption === "incomplete") return matchesSearch && challenge.status === "Sin completar"

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
          const difficultyOrder = { fácil: 1, regular: 2, difícil: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "difficulty-desc":
          const difficultyOrderDesc = { fácil: 1, regular: 2, difícil: 3 }
          return difficultyOrderDesc[b.difficulty] - difficultyOrderDesc[a.difficulty]
        default:
          return a.id - b.id // Default sort by ID
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

