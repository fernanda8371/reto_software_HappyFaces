"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import "./DashboardLayout.css"

function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/signin")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("user")
      navigate("/signin")
    }
  }, [navigate])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!user) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="dashboard-layout">
      <Sidebar username={user.name || user.email} className={sidebarOpen ? "open" : ""} />

      <div className={`dashboard-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout

