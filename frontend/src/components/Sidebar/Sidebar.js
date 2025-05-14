"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

// Import icons
import { HomeIcon, BookOpenIcon, PresentationIcon, CrownIcon, UserIcon, ChevronUpIcon } from "./SidebarIcons"

function Sidebar({ username, className }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user")
    // Redirect to home page
    navigate("/")
    // Reload the page to reset the app state
    window.location.reload()
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {}
  const isAdmin = userData.role === "admin" // Check if the user is an admin

  const menuItems = [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Code Challenges",
      url: "/codechallenges",
      icon: BookOpenIcon,
    },

    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: CrownIcon,
    },
  ]

  return (
    <div className={`sidebar ${className || ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo-link">
          <img src="/images/logo.png" alt="Happy Faces Logo" className="sidebar-logo-image" />
        </Link>
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        <div className="sidebar-group">
          <div className="sidebar-group-content">
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.title} className="sidebar-menu-item">
                  <Link to={item.url} className={`sidebar-menu-button ${isActive(item.url) ? "active" : ""}`}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <div className="dropdown">
              <button className="sidebar-menu-button dropdown-trigger" onClick={toggleDropdown}>
                <UserIcon />
                <span>{username || "Username"}</span>
                <ChevronUpIcon className={dropdownOpen ? "rotate" : ""} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/profile" className={`dropdown-item ${isActive("/profile") ? "active" : ""}`}>
                    Perfil
                  </Link>
                  {/* Mostrar la opción de administración solo si el usuario es administrador */}
                  {isAdmin && (
                    <Link to="/admin" className={`dropdown-item ${isActive("/admin") ? "active" : ""}`}>
                      Administración
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    Salir
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar