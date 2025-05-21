"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { ArrowLeftIcon, ChevronDownIcon } from "./AdminIcons"
import { createChallenge } from "../../services/admin" // Import the createChallenge function
import "./AdminAddChallenge.css"

function AdminAddChallenge() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "easy",
    tags: [],
    description: "",  // Changed from problemStatement to match backend field
    example_input: "", // Changed from inputExample to match backend field
    example_output: "", // Changed from outputExample to match backend field
    constraints: "",
    active: true
  })
  const [difficultyOpen, setDifficultyOpen] = useState(false)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form fields
    if (!formData.title || !formData.description) {
      setError("Title and Description are required")
      return
    }
    
    // Prepare the challenge data
    const challengeData = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      points: calculatePoints(formData.difficulty), // Calculate points based on difficulty
      example_input: formData.example_input,
      example_output: formData.example_output,
      constraints: formData.constraints,
      active: formData.active,
      tags: formData.tags
    }
    
    // Submit the challenge
    try {
      setIsSubmitting(true)
      setError(null)
      
      await createChallenge(challengeData)
      
      // Challenge created successfully
      alert("Challenge added successfully!")
      navigate("/admin/challenges")
    } catch (err) {
      console.error("Error creating challenge:", err)
      setError(err.message || "Failed to create challenge. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate points based on difficulty
  const calculatePoints = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return 2
      case "medium":
        return 3
      case "hard":
        return 5
      default:
        return 2
    }
  }

  const handleGoBack = () => {
    navigate("/admin/challenges")
  }

  const difficultyOptions = ["easy", "medium", "hard"]
  const tagOptions = [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Sorting",
    "Searching",
  ]

  const toggleDifficulty = () => {
    setDifficultyOpen(!difficultyOpen)
    if (tagsOpen) setTagsOpen(false)
  }

  const toggleTags = () => {
    setTagsOpen(!tagsOpen)
    if (difficultyOpen) setDifficultyOpen(false)
  }

  const selectDifficulty = (difficulty) => {
    setFormData({
      ...formData,
      difficulty,
    })
    setDifficultyOpen(false)
  }

  const toggleTag = (tag) => {
    const newTags = formData.tags.includes(tag) ? formData.tags.filter((t) => t !== tag) : [...formData.tags, tag]

    setFormData({
      ...formData,
      tags: newTags,
    })
  }

  return (
    <AdminLayout>
      <div className="add-challenge-container">
        {error && (
          <div className="error-message" style={{ marginBottom: "1rem", color: "red", backgroundColor: "#ffebee", padding: "0.75rem", borderRadius: "0.5rem" }}>
            {error}
          </div>
        )}
        
        <div className="add-challenge-header">
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeftIcon />
          </button>

          <div className="challenge-form-controls">
            <div className="title-input-container">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Challenge Title"
                className="title-input"
              />
            </div>

            <div className="dropdown-controls">
              <div className="dropdown-container">
                <button className="dropdown-button difficulty-dropdown" onClick={toggleDifficulty} type="button">
                  <span>Difficulty: {formData.difficulty}</span>
                  <ChevronDownIcon className={difficultyOpen ? "rotate" : ""} />
                </button>
                {difficultyOpen && (
                  <div className="dropdown-menu">
                    {difficultyOptions.map((option) => (
                      <div
                        key={option}
                        className={`dropdown-item ${formData.difficulty === option ? "selected" : ""}`}
                        onClick={() => selectDifficulty(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-container">
                <button className="dropdown-button tags-dropdown" onClick={toggleTags} type="button">
                  <span>Tags: {formData.tags.length > 0 ? `(${formData.tags.length} selected)` : "None"}</span>
                  <ChevronDownIcon className={tagsOpen ? "rotate" : ""} />
                </button>
                {tagsOpen && (
                  <div className="dropdown-menu">
                    {tagOptions.map((tag) => (
                      <div
                        key={tag}
                        className={`dropdown-item ${formData.tags.includes(tag) ? "selected" : ""}`}
                        onClick={() => toggleTag(tag)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tags.includes(tag)}
                          onChange={() => {}}
                          className="tag-checkbox"
                        />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        <div className="challenge-form-content">
          <div className="form-section">
            <h3 className="section-title">Problem Description</h3>
            <textarea
              name="description"  // Changed from problemStatement to match our state
              value={formData.description}
              onChange={handleChange}
              className="problem-statement-input"
              placeholder="Enter the problem statement here..."
            ></textarea>
          </div>

          <div className="examples-container">
            <div className="form-section half-width">
              <h3 className="section-title">Input Example</h3>
              <textarea
                name="example_input"  // Changed from inputExample to match our state
                value={formData.example_input}
                onChange={handleChange}
                className="example-input"
                placeholder="Enter input example here..."
              ></textarea>
            </div>

            <div className="form-section half-width">
              <h3 className="section-title">Output Example</h3>
              <textarea
                name="example_output"  // Changed from outputExample to match our state
                value={formData.example_output}
                onChange={handleChange}
                className="example-input"
                placeholder="Enter output example here..."
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Constraints</h3>
            <textarea
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              className="constraints-input"
              placeholder="Enter constraints here..."
            ></textarea>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminAddChallenge