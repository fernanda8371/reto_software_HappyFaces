"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/Layout/AdminLayout"
import { fetchChallengeInsights } from "../../services/admin"
import "./AdminInsights.css"

function AdminInsights() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true)
        const data = await fetchChallengeInsights()
        setInsights(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar los insights. Intenta nuevamente.")
        console.error("Error fetching insights:", err)
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-message">Cargando insights...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-message">
          {error}
          <button className="retry-button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Insights de Code Challenges</h1>
        </div>

        <div className="admin-content">
          <div className="insights-grid">
            <div className="insight-card">
              <h3 className="insight-title">Más Popular</h3>
              <p className="insight-value">{insights.mostPopular.title}</p>
              <p className="insight-detail">Intentos: {insights.mostPopular.attempts}</p>
            </div>

            <div className="insight-card">
              <h3 className="insight-title">Más Completado</h3>
              <p className="insight-value">{insights.mostCompleted.title}</p>
              <p className="insight-detail">Completado por: {insights.mostCompleted.completions} usuarios</p>
            </div>

            <div className="insight-card">
              <h3 className="insight-title">Más Fallado</h3>
              <p className="insight-value">{insights.mostFailed.title}</p>
              <p className="insight-detail">Fallos: {insights.mostFailed.failures}</p>
            </div>

            <div className="insight-card">
              <h3 className="insight-title">Mayor Tasa de Éxito</h3>
              <p className="insight-value">{insights.highestSuccessRate.title}</p>
              <p className="insight-detail">Tasa de éxito: {insights.highestSuccessRate.successRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminInsights