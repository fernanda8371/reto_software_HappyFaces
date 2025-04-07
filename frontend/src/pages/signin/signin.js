"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../../utils/firebase.js"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import "./signin.css"

// URL base de la API backend
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
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Signed in with Firebase:", userCredential.user)

      // 2. Autenticar con nuestro backend
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
          // Si el usuario no existe en nuestro backend, lo registramos
          if (response.status === 404) {
            console.log("Usuario no encontrado en el backend, registrando...")
            await registerUserInBackend(userCredential.user);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al iniciar sesión en el servidor');
          }
        } else {
          // Guardamos el token JWT y la información del usuario
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (backendError) {
        console.error("Error con el backend:", backendError);
        // Continuamos de todos modos con la información de Firebase
        // para no bloquear al usuario si el backend falla
        
        // Guardar datos básicos del usuario en localStorage
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
      console.error("Error al iniciar sesión:", err)
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al iniciar sesión. Verifica tu email y contraseña.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este email. Por favor regístrate.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta. Por favor intenta de nuevo.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido. Por favor verifica.';
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Función para registrar usuario en el backend si no existe
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
        throw new Error(errorData.error || 'Error al registrar en el servidor');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error("Error al registrar en backend:", error);
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

      // También autenticar/registrar en el backend
      try {
        // Intentar iniciar sesión primero
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
          // Si el usuario no existe, registrarlo
          if (loginResponse.status === 404) {
            await registerUserInBackend(user);
          } else {
            const errorData = await loginResponse.json();
            throw new Error(errorData.error || 'Error en el servidor');
          }
        } else {
          // Guardar token y datos
          const data = await loginResponse.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (backendError) {
        console.error("Error con el backend:", backendError);
        // Guardar datos básicos del usuario en localStorage de todos modos
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
      console.error("Error al iniciar sesión con Google:", err)
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
          <h1 className="signin-title">Ingresa a tu cuenta</h1>
          <div className="signin-create-account">
            <Link to="/register" className="create-account-link">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
                <label htmlFor="remember">Rercuérdame</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Cargando..." : "Ingresar"}
            </button>

            <div className="separator">
              <span>o</span>
            </div>

            <button type="button" className="google-signin-button" onClick={handleGoogleSignIn} disabled={loading}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="google-icon"
              />
              Ingresar con Google
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SignIn