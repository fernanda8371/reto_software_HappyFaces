"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./register.css"
import { auth } from "../../utils/firebase.js"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

function Register({ onRegister }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPasswordInfo, setShowPasswordInfo] = useState(false)
  const navigate = useNavigate()

  // Validación de contraseña
  useEffect(() => {
    if (password) {
      const isLengthValid = password.length >= 8
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

      if (!isLengthValid) {
        setPasswordError("La contraseña debe tener al menos 8 caracteres")
      } else if (!hasUpperCase || !hasLowerCase) {
        setPasswordError("La contraseña debe incluir mayúsculas y minúsculas")
      } else if (!hasNumber) {
        setPasswordError("La contraseña debe incluir al menos un número")
      } else if (!hasSpecialChar) {
        setPasswordError("La contraseña debe incluir al menos un carácter especial")
      } else {
        setPasswordError("")
      }
    } else {
      setPasswordError("")
    }
  }, [password])

  // Validación de coincidencia de contraseñas
  const passwordsMatch = password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validar que las contraseñas coincidan
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validar que la contraseña cumpla con los requisitos
    if (passwordError) {
      setError(passwordError)
      return
    }

    setLoading(true)

    try {
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar perfil con nombre y apellido
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      })

      // Guardar datos adicionales en localStorage
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Notificar al componente padre si existe onRegister
      if (onRegister) {
        onRegister(userData)
      }
      
      console.log("Usuario registrado exitosamente:", userCredential.user)
      
      // Redirigir al dashboard
      navigate('/dashboard')
    } catch (error) {
      // Manejar errores de autenticación
      let errorMessage = 'Error al crear la cuenta. Por favor, intenta de nuevo.'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El email ya está registrado.'
          break
        case 'auth/invalid-email':
          errorMessage = 'El email no es válido.'
          break
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil.'
          break
        default:
          console.error("Error de registro:", error)
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Extraer el nombre y apellido del displayName de Google
      const fullName = result.user.displayName || ""
      const nameParts = fullName.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      
      // Guardar datos en localStorage
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: fullName,
        firstName,
        lastName,
        photoURL: result.user.photoURL
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Notificar al componente padre si existe onRegister
      if (onRegister) {
        onRegister(userData)
      }
      
      console.log("Usuario registrado con Google exitosamente:", result.user)
      
      // Redirigir al dashboard
      navigate('/dashboard')
    } catch (error) {
      let errorMessage = 'Error al registrarse con Google. Por favor, intenta de nuevo.'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Registro cancelado. Ventana cerrada antes de completar la autenticación.'
      } else {
        console.error("Error de registro con Google:", error)
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordInfo = (e) => {
    e.preventDefault()
    setShowPasswordInfo(!showPasswordInfo)
  }

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Happy Faces Logo" className="register-logo-image" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        <div className="register-container">
          <h1 className="register-title">Crear una cuenta</h1>

          <div className="register-signin">
            <Link to="/signin" className="signin-link">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password">Contraseña</label>
                <button
                  className="info-icon"
                  onClick={togglePasswordInfo}
                  aria-label="Información sobre requisitos de contraseña"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {passwordError && <p className="password-hint">{passwordError}</p>}
              {showPasswordInfo && (
                <div className="password-info-tooltip">
                  <p>
                    La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres
                    especiales.
                  </p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              {confirmPassword && !passwordsMatch && <p className="password-hint">Las contraseñas no coinciden</p>}
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div className="separator">
              <span>o</span>
            </div>

            <button type="button" className="google-signup-button" onClick={handleGoogleSignUp} disabled={loading}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="google-icon"
              />
              Registrarse con Google
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Register