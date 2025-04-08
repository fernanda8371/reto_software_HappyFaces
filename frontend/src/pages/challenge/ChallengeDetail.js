"use client"

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  RefreshIcon,
  SettingsIcon,
  ExpandIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChipIcon,
} from "./ChallengeIcons";
import "./ChallengeDetail.css";

// API base URL - Asegúrate de configurarlo en tu archivo .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

function ChallengeDetail() {
  const [activeTab, setActiveTab] = useState("code");
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState("");
  const [rightTab, setRightTab] = useState("examples");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the challenge ID from URL

  // Obtener el token de autenticación del localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Configuración para las peticiones axios con autorización
  const authConfig = () => {
    const token = getAuthToken();
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  // Cargar los datos del desafío
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/challenges/${id}`);
        setChallenge(response.data);
        
        // Configurar el código inicial si existe
        if (response.data.starter_code) {
          setCode(response.data.starter_code);
        }
        
        // Cargar el historial de envíos del usuario si está autenticado
        if (getAuthToken()) {
          try {
            const submissionsResponse = await axios.get(
              `${API_BASE_URL}/challenges/user`, 
              authConfig()
            );
            
            // Filtrar solo los envíos relacionados con este desafío
            const challengeSubmissions = submissionsResponse.data.filter(
              submission => submission.challenge_id === parseInt(id)
            );
            setUserSubmissions(challengeSubmissions);
          } catch (submissionError) {
            console.error("Error loading user submissions:", submissionError);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el desafío. Por favor, inténtalo de nuevo.");
        setLoading(false);
        console.error("Error fetching challenge:", err);
      }
    };

    if (id) {
      fetchChallengeData();
    }
  }, [id]);

  // Función para enviar la solución
  const submitSolution = async () => {
    try {
      setLoading(true);
      
      // Verificar si el usuario está autenticado
      if (!getAuthToken()) {
        setError("Debes iniciar sesión para enviar una solución");
        setLoading(false);
        return;
      }
      
      // Enviar el código a la API
      const response = await axios.post(
        `${API_BASE_URL}/challenges/${id}/submit`,
        { code },
        authConfig()
      );
      
      // Actualizar el resultado de la evaluación
      setSubmissionResult(response.data);
      
      // Actualizar el historial de envíos
      const updatedSubmissionsResponse = await axios.get(
        `${API_BASE_URL}/challenges/user`, 
        authConfig()
      );
      
      const challengeSubmissions = updatedSubmissionsResponse.data.filter(
        submission => submission.challenge_id === parseInt(id)
      );
      setUserSubmissions(challengeSubmissions);
      
      // Cambiar a la pestaña de resultados
      setActiveTab("result");
      setLoading(false);
    } catch (err) {
      setError("Error al enviar la solución. Por favor, inténtalo de nuevo.");
      setLoading(false);
      console.error("Error submitting solution:", err);
    }
  };

  // Function to go back to challenges list
  const goBackToChallenges = () => {
    navigate("/codechallenges");
  };

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading && !challenge) {
    return React.createElement("div", { className: "loading-container" }, "Cargando desafío...");
  }

  // Mostrar mensaje de error si hay algún problema
  if (error && !challenge) {
    return React.createElement("div", { className: "error-container" }, error);
  }

  // Line numbers for code editor
  const codeLines = code.split('\n').length;
  const lineNumbers = Array.from({ length: codeLines > 5 ? codeLines : 5 }, (_, i) => i + 1);

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "code":
        return React.createElement(
          React.Fragment,
          null,
          // Problem Description
          React.createElement(
            "div",
            { className: "problem-description" },
            React.createElement(
              "div",
              { className: "description-content" },
              challenge?.description || "No hay descripción disponible"
            )
          ),
          // Code Editor
          React.createElement(
            "div",
            { className: "code-editor-container" },
            React.createElement(
              "div",
              { className: "editor-header" },
              React.createElement(
                "div",
                { className: "language-selector" },
                React.createElement("span", null, language),
                React.createElement(
                  "button",
                  { className: "refresh-button" },
                  React.createElement(RefreshIcon, null)
                )
              ),
              React.createElement(
                "div",
                { className: "editor-controls" },
                React.createElement(
                  "button",
                  { className: "control-button" },
                  React.createElement(SettingsIcon, null)
                ),
                React.createElement(
                  "button",
                  { className: "control-button" },
                  React.createElement(ExpandIcon, null)
                )
              )
            ),
            React.createElement(
              "div",
              { className: "code-editor" },
              React.createElement(
                "div",
                { className: "line-numbers" },
                lineNumbers.map((num) =>
                  React.createElement(
                    "div",
                    { key: num, className: "line-number" },
                    num
                  )
                )
              ),
              React.createElement("textarea", {
                className: "code-textarea",
                value: code,
                onChange: (e) => setCode(e.target.value),
                spellCheck: "false",
              })
            ),
            React.createElement(
              "div",
              { className: "submit-container" },
              React.createElement(
                "button",
                {
                  className: "submit-button",
                  onClick: submitSolution,
                  disabled: loading,
                },
                loading ? "Enviando..." : "Enviar Solución"
              )
            )
          )
        );
        
      case "result":
        // Usar datos reales del resultado de la evaluación
        const testResults = submissionResult || {
          success: false,
          score: 0,
          message: "No hay resultados disponibles",
          testCases: []
        };
        
        return React.createElement(
          "div",
          { className: "result-container" },
          React.createElement(
            "div",
            { className: "result-header" },
            React.createElement(
              "div",
              { className: "result-status" },
              React.createElement(
                "div",
                { className: `status-badge ${testResults.success ? "success" : "error"}` },
                testResults.success 
                  ? React.createElement(CheckCircleIcon, null)
                  : React.createElement(XCircleIcon, null),
                React.createElement(
                  "span",
                  null,
                  testResults.success ? "Aceptado" : "Rechazado"
                )
              ),
              React.createElement(
                "div",
                { className: "result-metrics" },
                React.createElement(
                  "div",
                  { className: "metric" },
                  React.createElement(ClockIcon, null),
                  React.createElement(
                    "span",
                    null,
                    "Puntuación: " + testResults.score
                  )
                ),
                testResults.runtime && React.createElement(
                  "div",
                  { className: "metric" },
                  React.createElement(ChipIcon, null),
                  React.createElement(
                    "span",
                    null,
                    "Runtime: " + testResults.runtime
                  )
                )
              )
            ),
            React.createElement(
              "div",
              { className: "result-actions" },
              React.createElement(
                "button",
                {
                  className: "result-action-button",
                  onClick: () => setActiveTab("code"),
                },
                "Volver al Código"
              ),
              React.createElement(
                "button",
                {
                  className: "result-action-button",
                  onClick: submitSolution,
                  disabled: loading,
                },
                loading ? "Enviando..." : "Enviar de Nuevo"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "test-cases" },
            React.createElement(
              "h3",
              { className: "test-cases-title" },
              "Casos de Prueba"
            ),
            testResults.testCases && testResults.testCases.length > 0
              ? React.createElement(
                  "div",
                  { className: "test-cases-list" },
                  testResults.testCases.map((testCase) =>
                    React.createElement(
                      "div",
                      { key: testCase.id, className: "test-case" },
                      React.createElement(
                        "div",
                        { className: "test-case-header" },
                        React.createElement(
                          "div",
                          { className: "test-case-status" },
                          testCase.passed
                            ? React.createElement(CheckCircleIcon, {
                                className: "icon-success",
                              })
                            : React.createElement(XCircleIcon, {
                                className: "icon-error",
                              }),
                          React.createElement(
                            "span",
                            null,
                            "Caso de Prueba " + testCase.id
                          )
                        )
                      ),
                      React.createElement(
                        "div",
                        { className: "test-case-details" },
                        React.createElement(
                          "div",
                          { className: "test-case-row" },
                          React.createElement(
                            "div",
                            { className: "test-case-label" },
                            "Input:"
                          ),
                          React.createElement(
                            "div",
                            { className: "test-case-value" },
                            testCase.input
                          )
                        ),
                        React.createElement(
                          "div",
                          { className: "test-case-row" },
                          React.createElement(
                            "div",
                            { className: "test-case-label" },
                            "Output:"
                          ),
                          React.createElement(
                            "div",
                            { className: "test-case-value" },
                            testCase.output
                          )
                        ),
                        React.createElement(
                          "div",
                          { className: "test-case-row" },
                          React.createElement(
                            "div",
                            { className: "test-case-label" },
                            "Expected:"
                          ),
                          React.createElement(
                            "div",
                            { className: "test-case-value" },
                            testCase.expected
                          )
                        )
                      )
                    )
                  )
                )
              : React.createElement(
                  "div",
                  { className: "no-test-cases" },
                  React.createElement("p", null, testResults.message)
                )
          )
        );
        
      case "chat":
        return React.createElement(
          "div",
          { className: "chat-container" },
          React.createElement(
            "div",
            { className: "chat-messages" },
            React.createElement(
              "div",
              { className: "chat-message-empty" },
              React.createElement(
                "p",
                null,
                "Pregunta al asistente sobre este problema"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "chat-input-container" },
            React.createElement("input", {
              type: "text",
              className: "chat-input",
              placeholder: "Escribe tu pregunta aquí...",
            }),
            React.createElement(
              "button",
              { className: "chat-send-button" },
              "Enviar"
            )
          )
        );
        
      default:
        return null;
    }
  };

  // Renderizar el panel derecho con ejemplos o historial
  const renderRightPanel = () => {
    if (rightTab === "examples") {
      return challenge?.test_cases && challenge.test_cases.examples
        ? React.createElement(
            "div",
            { className: "examples-content" },
            challenge.test_cases.examples.map((example, index) =>
              React.createElement(
                "div",
                { key: index, className: "example-item" },
                React.createElement("h4", null, "Ejemplo " + (index + 1)),
                React.createElement(
                  "div",
                  { className: "example-content" },
                  React.createElement(
                    "div",
                    { className: "example-row" },
                    React.createElement(
                      "span",
                      { className: "example-label" },
                      "Input:"
                    ),
                    React.createElement(
                      "span",
                      { className: "example-value" },
                      example.input
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "example-row" },
                    React.createElement(
                      "span",
                      { className: "example-label" },
                      "Output:"
                    ),
                    React.createElement(
                      "span",
                      { className: "example-value" },
                      example.output
                    )
                  ),
                  example.explanation &&
                    React.createElement(
                      "div",
                      { className: "example-row" },
                      React.createElement(
                        "span",
                        { className: "example-label" },
                        "Explanation:"
                      ),
                      React.createElement(
                        "span",
                        { className: "example-value" },
                        example.explanation
                      )
                    )
                )
              )
            )
          )
        : React.createElement(
            "div",
            { className: "no-examples" },
            "No hay ejemplos disponibles"
          );
    } else if (rightTab === "history") {
      return userSubmissions && userSubmissions.length > 0
        ? React.createElement(
            "div",
            { className: "history-content" },
            React.createElement(
              "div",
              { className: "submissions-list" },
              userSubmissions.map((submission, index) =>
                React.createElement(
                  "div",
                  { key: index, className: "submission-item" },
                  React.createElement(
                    "div",
                    {
                      className: `submission-status ${
                        submission.completed ? "success" : "error"
                      }`,
                    },
                    submission.completed
                      ? React.createElement(CheckCircleIcon, null)
                      : React.createElement(XCircleIcon, null)
                  ),
                  React.createElement(
                    "div",
                    { className: "submission-details" },
                    React.createElement(
                      "div",
                      { className: "submission-date" },
                      new Date(
                        submission.completed_at || submission.updated_at
                      ).toLocaleString()
                    ),
                    React.createElement(
                      "div",
                      { className: "submission-score" },
                      "Score: " + submission.score
                    ),
                    React.createElement(
                      "div",
                      { className: "submission-attempts" },
                      "Intentos: " + submission.attempts
                    )
                  )
                )
              )
            )
          )
        : React.createElement(
            "div",
            { className: "no-submissions" },
            "Aún no has enviado este problema"
          );
    }
  };

  return React.createElement(
    "div",
    { className: "challenge-detail-container" },
    // Header
    React.createElement(
      "div",
      { className: "challenge-header" },
      React.createElement(
        "div",
        { className: "logo-section" },
        React.createElement(
          "div",
          { className: "logo", onClick: goBackToChallenges },
          React.createElement(
            "div",
            { className: "logo-text" },
            React.createElement(
              "span",
              { className: "logo-happy" },
              "Happy"
            ),
            React.createElement(
              "span",
              { className: "logo-faces" },
              "Faces"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "challenge-info" },
        React.createElement(
          "h1",
          { className: "challenge-title" },
          challenge?.title || "Cargando..."
        ),
        React.createElement(
          "p",
          { className: "challenge-timestamp" },
          challenge?.difficulty ? `Dificultad: ${challenge.difficulty}` : ""
        )
      )
    ),
    // Main Content
    React.createElement(
      "div",
      { className: "challenge-content" },
      // Left Sidebar
      React.createElement(
        "div",
        { className: "challenge-sidebar" },
        React.createElement(
          "div",
          {
            className: `sidebar-tab ${activeTab === "code" ? "active" : ""}`,
            onClick: () => setActiveTab("code"),
          },
          "Código"
        ),
        React.createElement(
          "div",
          {
            className: `sidebar-tab ${activeTab === "chat" ? "active" : ""}`,
            onClick: () => setActiveTab("chat"),
          },
          "Ask Chat",
          React.createElement("span", { className: "chat-indicator" })
        ),
        React.createElement(
          "div",
          {
            className: `sidebar-tab ${activeTab === "result" ? "active" : ""}`,
            onClick: () => setActiveTab("result"),
          },
          "Resultado"
        )
      ),
      // Main Editor Area
      React.createElement(
        "div",
        { className: "challenge-editor-area" },
        renderContent()
      ),
      // Right Panel
      React.createElement(
        "div",
        { className: "challenge-right-panel" },
        React.createElement(
          "div",
          { className: "right-panel-header" },
          React.createElement(
            "h3",
            null,
            rightTab === "examples" ? "Ejemplos" : "Historial"
          )
        ),
        React.createElement(
          "div",
          { className: "right-panel-tabs" },
          React.createElement(
            "div",
            {
              className: `panel-tab ${rightTab === "examples" ? "active" : ""}`,
              onClick: () => setRightTab("examples"),
            },
            "Ejemplos"
          ),
          React.createElement(
            "div",
            {
              className: `panel-tab ${rightTab === "history" ? "active" : ""}`,
              onClick: () => setRightTab("history"),
            },
            "Historial"
          )
        ),
        React.createElement(
          "div",
          { className: "right-panel-content" },
          renderRightPanel()
        )
      )
    )
  );
}

export default ChallengeDetail;