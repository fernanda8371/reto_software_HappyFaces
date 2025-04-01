"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { SearchIcon, EditIcon, TrashIcon } from "./AdminIcons"
import "./Admin.css"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate fetching users data
    const fetchUsers = () => {
      setIsLoading(true)
      // Mock data - in a real app, this would be an API call
      const mockUsers = [
        {
          id: "#20462",
          firstName: "Matt",
          lastName: "Dickerson",
          email: "Matt@outlook.com",
          password: "********",
          solvedProblems: 3,
          score: 1920,
        },
        {
          id: "#18933",
          firstName: "Fernanda",
          lastName: "Vasquez",
          email: "Fer@outlook.com",
          password: "********",
          solvedProblems: 4,
          score: 2010,
        },
        {
          id: "#45169",
          firstName: "Trixie",
          lastName: "Byrd",
          email: "Trixie@outlook.com",
          password: "********",
          solvedProblems: 2,
          score: 700,
        },
        {
          id: "#34304",
          firstName: "María",
          lastName: "Ramos",
          email: "Maria@outlook.com",
          password: "********",
          solvedProblems: 3,
          score: 1029,
        },
        {
          id: "#17188",
          firstName: "Diego",
          lastName: "Sanchez",
          email: "Maria@outlook.com",
          password: "********",
          solvedProblems: 3,
          score: 1400,
        },
        {
          id: "#73003",
          firstName: "Daniela",
          lastName: "Caiceros",
          email: "Daniela@outlook.com",
          password: "********",
          solvedProblems: 4,
          score: 2010,
        },
        {
          id: "#58825",
          firstName: "Miriam",
          lastName: "Kidd",
          email: "Miriam@outlook.com",
          password: "********",
          solvedProblems: 5,
          score: 2600,
        },
        {
          id: "#44122",
          firstName: "Daniel",
          lastName: "Fernandez",
          email: "Daniel@outlook.com",
          password: "********",
          solvedProblems: 1,
          score: 300,
        },
        {
          id: "#89094",
          firstName: "Lorenzo",
          lastName: "Alebrije",
          email: "Lorenzo@outlook.com",
          password: "********",
          solvedProblems: 3,
          score: 1300,
        },
        {
          id: "#85252",
          firstName: "Santiago",
          lastName: "Lopez",
          email: "Santiago@outlook.com",
          password: "********",
          solvedProblems: 3,
          score: 1300,
        },
      ]

      setUsers(mockUsers)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (userId) => {
    // Navigate to edit user page or open modal
    console.log("Edit user:", userId)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      // Filter out the deleted user
      setUsers(users.filter((user) => user.id !== userId))
      console.log("Delete user:", userId)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div className="title-section">
            <h1 className="admin-title">Usuarios</h1>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="user-profile">
              <div className="notification-bell">
                <span className="bell-icon">🔔</span>
              </div>
              <div className="avatar-dropdown">
                <img src="/placeholder.svg?height=40&width=40" alt="Admin avatar" className="avatar-image" />
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="filter-tabs">
            <button className="filter-tab active">
              Todos
            </button>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Solved problems</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.solvedProblems}</td>
                      <td>{user.score}</td>
                      <td className="action-cell">
                        <button className="action-button edit-button" onClick={() => handleEditUser(user.id)}>
                          <EditIcon />
                        </button>
                        <button className="action-button delete-button" onClick={() => handleDeleteUser(user.id)}>
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsers

