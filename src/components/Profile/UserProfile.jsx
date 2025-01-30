import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import './Profile.css'

function UserProfile() {
  const { user } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    storeId: user.storeId || ''
  })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })
      
      if (!response.ok) throw new Error('Failed to update profile')
      
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile')
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <h1>{isEditing ? 'Edit Profile' : 'My Profile'}</h1>
        </div>
        
        {message && (
          <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {user.role === 'SHOPKEEPER' && (
              <div className="form-group">
                <label htmlFor="storeId">Store ID</label>
                <input
                  type="text"
                  id="storeId"
                  value={profile.storeId}
                  className="form-input"
                  disabled
                />
              </div>
            )}

            <div className="profile-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <label>Full Name</label>
              <p>{profile.name || 'Not set'}</p>
            </div>

            <div className="info-group">
              <label>Email Address</label>
              <p>{profile.email || 'Not set'}</p>
            </div>

            <div className="info-group">
              <label>Phone Number</label>
              <p>{profile.phone || 'Not set'}</p>
            </div>

            <div className="info-group">
              <label>Role</label>
              <p className="role-badge">{user.role}</p>
            </div>

            {user.role === 'SHOPKEEPER' && (
              <div className="info-group">
                <label>Store ID</label>
                <p>{profile.storeId}</p>
              </div>
            )}

            <div className="profile-actions">
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile 