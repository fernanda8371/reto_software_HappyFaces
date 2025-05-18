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

  useEffect(() => {
    fetchInsightsData()
  }, [])

  const fetchInsightsData = async () => {
    try {
      setLoading(true)
      // Fetch active users data
      const activeUsersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/insights/active-users`)
      const activeUsersData = await activeUsersResponse.json()
      setActiveUsersData(activeUsersData)

      // Fetch problems solved data
      const problemsSolvedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/insights/problems-solved`)
      const problemsSolvedData = await problemsSolvedResponse.json()
      setProblemsSolvedData(problemsSolvedData)

      // Fetch task status data
      const taskStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/insights/task-status`)
      const taskStatusData = await taskStatusResponse.json()
      setTaskStatusData(taskStatusData)
    } catch (error) {
      console.error("Error fetching insights data:", error)
    } finally {
      setLoading(false)
    }
  }

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
    const data = selectedDifficulty === "all" 
      ? {
          completed: Object.values(taskStatusData).reduce((acc, curr) => acc + curr.completed, 0),
          total: Object.values(taskStatusData).reduce((acc, curr) => acc + curr.total, 0)
        }
      : taskStatusData[selectedDifficulty]

    return {
      completed: data.completed,
      inProgress: Math.floor(data.total * 0.2), // Assuming 20% are in progress
      pending: data.total - data.completed - Math.floor(data.total * 0.2)
    }
  }

  const currentTaskStatus = getTaskStatusChartData()

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

  return (
    <AdminLayout>
      <div className="admin-insights-container">
        {/* Top Row */}
        <div className="insights-row">
          {/* User Count Chart */}
          <div className="insights-card">
            <div className="card-header">
              <h3>Active Users Per Week</h3>
              <button className="expand-button">+</button>
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
              <button className="expand-button">+</button>
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
                      {Math.round((currentTaskStatus.completed / (currentTaskStatus.completed + currentTaskStatus.inProgress + currentTaskStatus.pending)) * 100)}%
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
                      strokeDasharray={`${currentTaskStatus.completed} ${100 - currentTaskStatus.completed}`}
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
                      strokeDasharray={`${currentTaskStatus.inProgress} ${100 - currentTaskStatus.inProgress}`}
                      strokeDashoffset={`${75 + currentTaskStatus.completed}`}
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
                      strokeDasharray={`${currentTaskStatus.pending} ${100 - currentTaskStatus.pending}`}
                      strokeDashoffset={`${75 + currentTaskStatus.completed + currentTaskStatus.inProgress}`}
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
