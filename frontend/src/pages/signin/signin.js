"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../../utils/firebase.js"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import "./signin.css"

// Base URL for the backend API
const API_URL = 'http://localhost:3001/api';

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Signed in with Firebase:", userCredential.user)

      // 2. Authenticate with our backend
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebase_uid: userCredential.user.uid
          })
        });

        if (!response.ok) {
          // If the user doesn't exist in our backend, we register them
          if (response.status === 404) {
            console.log("User not found in backend, logging in...")
            await registerUserInBackend(userCredential.user);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error logging into the server');
          }
        } else {
          // Save the JWT token and user information
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (backendError) {
        console.error("Error with the backend:", backendError);
        // Continue anyway with Firebase information
        // to not block the user if the backend fails
        
        // Save basic user data in localStorage
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || email.split("@")[0],
          avatar: userCredential.user.photoURL,
        }

        localStorage.setItem("user", JSON.stringify(userData))
      }

      if (onLogin) {
        onLogin(userCredential.user)
      }

      navigate("/dashboard") // Redirect after login
    } catch (err) {
      console.error("Login error:", err)
      
      // More user-friendly error messages
      let errorMessage = 'Login failed. Please check your email and password.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'There is no account with this email. Please register.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email. Please verify.';
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Function to register user in the backend if they don't exist
  const registerUserInBackend = async (firebaseUser) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error logging into the server');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error("Error registering in backend:", error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const user = result.user

      // Also authenticate/register in the backend
      try {
        // Try to log in first
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebase_uid: user.uid
          })
        });

        if (!loginResponse.ok) {
          // If the user doesn't exist, register them
          if (loginResponse.status === 404) {
            await registerUserInBackend(user);
          } else {
            const errorData = await loginResponse.json();
            throw new Error(errorData.error || 'Error with server');
          }
        } else {
          // Save token and data
          const data = await loginResponse.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (backendError) {
        console.error("Error with backend:", backendError);
        // Save basic user data in localStorage anyway
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split("@")[0],
          avatar: user.photoURL,
        }

        localStorage.setItem("user", JSON.stringify(userData))
      }

      if (onLogin) {
        onLogin(user)
      }

      navigate("/dashboard") // Redirect after login
    } catch (err) {
      console.error("Error signing in with Google:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-page">
      <header className="signin-header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Happy Faces Logo" className="signin-logo-image" />
          </Link>
        </div>
      </header>

      <main className="signin-main">
        <div className="signin-container">
          <h1 className="signin-title">Sign in to your account</h1>
          <div className="signin-create-account">
            <Link to="/register" className="create-account-link">
            Don't have an account? Sign up
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="signin-form" onSubmit={handleSubmit}>
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
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                I forgot my password
              </Link>
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Loading..." : "Sign in"}
            </button>

            <div className="separator">
              <span>or</span>
            </div>

            <button type="button" className="google-signin-button" onClick={handleGoogleSignIn} disabled={loading}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="google-icon"
              />
              Sign in with Google
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SignIn