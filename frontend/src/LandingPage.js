"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./LandingPage.css"

function LandingPage() {
  // Use navigate for programmatic navigation
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Navigation handlers
  const goToSignIn = () => {
    navigate("/signin")
  }

  const goToRegister = () => {
    navigate("/register")
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`header ${isLoaded ? "header-visible" : ""}`}>
        <div className="container header-container">
          <a
            href="/"
            className="logo"
            onClick={(e) => {
              e.preventDefault()
              navigate("/")
            }}
          >
            <img src="/images/logo.png" alt="Happy Faces Logo" className="logo-image" />
          </a>

          <div className="auth-buttons">
            <button className="btn btn-ghost" onClick={goToSignIn}>
              Iniciar Sesión
            </button>
            <button className="btn btn-primary" onClick={goToRegister}>
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="container hero-container">
            <div className={`hero-badge ${isLoaded ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.3s" }}>
              <span role="img" aria-label="celebration" className="celebration-emoji">
                🎉
              </span>
              <span className="divider"></span>
              <span>Happy Faces</span>
            </div>

            <h1 className={`hero-title ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.5s" }}>
              Tech Mahindra
              <br />
              Code Challenges
            </h1>

            <p className={`hero-subtitle ${isLoaded ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.7s" }}>
              Comienza a Practicar
            </p>

            <div className={`hero-buttons ${isLoaded ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.9s" }}>
              <button className="btn btn-primary btn-lg pulse-on-hover" onClick={goToSignIn}>
                Practicar
              </button>
              <button className="btn btn-outline btn-lg scale-on-hover">Explorar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage

