"use client";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./register.css";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Use navigate for programmatic navigation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    setLoading(true);

    try {
      // Crear el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);

      // Actualizar el perfil del usuario con el nombre completo
      const fullName = apellido ? `${name} ${apellido}` : name;
      if (fullName) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      }

      // Guardar datos del usuario en localStorage
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: fullName || email.split('@')[0], // Usar la primera parte del email como nombre si no hay nombre
        avatar: null
      };
      
      localStorage.setItem("user", JSON.stringify(userData));

      if (onRegister) {
        onRegister(userData);
      }

      navigate("/dashboard"); // Redirect after registration
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.message); // Show error
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">
              Happy<span className="logo-text-dark">Faces</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="register-main">
        <div className="register-container">
          <h1 className="register-title">Create Account</h1>
          <div className="register-signin">
            <Link to="/signin" className="signin-link">or log in</Link>
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
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Registering..." : "Start"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;