"use client"
import { useNavigate, Link } from "react-router-dom"
import "./NotFound.css"

function NotFound() {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="not-found-page">
      {/* Header */}
      <header className="not-found-header">
        <div className="container header-container">
          <Link to="/" className="sidebar-header">
            <img src="/images/logo.png" alt="Logo" className="logo-image" />
          </Link>

          <div className="auth-buttons">

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="not-found-main">
        <div className="not-found-container">
          <div className="warning-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32 5.33334L60 56H4L32 5.33334Z"
                stroke="#E74C3C"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#E74C3C"
              />
              <path d="M32 40V24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 48V48.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="not-found-title">Page not found</h1>

          <p className="not-found-subtitle">There's nothing here. Are you sure you're in the right place?</p>

          <div className="not-found-buttons">
            <button onClick={goBack} className="btn btn-primary btn-lg">
              Go Back
            </button>
            <Link to="/" className="btn btn-outline btn-lg">
              Return Home
            </Link>
          </div>
        </div>
      </main>

      {/* Error Notification */}
      <div className="error-notification">
        <div className="error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path d="M12 8V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 16V16.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span>1 error</span>
        <button className="close-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default NotFound