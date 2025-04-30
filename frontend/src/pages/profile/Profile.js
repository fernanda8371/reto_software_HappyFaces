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
    department: "",
    badges: [],
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
          name: parsedUser.name || "User name",
          email: parsedUser.email || "user@example.com",
          department: parsedUser.department || "Tu departamento",
          badges: parsedUser.badges || [],
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
  const seasonalBadges = [
    { id: "firstserver", name: "First Server", image: "/images/badge_one.png", description: "Completa tu primer reto para obtener esta insignia." },
    { id: "completo10", name: "Completo 10", image: "/images/badge_yellow.png", description: "Completa 10 retos para ganar esta insignia." },
    { id: "ultrarapido", name: "Ultrarapido", image: "/images/badge_pink.png", description: "Completa un reto en menos de 5 minutos." },
    { id: "cumpliendoexpectativas", name: "Cumpliendo Expectativas", image: "/images/badge_blue.png", description: "Cumple con todos los requisitos de un reto." },
  ];
  const handleSubmit = (e) => {
    e.preventDefault()

    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      department: formData.department,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)

    // Show success message
    alert("Perfil actualizado correctamente")
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
            <h1 className="profile-title">Perfil</h1>
            
            <p className="profile-subtitle">Revisa tu Perfil</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Buscar" />
            </div>

            <div className="user-profile">
 

            </div>
          </div>
        </div>



<div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="user-info">
              {/* <div className="user-avatar">
              </div> */}
              <div className="user-details">
                <h2>{formData.name}</h2>
                <p>{formData.email}</p>
              </div>
            </div>

            <div className="edit-button-container">
              {!isEditing && (
                <button className="edit-button" onClick={toggleEditing}>
                  Editar
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Departamento</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-row">
                <div className="row-label">Name</div>
                <div className="row-content">
                  <input 
                    type="text" 
                    value={formData.name} 
                    readOnly 
                    className="readonly-input" 
                    placeholder="Nombres"
                  />
                </div>
              </div>
              <div className="profile-row">
                <div className="row-label">Departamento</div>
                <div className="row-content">
                  <input 
                    type="text" 
                    value={formData.department} 
                    readOnly 
                    className="readonly-input" 
                    placeholder="Tu departamento"
                  />
                </div>
              </div>
              <div className="profile-row">
                <div className="row-label">Correo electrónico</div>
                <div className="row-content email-content">
                  <div className="email-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="email-details">
                    <div className="email-address">{formData.email}</div>
                    {/* <div className="email-time">1 month ago</div> */}
                  </div>
                  <div className="email-check">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div className="row-label">Tus insignias</div>
                <div className="row-content badge-container">
                  <div className="badge">🏆</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="user-details">
        <h2>Insignias de temporada</h2>
        </div>
       

        <div className="badges-section">
          <div className="badges-container">
            {/* <div className="badge-categories">
              <span className="badge-category active">First server</span>
              <span className="badge-category">Completo 10</span>
              <span className="badge-category">Ultrarapido</span>
              <span className="badge-category">Cumpliendo expectativas</span>
            </div> */}
            <div className="badges-grid">
  {seasonalBadges.map((badge) => (
    <div key={badge.id} className="badge-item">
      <img src={badge.image} alt={badge.name} className="badge-image" />
    </div>
  ))}
</div>
          </div>
        </div>
      </div>
    </div>

      {/* </div> */}
    </DashboardLayout>
  )
}

export default Profile

