"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircleIcon, XCircleIcon, SearchIcon, UserPlusIcon, XIcon, UsersIcon } from "./ChallengeIcons"
import { fetchChallengeById, submitSolution } from "../../services/challenges"
import { fetchUsers, submitTeamSolution } from "../../services/teamService"
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

  // Team submission modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isTeamSubmission, setIsTeamSubmission] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeammates, setSelectedTeammates] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [submissionNotes, setSubmissionNotes] = useState("")
  const modalRef = useRef(null)

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

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSubmitModal(false)
      }
    }

    // Add event listener when modal is shown
    if (showSubmitModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSubmitModal])

  // Handle search for teammates
  useEffect(() => {
    if (searchTerm.length > 0 && isTeamSubmission) {
      setIsSearching(true)

      // Debounce search
      const timeoutId = setTimeout(async () => {
        try {
          // In a real app, you would fetch users from your backend
          const users = await fetchUsers()
          const results = users.filter(
            (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          setSearchResults(results)
        } catch (err) {
          console.error("Error searching for users:", err)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, isTeamSubmission])

  // Function to go back to challenges list
  const goBackToChallenges = () => {
    navigate("/codechallenges")
  }

  // Function to open the submit modal
  const openSubmitModal = () => {
    setShowSubmitModal(true)
  }

  // Function to handle code submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const result = await submitSolution(id, code, language)
      setTestResults(result.testResults)
      setActiveTab("result") // Switch to results tab

      // Refresh challenge data to get updated submissions
      // Within handleSubmit, after receiving successful response
      if (result.testResults.status === "Aceptado") {
        // Only update if the challenge wasn't completed before
        if (challenge.status !== "completed") {
          // Get the current user from localStorage
          const user = JSON.parse(localStorage.getItem("user"))
          if (user) {
            // Update the score
            user.total_score = (user.total_score || 0) + challenge.points
            // Save back to localStorage
            localStorage.setItem("user", JSON.stringify(user))
          }
        }
      }
      const updatedChallenge = await fetchChallengeById(id)
      setChallenge(updatedChallenge)
    } catch (err) {
      setError("Failed to submit solution. Please try again.")
      console.error("Error submitting solution:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle final submission with team info if applicable
  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true)

      if (isTeamSubmission && selectedTeammates.length > 0) {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"))

        // Submit as team solution
        await submitTeamSolution({
          challengeId: id,
          userId: currentUser?.id,
          code,
          language,
          teammates: selectedTeammates,
          notes: submissionNotes,
        })
      }

      // Always submit the regular solution too
      const result = await submitSolution(id, code, language)
      setTestResults(result.testResults)
      setActiveTab("result")

      // Close modal
      setShowSubmitModal(false)

      // Update challenge data
      if (result.testResults.status === "Aceptado") {
        if (challenge.status !== "completed") {
          const user = JSON.parse(localStorage.getItem("user"))
          if (user) {
            user.total_score = (user.total_score || 0) + challenge.points
            localStorage.setItem("user", JSON.stringify(user))
          }
        }
      }

      const updatedChallenge = await fetchChallengeById(id)
      setChallenge(updatedChallenge)
    } catch (err) {
      setError("Failed to submit solution. Please try again.")
      console.error("Error submitting solution:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Add teammate to selected list
  const addTeammate = (user) => {
    if (!selectedTeammates.some((teammate) => teammate.id === user.id)) {
      setSelectedTeammates([...selectedTeammates, user])
    }
    setSearchTerm("")
    setSearchResults([])
  }

  // Remove teammate from selected list
  const removeTeammate = (userId) => {
    setSelectedTeammates(selectedTeammates.filter((teammate) => teammate.id !== userId))
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
                <div className="editor-controls">{/* Controls can be added here if needed */}</div>
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
                <button className="submit-button" onClick={openSubmitModal} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Solution"}
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
                    <div className={`status-badge ${testResults.status === "Aceptado" ? "success" : "error"}`}>
                      {testResults.status === "Aceptado" ? <CheckCircleIcon /> : <XCircleIcon />}
                      <span>{testResults.status}</span>
                    </div>
                  </div>
                  <div className="result-actions">
                    <button className="result-action-button" onClick={() => setActiveTab("code")}>
                      Edit Solution
                    </button>
                    <button className="result-action-button" onClick={openSubmitModal}>
                      Submit Again
                    </button>
                  </div>
                </div>

                {/* Gemini Detailed Analysis */}
                <div className="gemini-analysis">
                  <h3 className="test-cases-title">AI analysis</h3>
                  <div className="gemini-analysis-details">
                    <div className="analysis-section">
                      <h4>Result</h4>
                      <p>{testResults.status}</p>
                    </div>

                    <div className="analysis-section">
                      <h4>Time Complexity</h4>
                      <p>{testResults.timeComplexity}</p>
                    </div>

                    <div className="analysis-section">
                      <h4>Space Complexity</h4>
                      <p>{testResults.spaceComplexity}</p>
                    </div>

                    <div className="analysis-section">
                      <h4>Feedback</h4>
                      <p>{testResults.feedback}</p>
                    </div>

                    <div className="analysis-section">
                      <h4>Improvement Suggestions</h4>
                      <p>{testResults.suggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Test Cases */}
                <div className="test-cases">
                  <h3 className="test-cases-title">Test Cases</h3>
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
                            <span>Test Case {testCase.id}</span>
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
                <p>No results available. Please submit your solution first.</p>
                <button className="back-to-code-button" onClick={() => setActiveTab("code")}>
                  Back to Editor
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
                <p>Ask the assistant about this problem</p>
              </div>
            </div>
            <div className="chat-input-container">
              <input type="text" className="chat-input" placeholder="Type your question here..." />
              <button className="chat-send-button">Send</button>
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
        <p>Loading challenge...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="challenge-error-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={goBackToChallenges}>
          Back to Challenges
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
            Difficulty:{" "}
            {challenge?.difficulty
              ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)
              : "Loading..."}
            {challenge?.points && ` • ${challenge.points} points`}
          </p>
        </div>

        {/* Return button (now on the right) */}
        <button onClick={goBackToChallenges} className="back-to-challenges-button">
          Challenges &rarr;
        </button>
      </div>

      {/* Main Content */}
      <div className="challenge-content">
        {/* Left Sidebar */}
        <div className="challenge-sidebar">
          <div className={`sidebar-tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
            Code
          </div>
          {/*<div className={`sidebar-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
            Ask Chat
            <span className="chat-indicator"></span>
          </div>*/}
          <div
            className={`sidebar-tab ${activeTab === "result" ? "active" : ""}`}
            onClick={() => setActiveTab("result")}
          >
            Result
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
              Examples
            </div>
            <div
              className={`panel-tab ${rightTab === "history" ? "active" : ""}`}
              onClick={() => setRightTab("history")}
            >
              History
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
                            {submission.status === "correct" ? "Accepted" : "Incorrect"}
                            {submission.isTeamSubmission && (
                              <span className="team-badge">
                                <UsersIcon /> Team
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-submissions">You Haven't Submitted This Problem Yet</div>
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

      {/* Submit Solution Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="submit-modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Submit Solution</h2>
              <button className="close-button" onClick={() => setShowSubmitModal(false)}>
                <XIcon />
              </button>
            </div>

            <div className="modal-content">
              <div className="submission-type">
                <h3>Submission Type</h3>
                <div className="submission-options">
                  <label className="submission-option">
                    <input
                      type="radio"
                      name="submissionType"
                      checked={!isTeamSubmission}
                      onChange={() => setIsTeamSubmission(false)}
                    />
                    <span className="option-label">Individual</span>
                    <span className="option-description">I'm solving this problem on my own</span>
                  </label>

                  <label className="submission-option">
                    <input
                      type="radio"
                      name="submissionType"
                      checked={isTeamSubmission}
                      onChange={() => setIsTeamSubmission(true)}
                    />
                    <span className="option-label">Team</span>
                    <span className="option-description">I'm collaborating with other users</span>
                  </label>
                </div>
              </div>

              {isTeamSubmission && (
                <div className="team-selection">
                  <h3>Team Members</h3>

                  <div className="search-teammates">
                    <div className="search-input-container">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search teammates by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>

                    {isSearching && <div className="search-loading">Searching...</div>}

                    {searchResults.length > 0 && (
                      <div className="search-results">
                        {searchResults.map((user) => (
                          <div key={user.id} className="search-result-item" onClick={() => addTeammate(user)}>
                            <img
                              src={user.avatar || "/placeholder.svg?height=32&width=32"}
                              alt={user.name}
                              className="user-avatar"
                            />
                            <span className="user-name">{user.name}</span>
                            <UserPlusIcon className="add-icon" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedTeammates.length > 0 && (
                    <div className="selected-teammates">
                      <h4>Selected Teammates</h4>
                      <div className="teammates-list">
                        {selectedTeammates.map((teammate) => (
                          <div key={teammate.id} className="teammate-item">
                            <img
                              src={teammate.avatar || "/placeholder.svg?height=32&width=32"}
                              alt={teammate.name}
                              className="user-avatar"
                            />
                            <span className="user-name">{teammate.name}</span>
                            <button
                              className="remove-teammate"
                              onClick={() => removeTeammate(teammate.id)}
                              aria-label={`Remove ${teammate.name}`}
                            >
                              <XIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="submission-notes">
                <h3>Submission Notes (Optional)</h3>
                <textarea
                  placeholder="Add notes about your solution, approach, or any details you want to share..."
                  className="notes-textarea"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </button>
              <button
                className="submit-final-button"
                onClick={handleFinalSubmit}
                disabled={submitting || (isTeamSubmission && selectedTeammates.length === 0)}
              >
                {submitting ? "Submitting..." : "Confirm Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChallengeDetail
