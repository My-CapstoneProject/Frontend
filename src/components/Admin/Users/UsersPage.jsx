import { useState, useEffect } from 'react';
import { authService } from '../../../services/api';
import './Users.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Users Management</h1>
        <button className="add-user-btn">
          <i className="fas fa-plus"></i>
          Add New User
        </button>
      </div>

      <div className="users-grid">
        {users.length === 0 ? (
          <div className="no-data">No users found</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="card-header">
                <div className="user-avatar">
                  {user.name?.charAt(0) || user.username?.charAt(0)}
                </div>
                <div className="user-info">
                  <h3>{user.name || user.username}</h3>
                  <div className="role-badge">{user.role}</div>
                </div>
              </div>

              <div className="card-content">
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-user"></i>
                  <span>{user.username}</span>
                </div>
                {user.storeId && (
                  <div className="info-item">
                    <i className="fas fa-store"></i>
                    <span>Store ID: {user.storeId}</span>
                  </div>
                )}
                <div className="info-item">
                  <i className="fas fa-circle-dot"></i>
                  <span className={`status-badge ${user.status?.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEditUser(user.id)}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersPage; 