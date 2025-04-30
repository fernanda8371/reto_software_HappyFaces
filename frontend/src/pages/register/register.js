"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./register.css"
import { auth } from "../../utils/firebase.js"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

// Base URL for backend API
const API_URL = 'http://localhost:3001/api';

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

  // Password validation
  useEffect(() => {
    if (password) {
      const isLengthValid = password.length >= 8
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

      if (!isLengthValid) {
        setPasswordError("Password must be at least 8 characters")
      } else if (!hasUpperCase || !hasLowerCase) {
        setPasswordError("Password must include both uppercase and lowercase letters")
      } else if (!hasNumber) {
        setPasswordError("Password must include at least one number")
      } else if (!hasSpecialChar) {
        setPasswordError("Password must include at least one special character")
      } else {
        setPasswordError("")
      }
    } else {
      setPasswordError("")
    }
  }, [password])

  // Password match validation
  const passwordsMatch = password === confirmPassword

  // Function to register user in our backend
  const registerUserInBackend = async (firebaseUser, displayName) => {
    try {
      const name = displayName || firebaseUser.displayName || firebaseUser.email.split('@')[0];
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error registering on the server');
      }
      
      // Get JWT token and user data from backend
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error("Error registering in backend:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate that passwords match
    if (!passwordsMatch) {
      setError("Passwords don't match")
      return
    }

    // Validate that password meets requirements
    if (passwordError) {
      setError(passwordError)
      return
    }

    setLoading(true)

    try {
      // Create user with email and password in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      const displayName = `${firstName} ${lastName}`;
      
      // Update profile with first and last name in Firebase
      await updateProfile(userCredential.user, {
        displayName: displayName
      })

      // Register user in our backend
      try {
        await registerUserInBackend(userCredential.user, displayName);
      } catch (backendError) {
        console.error("Error registering in backend:", backendError);
        // Continue anyway with Firebase information

        // Save basic user data in localStorage
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName,
          firstName,
          lastName
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
      }
      
      // Notify parent component if onRegister exists
      if (onRegister) {
        onRegister(userCredential.user)
      }
      
      console.log("User registered successfully:", userCredential.user)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      // Handle authentication errors
      let errorMessage = 'Error creating account. Please try again.'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email is not valid.'
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.'
          break
        default:
          console.error("Registration error:", error)
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
      
      // Extract first and last name from Google displayName
      const fullName = result.user.displayName || ""
      const nameParts = fullName.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      
      // Register in backend
      try {
        await registerUserInBackend(result.user);
      } catch (backendError) {
        console.error("Error registering in backend:", backendError);
        
        // Save data in localStorage anyway
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: fullName,
          firstName,
          lastName,
          photoURL: result.user.photoURL
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
      }
      
      // Notify parent component if onRegister exists
      if (onRegister) {
        onRegister(result.user)
      }
      
      console.log("User registered with Google successfully:", result.user)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      let errorMessage = 'Error signing up with Google. Please try again.'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Registration canceled. Window closed before authentication was completed.'
      } else {
        console.error("Google registration error:", error)
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
          <h1 className="register-title">Create an account</h1>

          <div className="register-signin">
            <Link to="/signin" className="signin-link">
              Already have an account? Sign in
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
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
                <label htmlFor="password">Password</label>
                <button
                  className="info-icon"
                  onClick={togglePasswordInfo}
                  aria-label="Information about password requirements"
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
                    Password must be at least 8 characters, include uppercase and lowercase letters, numbers, and special characters.
                  </p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              {confirmPassword && !passwordsMatch && <p className="password-hint">Passwords don't match</p>}
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