"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./signin.css"

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Use navigate for programmatic navigation
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log({ email, password, rememberMe })

    // Simulate successful login
    localStorage.setItem("user", JSON.stringify({ email }))

    // Call the onLogin callback to update auth state
    if (onLogin) {
      onLogin()
    }

    // Navigate to dashboard
    navigate("/dashboard")
  }

  return (
    <div className="signin-page">
      {/* Header */}
      <header className="signin-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">
              Happy<span className="logo-text-dark">Faces</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="signin-main">
        <div className="signin-container">
          <h1 className="signin-title">Accede a tu cuenta</h1>

          <div className="signin-create-account">
            <Link to="/register" className="create-account-link">
              Crea una cuenta
            </Link>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Récuerdame</label>
              </div>

              <Link to="/forgot-password" className="forgot-password">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="signin-button">
              Ingresar
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SignIn

