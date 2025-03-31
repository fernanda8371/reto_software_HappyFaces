"use client"

import { useState } from "react"
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
  const navigate = useNavigate()
  const { id } = useParams() // Get the challenge ID from URL

  // Mock test results data
  const testResults = {
    status: "Aceptado",
    runtime: "4ms",
    memory: "7.2 MB",
    testCases: [
      { id: 1, input: "[0, 1, 1, 5], K = 1", expected: "[1, 2]", output: "[1, 2]", passed: true },
      { id: 2, input: "[1, 2, 3, 4, 5], K = 6", expected: "[-1, -1]", output: "[-1, -1]", passed: true },
      { id: 3, input: "[1, 1, 1, 1], K = 1", expected: "[0, 3]", output: "[0, 3]", passed: true },
      { id: 4, input: "[], K = 5", expected: "[-1, -1]", output: "[-1, -1]", passed: true },
      { id: 5, input: "[5, 7, 7, 8, 8, 10], K = 8", expected: "[3, 4]", output: "[3, 4]", passed: true },
    ],
  }

  // Function to go back to challenges list
  const goBackToChallenges = () => {
    navigate("/codechallenges")
  }

  // Mock challenge data
  const challengeData = {
    title: "Longest Common Substring",
    startedAt: "Hoy 4:12 PM",
    description: `1. Se Te Ha Dado Un Array/Lista Ordenado(A) ARR Que Contiene 'N' Elementos. También Se Te Da Un Entero 'K'.
Tu Tarea Es Encontrar La Primera Y La Última Ocurrencia De 'K' En ARR.
Notas:
  a. Si 'K' No Está Presente En El Array, La Primera Y La Última Ocurrencia Deben Ser -1.
  b. El Array ARR Puede Contener Elementos Duplicados.
Ejemplo:
  . Si ARR = [0, 1, 1, 5] Y K = 1, Entonces La Primera Y La Última Ocurrencia De 1 Estarán En Los Índices 1 Y 2 (Basado En Índice 0).`,
  }

  // Line numbers for code editor
  const lineNumbers = Array.from({ length: 5 }, (_, i) => i + 1)

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "code":
        return (
          <>
            {/* Problem Description */}
            <div className="problem-description">
              <div className="description-content">{challengeData.description}</div>
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
            </div>
          </>
        )
      case "result":
        return (
          <div className="result-container">
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
                <button className="result-action-button">Ver Solución</button>
                <button className="result-action-button">Enviar</button>
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

  return (
    <div className="challenge-detail-container">
      {/* Header */}
      <div className="challenge-header">
        <div className="logo-section">
          <div className="logo" onClick={goBackToChallenges}>
           
            <div className="logo-text">
              <span className="logo-happy">Happy</span>
              <span className="logo-faces">Faces</span>
            </div>
          </div>
        </div>

        <div className="challenge-info">
          <h1 className="challenge-title">{challengeData.title}</h1>
          <p className="challenge-timestamp">Empezado: {challengeData.startedAt}</p>
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
            <div className="no-submissions">Aún No Has Enviado Este Problema</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeDetail

