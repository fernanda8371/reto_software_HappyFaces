"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js"
import "./AdminInsights.css"
import AdminLayout from "../../components/Layout/AdminLayout"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

const AdminInsights = () => {
  const [activeTab, setActiveTab] = useState("Today")
  const [activeUsersData, setActiveUsersData] = useState([])
  const [problemsSolvedData, setProblemsSolvedData] = useState([])
  const [taskStatusData, setTaskStatusData] = useState({
    easy: { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    hard: { completed: 0, total: 0 }
  })
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // URL base de la API
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    fetchInsightsData()
  }, [])

  const fetchInsightsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch active users data
      console.log("Fetching active users data")
      const activeUsersResponse = await fetch(`${API_URL}/admin/insights/active-users`, {
        headers: {
          'Content-Type': 'application/json',
          // Comenta la autorización por ahora para pruebas
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      
      if (!activeUsersResponse.ok) {
        console.warn(`Active users API returned status: ${activeUsersResponse.status}`)
        // Usar datos de respaldo si la API falla
        setActiveUsersData(getMockActiveUsersData())
      } else {
        const activeUsersResult = await activeUsersResponse.json()
        setActiveUsersData(activeUsersResult)
      }

      // Fetch problems solved data
      console.log("Fetching problems solved data")
      const problemsSolvedResponse = await fetch(`${API_URL}/admin/insights/problems-solved`, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      
      if (!problemsSolvedResponse.ok) {
        console.warn(`Problems solved API returned status: ${problemsSolvedResponse.status}`)
        // Usar datos de respaldo si la API falla
        setProblemsSolvedData(getMockProblemsSolvedData())
      } else {
        const problemsSolvedResult = await problemsSolvedResponse.json()
        setProblemsSolvedData(problemsSolvedResult)
      }

      // Fetch task status data
      console.log("Fetching task status data")
      const taskStatusResponse = await fetch(`${API_URL}/admin/insights/task-status`, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      
      if (!taskStatusResponse.ok) {
        console.warn(`Task status API returned status: ${taskStatusResponse.status}`)
        // Usar datos de respaldo si la API falla
        setTaskStatusData(getMockTaskStatusData())
      } else {
        const taskStatusResult = await taskStatusResponse.json()
        setTaskStatusData(taskStatusResult)
      }
      
    } catch (error) {
      console.error("Error fetching insights data:", error)
      setError("Failed to load insights data. Please try again.")
      
      // Usar datos de respaldo en caso de error
      setActiveUsersData(getMockActiveUsersData())
      setProblemsSolvedData(getMockProblemsSolvedData())
      setTaskStatusData(getMockTaskStatusData())
    } finally {
      setLoading(false)
    }
  }

  // Datos de respaldo en caso de fallo de API
  const getMockActiveUsersData = () => {
    const mockData = [];
    for (let i = 0; i < 8; i++) {
      mockData.push({
        week: `Week ${i+1}`,
        count: Math.floor(Math.random() * 50) + 10 // Random count between 10-60
      });
    }
    return mockData;
  }

  const getMockProblemsSolvedData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      count: Math.floor(Math.random() * 30) + 5 // Random count between 5-35
    }));
  }

  const getMockTaskStatusData = () => ({
    easy: { completed: 12, total: 20 },
    medium: { completed: 8, total: 15 },
    hard: { completed: 3, total: 10 }
  })

  // User Count Per Week Chart Data
  const userCountData = {
    labels: activeUsersData.map(item => item.week),
    datasets: [
      {
        label: "Active Users",
        data: activeUsersData.map(item => item.count),
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      }
    ],
  }

  // Problems Solved Data
  const problemsSolvedChartData = {
    labels: problemsSolvedData.map(item => item.day),
    datasets: [
      {
        label: "Problems Solved",
        data: problemsSolvedData.map(item => item.count),
        borderColor: "rgba(216, 80, 240, 1)",
        backgroundColor: "rgba(216, 80, 240, 0.1)",
        tension: 0.4,
        fill: true,
      }
    ],
  }

  // Task Status Data for Donut Chart
  const getTaskStatusChartData = () => {
    // Asegurarse de que los datos no sean nulos o indefinidos
    if (!taskStatusData) return { completed: 0, inProgress: 0, pending: 0 };

    const data = selectedDifficulty === "all" 
      ? {
          completed: Object.values(taskStatusData).reduce((acc, curr) => acc + (curr?.completed || 0), 0),
          total: Object.values(taskStatusData).reduce((acc, curr) => acc + (curr?.total || 0), 0)
        }
      : taskStatusData[selectedDifficulty] || { completed: 0, total: 0 };

    // Asegurarse de que hay datos válidos para evitar divisiones por cero
    const total = data.total || 1;
    const completed = data.completed || 0;
    
    return {
      completed,
      inProgress: Math.floor(total * 0.2), // Assuming 20% are in progress
      pending: total - completed - Math.floor(total * 0.2)
    }
  }

  const currentTaskStatus = getTaskStatusChartData()
  
  // Normalizar los valores para el gráfico de donut (deben sumar 100)
  const normalizeDonutValues = () => {
    const total = currentTaskStatus.completed + currentTaskStatus.inProgress + currentTaskStatus.pending;
    
    // Evitar división por cero
    if (total === 0) return { completed: 0, inProgress: 0, pending: 0 };
    
    return {
      completed: Math.round((currentTaskStatus.completed / total) * 100),
      inProgress: Math.round((currentTaskStatus.inProgress / total) * 100),
      pending: Math.round((currentTaskStatus.pending / total) * 100)
    };
  }
  
  const normalizedDonutValues = normalizeDonutValues();

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-insights-container">
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-insights-container">
          <div className="error-message">
            {error}
            <button onClick={fetchInsightsData} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-insights-container">
        {/* Top Row */}
        <div className="insights-row">
          {/* User Count Chart */}
          <div className="insights-card">
            <div className="card-header">
              <h3>Active Users Per Week</h3>
            </div>
            <div className="card-content chart-container">
              <div className="user-count-chart">
                <Line
                  data={userCountData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Active Users'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Week'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `Active Users: ${context.parsed.y}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Problems Solved Chart */}
          <div className="insights-card">
            <div className="card-header">
              <h3>Problems Solved: Last Week</h3>
            </div>
            <div className="card-content">
              <div className="problems-solved-chart">
                <Line
                  data={problemsSolvedChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Problems Solved'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Day'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `Problems Solved: ${context.parsed.y}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="insights-row">
          {/* Task Status Overview */}
          <div className="insights-card task-status">
            <div className="card-header">
              <h3>Task Status Overview</h3>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="difficulty-select"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="card-content">
              <div className="donut-chart-container">
                <div className="donut-chart">
                  <div className="donut-inner">
                    <div className="donut-value">
                      {currentTaskStatus.total === 0 ? 0 : Math.round((currentTaskStatus.completed / (currentTaskStatus.completed + currentTaskStatus.inProgress + currentTaskStatus.pending)) * 100)}%
                    </div>
                    <div className="donut-label">Completion Rate</div>
                  </div>
                  <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                    <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                    <circle
                      className="donut-ring"
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#d2d3d4"
                      strokeWidth="3"
                    ></circle>

                    {/* Completed segment */}
                    <circle
                      className="donut-segment donut-segment-completed"
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#EC4899"
                      strokeWidth="3"
                      strokeDasharray={`${normalizedDonutValues.completed} ${100 - normalizedDonutValues.completed}`}
                      strokeDashoffset="25"
                    ></circle>

                    {/* In Progress segment */}
                    <circle
                      className="donut-segment donut-segment-in-progress"
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeDasharray={`${normalizedDonutValues.inProgress} ${100 - normalizedDonutValues.inProgress}`}
                      strokeDashoffset={`${75 + normalizedDonutValues.completed}`}
                    ></circle>

                    {/* Pending segment */}
                    <circle
                      className="donut-segment donut-segment-pending"
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#C4B5FD"
                      strokeWidth="3"
                      strokeDasharray={`${normalizedDonutValues.pending} ${100 - normalizedDonutValues.pending}`}
                      strokeDashoffset={`${75 + normalizedDonutValues.completed + normalizedDonutValues.inProgress}`}
                    ></circle>
                  </svg>
                </div>

                <div className="donut-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#EC4899" }}></span>
                    <span className="legend-label">Completed {currentTaskStatus.completed}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#8B5CF6" }}></span>
                    <span className="legend-label">In progress {currentTaskStatus.inProgress}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#C4B5FD" }}></span>
                    <span className="legend-label">Pending {currentTaskStatus.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminInsights