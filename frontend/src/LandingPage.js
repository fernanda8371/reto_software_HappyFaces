"use client"
import { useNavigate } from "react-router-dom"
import "./LandingPage.css"

function LandingPage() {
  // Use navigate for programmatic navigation
  const navigate = useNavigate()

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
      <header className="header">
        <div className="container header-container">
          <a
            href="/"
            className="logo"
            onClick={(e) => {
              e.preventDefault()
              navigate("/")
            }}
          >
            <span className="logo-text">
              Happy<span className="logo-text-dark">Faces</span>
            </span>
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
            <div className="hero-badge">
              <span role="img" aria-label="celebration">
                🎉
              </span>
              <span className="divider"></span>
              <span>Happy Faces</span>
            </div>

            <h1 className="hero-title">
              Tech Mahindra
              <br />
              Code Challenges
            </h1>

            <p className="hero-subtitle">Comienza a Practicar</p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={goToSignIn}>
                Practicar
              </button>
              <button className="btn btn-outline btn-lg">Explorar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage

