"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { ArrowLeftIcon, ChevronDownIcon } from "./AdminIcons"
import "./AdminAddChallenge.css"

function AdminAddChallenge() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "fácil",
    tags: [],
    problemStatement: "",
    inputExample: "",
    outputExample: "",
    constraints: "",
  })
  const [difficultyOpen, setDifficultyOpen] = useState(false)
  const [tagsOpen, setTagsOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    alert("Challenge added successfully!")
    navigate("/admin/challenges")
  }

  const handleGoBack = () => {
    navigate("/admin/challenges")
  }

  const difficultyOptions = ["fácil", "regular", "difícil"]
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
                <button className="dropdown-button difficulty-dropdown" onClick={toggleDifficulty}>
                  <span>Dificultad</span>
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
                <button className="dropdown-button tags-dropdown" onClick={toggleTags}>
                  <span>Tags</span>
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

              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="challenge-form-content">
          <div className="form-section">
            <h3 className="section-title">Problem Statement</h3>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              className="problem-statement-input"
              placeholder="Enter the problem statement here..."
            ></textarea>
          </div>

          <div className="examples-container">
            <div className="form-section half-width">
              <h3 className="section-title">Input Example</h3>
              <textarea
                name="inputExample"
                value={formData.inputExample}
                onChange={handleChange}
                className="example-input"
                placeholder="Enter input example here..."
              ></textarea>
            </div>

            <div className="form-section half-width">
              <h3 className="section-title">Output Example</h3>
              <textarea
                name="outputExample"
                value={formData.outputExample}
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

