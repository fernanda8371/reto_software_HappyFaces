"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./register.css"

function Register({ onRegister }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [apellido, setApellido] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Registration logic will be implemented later

    setLoading(false)
  }

  const handleGoogleSignUp = () => {
    // Google sign up functionality will be implemented later
  }

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">
              Happy<span className="logo-text-dark">Faces</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        <div className="register-container">
          <h1 className="register-title">Create an account</h1>

          <div className="register-signin">
            <Link to="/signin" className="signin-link">
              Already have an account? Sign in
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input 
                  type="text" 
                  id="apellido" 
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="separator">
              <span>or</span>
            </div>

            <button type="button" className="google-signup-button" onClick={handleGoogleSignUp} disabled={loading}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="google-icon"
              />
              Sign up with Google
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Register

