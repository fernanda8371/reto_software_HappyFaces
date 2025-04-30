"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import { SearchIcon, EditIcon } from "./ProfileIcons"
import "./Profile.css"

function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    completedChallenges: "",
    location: "",
    mobileNumber: "",
    score: "",
    joinDate: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Initialize form data with user data or defaults
        setFormData({
          name: parsedUser.name || "Your name",
          email: parsedUser.email || "yourname@gmail.com",
          completedChallenges: "12",
          location: "USA",
          mobileNumber: "",
          score: "85",
          joinDate: "2023-01-15",
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)

    // Show success message
    alert("Profile updated successfully")
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  return (
    <DashboardLayout>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="title-section">
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">Check your Profile</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Search" />
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

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-info-card">
              <div className="profile-header-section">
                <div className="profile-avatar-container">
                  <img
                    src={user?.avatar || "/placeholder.svg?height=80&width=80"}
                    alt="Profile"
                    className="profile-avatar-image"
                  />
                  <button className="edit-avatar-button">
                    <EditIcon />
                  </button>
                </div>
                <div className="profile-name-section">
                  <h2 className="profile-name">{formData.name}</h2>
                  <p className="profile-email">{formData.email}</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-label">Name</div>
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{formData.name}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-label">Email account</div>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{formData.email}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-label">Completed Challenges</div>
                  {isEditing ? (
                    <input
                      type="text"
                      id="completedChallenges"
                      name="completedChallenges"
                      value={formData.completedChallenges}
                      onChange={handleInputChange}
                      readOnly
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">Add number</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-label">Location</div>
                  {isEditing ? (
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">USA</div>
                  )}
                </div>

                <div className="form-actions">
                  {isEditing ? (
                    <button type="submit" className="profile-button">
                      Save Change
                    </button>
                  ) : (
                    <button type="button" className="profile-button" onClick={toggleEditing}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="profile-stats-card">
              <div className="stats-row">
                <div className="stats-label">Score</div>
                <div className="stats-value">{formData.name}</div>
              </div>

              <div className="stats-row">
                <div className="stats-label">since</div>
                <div className="stats-value">{formData.email}</div>
              </div>

              <div className="stats-row">
                <div className="stats-label">Mobile number</div>
                <div className="stats-value">Add number</div>
              </div>

              <div className="stats-row">
                <div className="stats-label">Location</div>
                <div className="stats-value">USA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile