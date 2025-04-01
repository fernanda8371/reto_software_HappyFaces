"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import "./App.css"
import "./LandingPage.css"

// Import pages
import SignIn from "./pages/signin/signin"
import Register from "./pages/register/register"
import NotFound from "./pages/error/NotFound"
import Dashboard from "./pages/dashboard/Dashboard"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import CodeChallenges from "./pages/codechallenges/CodeChallenges"
import ChallengeDetail from "./pages/challenge/ChallengeDetail"
import Profile from "./pages/profile/Profile"
import LandingPage from "./LandingPage"

// Font style
const FontStyle = () => (
  <style jsx global>{`
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
`}</style>
)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated when app loads
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      setIsLoggedIn(!!user)
      setIsLoading(false)
    }

    checkAuth()

    // Apply font
    const applyFont = () => {
      document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }

    applyFont()
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <FontStyle />
        <div className="animated">Cargando...</div>
      </div>
    )
  }

  return (
    <Router>
      <FontStyle />
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/signin"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register onRegister={() => setIsLoggedIn(true)} />}
            />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/codechallenges" element={isLoggedIn ? <CodeChallenges /> : <Navigate to="/signin" />} />
            <Route path="/challenge/:id" element={isLoggedIn ? <ChallengeDetail /> : <Navigate to="/signin" />} />
            <Route
              path="/cursos"
              element={isLoggedIn ? <div>Cursos (en construcción)</div> : <Navigate to="/signin" />}
            />
            <Route path="/leaderboard" element={isLoggedIn ? <Leaderboard /> : <Navigate to="/signin" />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
            <Route
              path="/settings"
              element={isLoggedIn ? <div>Ajustes (en construcción)</div> : <Navigate to="/signin" />}
            />
            <Route path="/forgot-password" element={<div>Recuperar contraseña (en construcción)</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

