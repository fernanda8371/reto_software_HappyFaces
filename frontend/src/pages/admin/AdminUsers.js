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
  // Agregar un nuevo estado para el filtro de rol
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
      setError("Error al cargar los usuarios. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar la función de filtrado para incluir el filtro de rol
  const filteredUsers = users.filter((user) => {
    // Primero aplicamos el filtro de búsqueda
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.user_id && user.user_id.toString().includes(searchTerm.toLowerCase()))

    // Luego aplicamos el filtro de rol
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
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUser(userId)
        // Update the users list after deletion
        setUsers(users.filter((user) => user.user_id !== userId))
      } catch (err) {
        console.error("Error deleting user:", err)
        alert("Error al eliminar el usuario. Por favor, inténtalo de nuevo.")
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

  // Agregar una función para manejar el cambio de filtro
  const handleRoleFilterChange = (filter) => {
    setRoleFilter(filter)
    setCurrentPage(1) // Resetear a la primera página cuando cambiamos el filtro
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div className="title-section">
            <h1 className="admin-title">Usuarios</h1>
            <button className="add-button" onClick={handleAddUser}>
              <PlusIcon />
              <span>Añadir Usuario</span>
            </button>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar por nombre, email o ID"
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
          {/* Actualizar los botones de filtro en el JSX para usar la nueva función */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("all")}
            >
              Todos
            </button>
            <button
              className={`filter-tab ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("admin")}
            >
              Administradores
            </button>
            <button
              className={`filter-tab ${roleFilter === "employee" ? "active" : ""}`}
              onClick={() => handleRoleFilterChange("employee")}
            >
              Empleados
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchUsers} className="retry-button">
                Reintentar
              </button>
            </div>
          )}

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  {/* <th>Empresa</th> */}
                  <th>Puntuación</th>
                  <th>Fecha de registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">
                      Cargando usuarios...
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
                      No se encontraron usuarios
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
                &laquo; Anterior
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
                Siguiente &raquo;
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
