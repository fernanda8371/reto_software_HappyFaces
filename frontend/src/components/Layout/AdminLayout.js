"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../AdminSidebar/AdminSidebar"
import "./AdminLayout.css"

function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/signin")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      // In a real app, you would check if the user has admin role
      // For now, we'll just set isAdmin to true for demonstration
      parsedUser.isAdmin = true

      if (!parsedUser.isAdmin) {
        navigate("/dashboard")
        return
      }

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
    <div className="admin-layout">
      <AdminSidebar username={user.name || user.email} className={sidebarOpen ? "open" : ""} />

      <div className="admin-layout-content">
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

export default AdminLayout

