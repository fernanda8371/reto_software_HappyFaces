// "use client"

// import { useState, useEffect } from "react"
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
// import PrivateRoute from "./components/PrivateRoute";

// import "./App.css"
// import "./LandingPage.css"

// // Import pages
// import SignIn from "./pages/signin/signin"
// import Register from "./pages/register/register"
// import NotFound from "./pages/error/NotFound"
// import Dashboard from "./pages/dashboard/Dashboard"
// import Leaderboard from "./pages/leaderboard/Leaderboard"
// import CodeChallenges from "./pages/codechallenges/CodeChallenges"
// import ChallengeDetail from "./pages/challenge/ChallengeDetail"
// import Profile from "./pages/profile/Profile"
// import AdminUsers from "./pages/admin/AdminUsers"
// import AdminChallenges from "./pages/admin/AdminChallenges"
// import AdminAddChallenge from "./pages/admin/AdminAddChallenge"
// import AdminChallengeDetail from "./pages/admin/AdminChallengeDetail"
// import PrizeDetails from "./pages/prize/PrizeDetails"
// import AdminInsights from "./pages/admin/AdminInsights"

// import LandingPage from "./LandingPage"

// // Font style
// const FontStyle = () => (
//   <style jsx global>{`
// * {
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
// }
// `}</style>
// )

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Check if user is authenticated when app loads
//     const checkAuth = () => {
//       const user = localStorage.getItem("user")
//       if (user) {
//         setIsLoggedIn(true)
//         // In a real app, you would check if the user has admin role
//         // For now, we'll just set isAdmin to true for demonstration
//         setIsAdmin(true)
//       } else {
//         setIsLoggedIn(false)
//         setIsAdmin(false)
//       }
//       setIsLoading(false)
//     }

//     checkAuth()

//     // Apply font
//     const applyFont = () => {
//       document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
//     }

//     applyFont()
//   }, [])

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <FontStyle />
//         <div className="animated">Cargando...</div>
//       </div>
//     )
//   }

//   return (
//     <Router>
//       <FontStyle />
//       <div className="App">
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route
//               path="/signin"
//               element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn onLogin={() => setIsLoggedIn(true)} />}
//             />
//             <Route
//               path="/register"
//               element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register onRegister={() => setIsLoggedIn(true)} />}
//             />
//             <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
//             <Route path="/codechallenges" element={isLoggedIn ? <CodeChallenges /> : <Navigate to="/signin" />} />
//             <Route path="/challenge/:id" element={isLoggedIn ? <ChallengeDetail /> : <Navigate to="/signin" />} />
//             <Route
//               path="/cursos"
//               element={isLoggedIn ? <div>Cursos (en construcción)</div> : <Navigate to="/signin" />}
//             />
//             <Route path="/leaderboard" element={isLoggedIn ? <Leaderboard /> : <Navigate to="/signin" />} />
//             <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
//             <Route
//               path="/settings"
//               element={isLoggedIn ? <div>Ajustes (en construcción)</div> : <Navigate to="/signin" />}
//             />

//             {/* Admin Routes */}
//             <Route path="/admin/users" element={isLoggedIn && isAdmin ? <AdminUsers /> : <Navigate to="/signin" />} />
//             <Route
//               path="/admin/challenges"
//               element={isLoggedIn && isAdmin ? <AdminChallenges /> : <Navigate to="/signin" />}
//             />
//             <Route
//               path="/admin/challenges/add"
//               element={isLoggedIn && isAdmin ? <AdminAddChallenge /> : <Navigate to="/signin" />}
//             />
//             <Route
//               path="/admin/challenges/:id"
//               element={isLoggedIn && isAdmin ? <AdminChallengeDetail /> : <Navigate to="/signin" />}
//             />
//             <Route
//               path="/admin"
//               element={isLoggedIn && isAdmin ? <Navigate to="/admin/challenges" /> : <Navigate to="/signin" />}
//             />
//             <Route
//               path="/admin/settings"
//               element={isLoggedIn && isAdmin ? <div>Admin Settings (en construcción)</div> : <Navigate to="/signin" />}
//             />
//             <Route
//               path="/admin/insights"
//               element={isLoggedIn && isAdmin ? <AdminInsights /> : <Navigate to="/signin" />}
//             />

//             <Route path="/forgot-password" element={<div>Recuperar contraseña (en construcción)</div>} />
//             <Route path="*" element={<NotFound />} />
//             <Route path="/prizes/details" element={<PrizeDetails />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   )
// }

// export default App

"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"

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
import AdminInsights from "./pages/admin/AdminInsights"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Apply font
    const applyFont = () => {
      document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }
    applyFont()
    setIsLoading(false)
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
            {/* Rutas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/codechallenges"
              element={
                <PrivateRoute>
                  <CodeChallenges />
                </PrivateRoute>
              }
            />
            <Route
              path="/challenge/:id"
              element={
                <PrivateRoute>
                  <ChallengeDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <div>Ajustes (en construcción)</div>
                </PrivateRoute>
              }
            />

            {/* Rutas de administrador */}
            <Route
              path="/admin/users"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/challenges"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminChallenges />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/challenges/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminAddChallenge />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/challenges/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminChallengeDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminInsights />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <Navigate to="/admin/challenges" />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <PrivateRoute adminOnly={true}>
                  <div>Admin Settings (en construcción)</div>
                </PrivateRoute>
              }
            />

            {/* Otras rutas */}
            <Route path="/forgot-password" element={<div>Recuperar contraseña (en construcción)</div>} />
            <Route path="/prizes/details" element={<PrizeDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App