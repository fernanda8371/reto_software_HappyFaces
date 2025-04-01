"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import "./AdminSidebar.css"

// Import icons
import { CodeIcon, UsersIcon, SettingsIcon, LogoutIcon } from "./AdminSidebarIcons"

function AdminSidebar({ username }) {
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

  return (
    <div className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Link to="/admin" className="logo-link">
          <div className="logo">

            <div className="logo-text">
              <span className="logo-happy">Happy</span>
              <span className="logo-faces">Faces</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link
              to="/admin/challenges"
              className={`sidebar-menu-button ${isActive("/admin/challenges") ? "active" : ""}`}
            >
              <CodeIcon />
              <span>Code Challenges</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link to="/admin/users" className={`sidebar-menu-button ${isActive("/admin/users") ? "active" : ""}`}>
              <UsersIcon />
              <span>Usuarios</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="user-email">{username}</div>
        <ul className="sidebar-menu">

          <li className="sidebar-menu-item">
            <button className="sidebar-menu-button" onClick={handleLogout}>
              <LogoutIcon />
              <span>Salir</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSidebar

