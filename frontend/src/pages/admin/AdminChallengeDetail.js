"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { EyeIcon, ArrowLeftIcon } from "./AdminIcons"
import { getChallengeById, getSubmissionsForChallenge } from "../../services/admin"
import "./AdminChallengeDetail.css"

function AdminChallengeDetail() {
  const [activeTab, setActiveTab] = useState("results")
  const [challenge, setChallenge] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  // Agregamos logs para diagnóstico
  console.log("AdminChallengeDetail - ID del challenge:", id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch challenge details
        console.log(`Fetching challenge with ID: ${id}`);
        
        // Importante: Obtén el token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No authentication token found');
          // Puedes decidir si quieres lanzar un error o continuar
        }
        
        const challengeData = await getChallengeById(id);
        console.log("Challenge data received:", challengeData);
        setChallenge(challengeData);
        
        // Fetch submissions for this challenge
        try {
          console.log(`Fetching submissions for challenge ID: ${id}`);
          const submissionsData = await getSubmissionsForChallenge(id);
          console.log("Submissions data received:", submissionsData);
          setSubmissions(submissionsData || []);
        } catch (submissionError) {
          console.error("Error fetching submissions:", submissionError);
          // Don't set main error, just log it
          // We'll still show the challenge details even if submissions fail
          setSubmissions([]);
        }
        
      } catch (err) {
        console.error("Error fetching challenge data:", err);
        setError("Failed to load challenge data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleViewSubmission = (submissionId) => {
    setSubmissions(submissions.map((sub) => 
      (sub.submission_id === submissionId ? { ...sub, showCode: !sub.showCode } : sub)
    ));
  }

  const handleGoBack = () => {
    navigate("/admin/challenges");
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="challenge-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading challenge details...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-challenge-detail-container">
          <div className="challenge-detail-header">
            <button className="back-button" onClick={handleGoBack} aria-label="Back to challenges list">
              <ArrowLeftIcon />
              <span className="back-button-text">Back</span>
            </button>
          </div>
          <div className="error-message">
            {error}
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
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
            <h1 className="challenge-detail-title">{challenge?.title || "Untitled Challenge"}</h1>
            <p className="challenge-detail-timestamp">
              Created: {challenge?.created_at ? new Date(challenge.created_at).toLocaleString() : 'Unknown date'}
              {challenge?.creator_name && ` by ${challenge.creator_name}`}
            </p>
          </div>
        </div>

        <div className="challenge-detail-content">
          <div className="challenge-detail-sidebar">
            <div
              className={`sidebar-tab ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              Challenge
            </div>
            <div
              className={`sidebar-tab ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
            >
              Submissions
            </div>
          </div>

          <div className="challenge-detail-main">
            {activeTab === "code" ? (
              <div className="challenge-code-section">
                <div className="problem-statement">
                  <h3>Description</h3>
                  {challenge?.description ? (
                    challenge.description.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))
                  ) : (
                    <p>No description available</p>
                  )}
                  
                  {challenge?.example_input && (
                    <div className="example-section">
                      <h3>Example Input</h3>
                      <pre>{challenge.example_input}</pre>
                    </div>
                  )}
                  
                  {challenge?.example_output && (
                    <div className="example-section">
                      <h3>Example Output</h3>
                      <pre>{challenge.example_output}</pre>
                    </div>
                  )}
                  
                  {challenge?.constraints && (
                    <div className="constraints-section">
                      <h3>Constraints</h3>
                      <pre>{challenge.constraints}</pre>
                    </div>
                  )}
                  
                  <div className="challenge-metadata">
                    <p><strong>Difficulty:</strong> {challenge?.difficulty || "Unknown"}</p>
                    <p><strong>Points:</strong> {challenge?.points || "0"}</p>
                    <p><strong>Status:</strong> {challenge?.active ? "Active" : "Inactive"}</p>
                    
                    {challenge?.tags && challenge.tags.length > 0 && (
                      <div>
                        <strong>Tags:</strong>{" "}
                        {challenge.tags.map(tag => tag.name).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="challenge-results-section">
                <div className="problem-statement">
                  <h3>Challenge: {challenge?.title || "Unknown Challenge"}</h3>
                  <p><strong>Difficulty:</strong> {challenge?.difficulty || "Unknown"}</p>
                  <p><strong>Points:</strong> {challenge?.points || "0"}</p>
                </div>

                {submissions && submissions.length > 0 ? (
                  <div className="submissions-table-container">
                    <table className="submissions-table">
                      <thead>
                        <tr>
                          <th className="rank-column">#</th>
                          <th className="username-column">Username</th>
                          <th className="userid-column">User ID</th>
                          <th className="score-column">Status</th>
                          <th className="team-column">Date</th>
                          <th className="actions-column"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((submission, index) => (
                          <React.Fragment key={submission.submission_id || index}>
                            <tr className="submission-row">
                              <td className="rank-column">{index + 1}</td>
                              <td className="username-column">{submission.username || "Unknown"}</td>
                              <td className="userid-column">{submission.user_id}</td>
                              <td className="score-column">
                                <span className={`status-badge ${submission.status}`}>
                                  {submission.status}
                                </span>
                              </td>
                              <td className="team-column">
                                {submission.created_at ? new Date(submission.created_at).toLocaleString() : "Unknown"}
                              </td>
                              <td className="actions-column">
                                <button
                                  className="view-button"
                                  onClick={() => handleViewSubmission(submission.submission_id)}
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
                                      <code>{submission.code_content}</code>
                                    </pre>
                                    
                                    {submission.feedback && (
                                      <div className="feedback-container">
                                        <h4>Feedback</h4>
                                        <p>{submission.feedback}</p>
                                      </div>
                                    )}
                                    
                                    {submission.time_complexity && (
                                      <div className="complexity">
                                        <span><strong>Time Complexity:</strong> {submission.time_complexity}</span>
                                        {submission.space_complexity && (
                                          <span><strong>Space Complexity:</strong> {submission.space_complexity}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-submissions">
                    <p>No submissions found for this challenge.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminChallengeDetail