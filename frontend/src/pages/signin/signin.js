"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./signin.css";

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);
      
      // Guardar datos básicos del usuario en localStorage
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || email.split('@')[0], // Usar la primera parte del email como nombre si no hay displayName
        avatar: userCredential.user.photoURL
      };
      
      localStorage.setItem("user", JSON.stringify(userData));

      if (onLogin) {
        onLogin(userData);
      }

      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message); // Show error
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <header className="signin-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">
              Happy<span className="logo-text-dark">Faces</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="signin-main">
        <div className="signin-container">
          <h1 className="signin-title">Sign in to your account</h1>
          <div className="signin-create-account">
            <Link to="/register" className="create-account-link">
              Create an account
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
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">Forgot password</Link>
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignIn;