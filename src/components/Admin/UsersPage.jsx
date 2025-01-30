import { useState, useEffect } from 'react'
import { authService } from '../../services/api'
import './Users.css'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await authService.getAll()
      
      console.log('Fetched users:', data) // Debug log
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={fetchUsers}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <div className="user-avatar">
                {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <h3>{user.name || user.username}</h3>
                <span className={`status-badge ${user.status?.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
            </div>
            
            <div className="user-card-content">
              <div className="info-row">
                <i className="fas fa-id-badge"></i>
                <span>{user.username}</span>
              </div>
              <div className="info-row">
                <i className="fas fa-envelope"></i>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <i className="fas fa-user-tag"></i>
                <span>{user.role}</span>
              </div>
              {user.storeId && (
                <div className="info-row">
                  <i className="fas fa-store"></i>
                  <span>Store ID: {user.storeId}</span>
                </div>
              )}
            </div>

            <div className="user-card-actions">
              <button className="btn btn-secondary">
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-eye"></i> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersPage 