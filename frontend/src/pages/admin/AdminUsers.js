"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/Layout/AdminLayout"
import { SearchIcon, EditIcon, TrashIcon, PlusIcon } from "./AdminIcons"
import { getAllUsers, deleteUser, createUser, updateUser } from "../../services/admin"
import UserFormModal from "./UserFormModal"
import "./Admin.css"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const navigate = useNavigate()
  // Add a new state for role filtering
  const [roleFilter, setRoleFilter] = useState("all")

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Fetching users...")
      const data = await getAllUsers()
      console.log("Users fetched successfully:", data)
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Error loading users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Modify the filtering function to include role filter
  const filteredUsers = users.filter((user) => {
    // First apply the search filter
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.user_id && user.user_id.toString().includes(searchTerm.toLowerCase()))

    // Then apply the role filter
    if (roleFilter === "all") return matchesSearch
    return matchesSearch && user.role === roleFilter
  })

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleAddUser = () => {
    setCurrentUser(null)
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId)
        // Update the users list after deletion
        setUsers(users.filter((user) => user.user_id !== userId))
      } catch (err) {
        console.error("Error deleting user:", err)
        alert("Error deleting user. Please try again.")
      }
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setCurrentUser(null)
  }

  const handleUserSaved = async (userData) => {
    try {
      let savedUser

      if (currentUser) {
        // Update existing user
        savedUser = await updateUser(currentUser.user_id, userData)
        // Update user in the list
        setUsers(users.map((user) => (user.user_id === savedUser.user_id ? savedUser : user)))
      } else {
        // Create new user
        savedUser = await createUser(userData)
        // Add new user to the list
        setUsers([...users, savedUser])
      }

      setShowModal(false)
      setCurrentUser(null)
    } catch (error) {
      console.error("Error saving user:", error)
      throw error // Re-throw to be handled by the modal
    }
  }

  // Add a function to handle filter change
  const handleRoleFilterChange = (filter) => {
    setRoleFilter(filter)
    setCurrentPage(1) // Reset to the first page when we change the filter
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div className="title-section">
            <h1 className="admin-title">Users</h1>
            <button className="add-button" onClick={handleAddUser}>
              <PlusIcon />
              <span>Add User</span>
            </button>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name, email or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="user-profile">
   
              <div className="avatar-dropdown">
                <img src="/placeholder.svg?height=40&width=40" alt="Admin avatar" className="avatar-image" />
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {/* Update the filter buttons in JSX to use the new function */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`filter-tab ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("admin")}
            >
              Administrators
            </button>
            <button
              className={`filter-tab ${roleFilter === "employee" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("employee")}
            >
              Employees
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchUsers} className="retry-button">
                Retry
              </button>
            </div>
          )}

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {/* <th>Company</th> */}
                  <th>Score</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">
                      Loading users...
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td>#{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role || "employee"}</td>
                      {/* <td>{user.company || "N/A"}</td> */}
                      <td>{user.total_score || 0}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="action-cell">
                        <button className="action-button edit-button" onClick={() => handleEditUser(user)}>
                          <EditIcon />
                        </button>
                        <button className="action-button delete-button" onClick={() => handleDeleteUser(user.user_id)}>
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Form Modal */}
      {showModal && <UserFormModal user={currentUser} onClose={handleModalClose} onSave={handleUserSaved} />}
    </AdminLayout>
  )
}

export default AdminUsers