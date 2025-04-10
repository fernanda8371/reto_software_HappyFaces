"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"
import {
  RefreshIcon,
  SettingsIcon,
  ExpandIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChipIcon,
} from "./ChallengeIcons"
import { fetchChallengeById, submitSolution } from "../../services/challenges"
import "./ChallengeDetail.css"

function ChallengeDetail() {
  const [activeTab, setActiveTab] = useState("code")
  const [language, setLanguage] = useState("C++")
  const [code, setCode] = useState(`#include <bits/stdc++.h>

Pair<int, int> FirstAndLastPosition(Vector<int>& Arr, int N, int K)
{
// Write Your Code Here
}
`)
  const [rightTab, setRightTab] = useState("examples")
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams() // Get the challenge ID from URL

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true)
        const data = await fetchChallengeById(id)
        setChallenge(data)

        // If there are previous submissions, show the most recent one
        if (data.submissions && data.submissions.length > 0) {
          const latestSubmission = data.submissions[0]
          setCode(latestSubmission.code_content)
        }

        setError(null)
      } catch (err) {
        setError("Failed to load challenge. Please try again later.")
        console.error("Error loading challenge:", err)
      } finally {
        setLoading(false)
      }
    }

    loadChallenge()
  }, [id])

  // Function to go back to challenges list
  const goBackToChallenges = () => {
    navigate("/codechallenges")
  }

  // Function to handle code submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const result = await submitSolution(id, code, language)
      setTestResults(result.testResults)
      setActiveTab("result") // Switch to results tab

      // Refresh challenge data to get updated submissions
      const updatedChallenge = await fetchChallengeById(id)
      setChallenge(updatedChallenge)
    } catch (err) {
      setError("Failed to submit solution. Please try again.")
      console.error("Error submitting solution:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Line numbers for code editor
  const lineNumbers = Array.from({ length: code.split("\n").length }, (_, i) => i + 1)

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "code":
        return (
          <>
            {/* Problem Description */}
            <div className="problem-description">
              <div className="description-content">{challenge?.description || "Loading challenge description..."}</div>

              {/* Example Input/Output
              {(challenge?.example_input || challenge?.example_output) && (
                <div className="examples-section">
                  <h3 className="examples-title">Examples</h3>

                  {challenge.example_input && (
                    <div className="example-block">
                      <h4 className="example-label">Input:</h4>
                      <pre className="example-content">{challenge.example_input}</pre>
                    </div>
                  )}

                  {challenge.example_output && (
                    <div className="example-block">
                      <h4 className="example-label">Output:</h4>
                      <pre className="example-content">{challenge.example_output}</pre>
                    </div>
                  )}
                </div>
              )} */}

              {/* Constraints */}
              {challenge?.constraints && (
                <div className="constraints-section">
                  <h3 className="constraints-title">Constraints</h3>
                  <div className="constraints-content">{challenge.constraints}</div>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="code-editor-container">
              <div className="editor-header">
                <div className="language-selector">
                  <span>{language}</span>
                  <button className="refresh-button">
                    <RefreshIcon />
                  </button>
                </div>
                <div className="editor-controls">
                  <button className="control-button">
                    <SettingsIcon />
                  </button>
                  <button className="control-button">
                    <ExpandIcon />
                  </button>
                </div>
              </div>

              <div className="code-editor">
                <div className="line-numbers">
                  {lineNumbers.map((num) => (
                    <div key={num} className="line-number">
                      {num}
                    </div>
                  ))}
                </div>
                <textarea
                  className="code-textarea"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                />
              </div>

              <div className="editor-footer">
                <button className="submit-button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Solución"}
                </button>
              </div>
            </div>
          </>
        )
      case "result":
        return (
          <div className="result-container">
            {testResults ? (
              <>
                <div className="result-header">
                  <div className="result-status">
                    <div className="status-badge success">
                      <CheckCircleIcon />
                      <span>{testResults.status}</span>
                    </div>
                    <div className="result-metrics">
                      <div className="metric">
                        <ClockIcon />
                        <span>Runtime: {testResults.runtime}</span>
                      </div>
                      <div className="metric">
                        <ChipIcon />
                        <span>Memory: {testResults.memory}</span>
                      </div>
                    </div>
                  </div>
                  <div className="result-actions">
                    <button className="result-action-button" onClick={() => setActiveTab("code")}>
                      Editar Solución
                    </button>
                    <button className="result-action-button" onClick={handleSubmit}>
                      Enviar de Nuevo
                    </button>
                  </div>
                </div>

                <div className="test-cases">
                  <h3 className="test-cases-title">Casos de Prueba</h3>
                  <div className="test-cases-list">
                    {testResults.testCases.map((testCase) => (
                      <div key={testCase.id} className="test-case">
                        <div className="test-case-header">
                          <div className="test-case-status">
                            {testCase.passed ? (
                              <CheckCircleIcon className="icon-success" />
                            ) : (
                              <XCircleIcon className="icon-error" />
                            )}
                            <span>Caso de Prueba {testCase.id}</span>
                          </div>
                        </div>
                        <div className="test-case-details">
                          <div className="test-case-row">
                            <div className="test-case-label">Input:</div>
                            <div className="test-case-value">{testCase.input}</div>
                          </div>
                          <div className="test-case-row">
                            <div className="test-case-label">Output:</div>
                            <div className="test-case-value">{testCase.output}</div>
                          </div>
                          <div className="test-case-row">
                            <div className="test-case-label">Expected:</div>
                            <div className="test-case-value">{testCase.expected}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>No hay resultados disponibles. Por favor, envía tu solución primero.</p>
                <button className="back-to-code-button" onClick={() => setActiveTab("code")}>
                  Volver al Editor
                </button>
              </div>
            )}
          </div>
        )
      case "chat":
        return (
          <div className="chat-container">
            <div className="chat-messages">
              <div className="chat-message-empty">
                <p>Pregunta al asistente sobre este problema</p>
              </div>
            </div>
            <div className="chat-input-container">
              <input type="text" className="chat-input" placeholder="Escribe tu pregunta aquí..." />
              <button className="chat-send-button">Enviar</button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="challenge-loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando desafío...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="challenge-error-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={goBackToChallenges}>
          Volver a Desafíos
        </button>
      </div>
    )
  }

  return (
    <div className="challenge-detail-container">
      {/* Header */}
      <div className="challenge-header">
        <div className="logo-section">
          <div className="logo" onClick={goBackToChallenges}>
          <Link to="/dashboard" className="logo-link">
          <img src="/images/logo.png" alt="Happy Faces Logo" className="sidebar-logo-image" />
        </Link>
          </div>
        </div>

        <div className="challenge-info">
          <h1 className="challenge-title">{challenge?.title || "Loading..."}</h1>
          <p className="challenge-timestamp">
            Dificultad:{" "}
            {challenge?.difficulty
              ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)
              : "Loading..."}
            {challenge?.points && ` • ${challenge.points} puntos`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="challenge-content">
        {/* Left Sidebar */}
        <div className="challenge-sidebar">
          <div className={`sidebar-tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
            Código
          </div>
          <div className={`sidebar-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
            Ask Chat
            <span className="chat-indicator"></span>
          </div>
          <div
            className={`sidebar-tab ${activeTab === "result" ? "active" : ""}`}
            onClick={() => setActiveTab("result")}
          >
            Resultado
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="challenge-editor-area">{renderContent()}</div>

        {/* Right Panel */}
        <div className="challenge-right-panel">
          <div className="right-panel-header">
            <h3>Log</h3>
          </div>

          <div className="right-panel-tabs">
            <div
              className={`panel-tab ${rightTab === "examples" ? "active" : ""}`}
              onClick={() => setRightTab("examples")}
            >
              Ejemplos
            </div>
            <div
              className={`panel-tab ${rightTab === "history" ? "active" : ""}`}
              onClick={() => setRightTab("history")}
            >
              Historial
            </div>
          </div>

          <div className="right-panel-content">
            {rightTab === "history" ? (
              <div className="submission-history">
                {challenge?.submissions && challenge.submissions.length > 0 ? (
                  <div className="submissions-list">
                    {challenge.submissions.map((submission, index) => (
                      <div
                        key={index}
                        className="submission-item"
                        onClick={() => {
                          setCode(submission.code_content)
                          setActiveTab("code")
                        }}
                      >
                        <div className={`submission-status ${submission.status}`}>
                          {submission.status === "correct" ? "✓" : "✗"}
                        </div>
                        <div className="submission-info">
                          <div className="submission-date">{new Date(submission.created_at).toLocaleString()}</div>
                          <div className="submission-status-text">
                            {submission.status === "correct" ? "Aceptado" : "Incorrecto"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-submissions">Aún No Has Enviado Este Problema</div>
                )}
              </div>
            ) : (
              <div className="examples-panel">
                {challenge?.example_input && (
                  <div className="example-item">
                    <h4>Input:</h4>
                    <pre>{challenge.example_input}</pre>
                  </div>
                )}
                {challenge?.example_output && (
                  <div className="example-item">
                    <h4>Output:</h4>
                    <pre>{challenge.example_output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeDetail
