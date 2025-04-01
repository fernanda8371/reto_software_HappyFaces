import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apellido, setApellido] = useState('');

  
  // Use navigate for programmatic navigation
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log({ name, email, password });
    
    // Simulate successful registration
    localStorage.setItem('user', JSON.stringify({ name, email }));
    
    // Call the onRegister callback to update auth state if provided
    if (onRegister) {
      onRegister();
    }
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">Happy<span className="logo-text-dark">Faces</span></span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        <div className="register-container">
          <h1 className="register-title">Registrarse</h1>
          
          <div className="register-signin">
            <Link to="/signin" className="signin-link">Iniciar sesión</Link>
          </div>
          
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
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
            
            <button type="submit" className="register-button">Comenzar</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;
