"use client"
import { SpeedInsights } from "@vercel/speed-insights/react"
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
import AdminUsers from "./pages/admin/AdminUsers"
import AdminChallenges from "./pages/admin/AdminChallenges"
import AdminAddChallenge from "./pages/admin/AdminAddChallenge"
import AdminChallengeDetail from "./pages/admin/AdminChallengeDetail"
import PrizeDetails from "./pages/prize/PrizeDetails"
import LandingPage from "./LandingPage"
import AdminInsights from "./pages/admin/AdminInsights"


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
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated when app loads
    const checkAuth = () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          setIsLoggedIn(true);
          
          // Explicitly check the role property
          setIsAdmin(parsedUser.role === "admin");
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };
  
    checkAuth();
  }, []);

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

            {/* Admin Routes */}
            <Route path="/admin/users" element={isLoggedIn && isAdmin ? <AdminUsers /> : <Navigate to="/signin" />} />
            <Route
              path="/admin/challenges"
              element={isLoggedIn && isAdmin ? <AdminChallenges /> : <Navigate to="/signin" />}
            />
            <Route
              path="/admin/challenges/add"
              element={isLoggedIn && isAdmin ? <AdminAddChallenge /> : <Navigate to="/signin" />}
            />
            <Route
              path="/admin/challenges/:id"
              element={isLoggedIn && isAdmin ? <AdminChallengeDetail /> : <Navigate to="/signin" />}
            />
            <Route
              path="/admin"
              element={isLoggedIn && isAdmin ? <Navigate to="/admin/challenges" /> : <Navigate to="/signin" />}
            />
            <Route
              path="/admin/insights"
              element={isLoggedIn && isAdmin ? <AdminInsights /> : <Navigate to="/signin" />}
            />
            <Route
              path="/admin/settings"
              element={isLoggedIn && isAdmin ? <div>Admin Settings (en construcción)</div> : <Navigate to="/signin" />}
            />

            <Route path="/forgot-password" element={<div>Recuperar contraseña (en construcción)</div>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/prizes/details" element={<PrizeDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
