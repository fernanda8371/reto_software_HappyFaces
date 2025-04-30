"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { EyeIcon } from "./AdminIcons"
import "./AdminChallengeDetail.css"
import { ArrowLeftIcon } from "./AdminIcons"

function AdminChallengeDetail() {
  const [activeTab, setActiveTab] = useState("results")
  const [challenge, setChallenge] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    // Simulate fetching challenge data
    const fetchChallengeData = () => {
      setIsLoading(true)

      // Mock challenge data - in a real app, this would be an API call
      const mockChallenge = {
        id: Number.parseInt(id),
        title: "Longest Common Substring",
        startedAt: "Today 4:12 PM",
        description: `1. You Have Been Given A Sorted Array/List ARR That Contains 'N' Elements. You Are Also Given An Integer 'K'.
Your Task Is To Find The First And Last Occurrence Of 'K' In ARR.
Notes:
a. If 'K' Is Not Present In The Array, The First And Last Occurrence Should Be -1.
b. The ARR Array May Contain Duplicate Elements.
Example:
. If ARR = [0, 1, 1, 5] And K = 1, Then The First And Last Occurrence Of 1 Will Be At Indices 1 And 2 (Based On 0-Index).`,
        problemStatement: `1. You Have Been Given A Sorted Array/List ARR That Contains 'N' Elements. You Are Also Given An Integer 'K'.
Your Task Is To Find The First And Last Occurrence Of 'K' In ARR.
Notes:
a. If 'K' Is Not Present In The Array, The First And Last Occurrence Should Be -1.
b. The ARR Array May Contain Duplicate Elements.
Example:
. If ARR = [0, 1, 1, 5] And K = 1, Then The First And Last Occurrence Of 1 Will Be At Indices 1 And 2 (Based On 0-Index).`,
      }

      // Mock submissions data
      const mockSubmissions = [
        {
          id: 1,
          username: "daniela_caiceros",
          userId: "user123",
          score: 95,
          team: "Team Alpha",
          submittedAt: "2025-04-01T15:30:00",
          code: `function findFirstAndLast(arr, k) {
  let first = -1, last = -1;
  
  // Find first occurrence
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === k) {
      first = i;
      break;
    }
  }
  
  // If element not found
  if (first === -1) return [first, last];
  
  // Find last occurrence
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === k) {
      last = i;
      break;
    }
  }
  
  return [first, last];
}`,
        },
        {
          id: 2,
          username: "renee_ramos",
          userId: "user456",
          score: 87,
          team: "Team Beta",
          submittedAt: "2025-04-01T16:45:00",
          code: `function findFirstAndLast(arr, k) {
  const result = [-1, -1];
  
  // Binary search for first occurrence
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === k) {
      result[0] = mid;
      right = mid - 1;
    } else if (arr[mid] < k) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  // If element not found
  if (result[0] === -1) return result;
  
  // Binary search for last occurrence
  left = 0;
  right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === k) {
      result[1] = mid;
      left = mid + 1;
    } else if (arr[mid] < k) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}`,
        },
        {
          id: 3,
          username: "diego_sanchez",
          userId: "user789",
          score: 78,
          team: "Team Gamma",
          submittedAt: "2025-04-01T17:20:00",
          code: `function findFirstAndLast(arr, k) {
  const first = arr.indexOf(k);
  if (first === -1) return [-1, -1];
  
  const last = arr.lastIndexOf(k);
  return [first, last];
}`,
        },
        {
          id: 4,
          username: "maria_ramos",
          userId: "user101",
          score: 92,
          team: "Team Alpha",
          submittedAt: "2025-04-01T18:05:00",
          code: `function findFirstAndLast(arr, k) {
  // Binary search implementation
  function binarySearch(arr, x, findFirst) {
    let left = 0, right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (arr[mid] === x) {
        result = mid;
        if (findFirst) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      } else if (arr[mid] < x) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    return result;
  }
  
  const first = binarySearch(arr, k, true);
  if (first === -1) return [-1, -1];
  
  const last = binarySearch(arr, k, false);
  return [first, last];
}`,
        },
        {
          id: 5,
          username: "lorenzo_alebrije",
          userId: "user202",
          score: 85,
          team: "Team Delta",
          submittedAt: "2025-04-01T19:30:00",
          code: `function findFirstAndLast(arr, k) {
  let first = -1, last = -1;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === k) {
      if (first === -1) first = i;
      last = i;
    }
  }
  
  return [first, last];
}`,
        },
      ]

      setChallenge(mockChallenge)
      setSubmissions(mockSubmissions)
      setIsLoading(false)
    }

    fetchChallengeData()
  }, [id])

  const handleViewSubmission = (submissionId) => {
    // In a real app, this would navigate to a detailed view of the submission
    console.log(`Viewing submission ${submissionId}`)
    // For now, we'll just toggle the code visibility in the UI
    setSubmissions(submissions.map((sub) => (sub.id === submissionId ? { ...sub, showCode: !sub.showCode } : sub)))
  }

  const handleGoBack = () => {
    navigate("/admin/challenges")
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="challenge-detail-loading">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-challenge-detail-container">
        <div className="challenge-detail-header">
          <button className="back-button" onClick={handleGoBack} aria-label="Back to challenges list">
            <ArrowLeftIcon />
            <span className="back-button-text">Back</span>
          </button>
          <div className="challenge-detail-title-section">
            <h1 className="challenge-detail-title">{challenge.title}</h1>
            <p className="challenge-detail-timestamp">Started: {challenge.startedAt}</p>
          </div>
        </div>

        <div className="challenge-detail-content">
          <div className="challenge-detail-sidebar">
            <div
              className={`sidebar-tab ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              Code
            </div>
            <div
              className={`sidebar-tab ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
            >
              Results
            </div>
          </div>

          <div className="challenge-detail-main">
            {activeTab === "code" ? (
              <div className="challenge-code-section">
                <div className="problem-statement">
                  {challenge.problemStatement.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="challenge-results-section">
                <div className="problem-statement">
                  {challenge.problemStatement.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                <div className="submissions-table-container">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th className="rank-column">#</th>
                        <th className="username-column">username</th>
                        <th className="userid-column">user id</th>
                        <th className="score-column">score</th>
                        <th className="team-column">team</th>
                        <th className="actions-column"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission, index) => (
                        <React.Fragment key={submission.id}>
                          <tr className="submission-row">
                            <td className="rank-column">{index + 1}</td>
                            <td className="username-column">{submission.username}</td>
                            <td className="userid-column">{submission.userId}</td>
                            <td className="score-column">{submission.score}</td>
                            <td className="team-column">{submission.team}</td>
                            <td className="actions-column">
                              <button
                                className="view-button"
                                onClick={() => handleViewSubmission(submission.id)}
                                aria-label="View submission"
                              >
                                <EyeIcon />
                              </button>
                            </td>
                          </tr>
                          {submission.showCode && (
                            <tr className="code-row">
                              <td colSpan="6">
                                <div className="code-container">
                                  <pre className="code-block">
                                    <code>{submission.code}</code>
                                  </pre>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminChallengeDetail