import { useState, useEffect } from 'react'
import './Admin.css'

// Update store interface to match Java entity
const storeStructure = {
  storeId: 0,
  storeName: '',
  storeRegionId: 0,
  storeUserId: 0,
  regionName: ''
};

// Update API endpoint to match StoreController
const STORE_API_URL = 'http://localhost:7001/api/stores';

function StoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)

  useEffect(() => {
    fetchStores()
  }, [])

  // Update store operations
  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await fetch(STORE_API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch stores')
      }
      const data = await response.json()
      setStores(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addStore = async (storeData) => {
    try {
      const response = await fetch(STORE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      })
      if (!response.ok) throw new Error('Failed to add store')
      fetchStores()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (store) => {
    setSelectedStore(store)
    setShowEditModal(true)
  }

  const renderCardView = () => (
    <div className="stores-grid">
      {stores.map(store => (
        <div key={store.id} className="store-card">
          <div className="store-info">
            <h3>{store.name}</h3>
            <div className="store-details">
              <p className="region">
                <i className="fas fa-map-marker-alt"></i>
                Region: {store.region}
              </p>
              <p className="address">
                <i className="fas fa-location-dot"></i>
                {store.address}
              </p>
              <p className="phone">
                <i className="fas fa-phone"></i>
                {store.phone}
              </p>
            </div>
          </div>
          <div className="store-actions">
            <button className="edit-btn" onClick={() => handleEdit(store)}>
              <i className="fas fa-edit"></i>
              Edit
            </button>
            <button className="view-btn">
              <i className="fas fa-chart-line"></i>
              View Stats
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="table-container">
      <table className="stores-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Region</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>
                <span className={`region-badge ${store.region}`}>
                  {store.region}
                </span>
              </td>
              <td>{store.address}</td>
              <td>{store.phone}</td>
              <td>
                <div className="table-actions">
                  <button className="edit-btn" onClick={() => handleEdit(store)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="view-btn">
                    <i className="fas fa-chart-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="stores-page">
      <div className="stores-header">
        <h1>Stores</h1>
        <div className="header-actions">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
            >
              <i className="fas fa-th-large"></i>
              Card View
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <i className="fas fa-list"></i>
              Table View
            </button>
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i>
            Add Store
          </button>
        </div>
      </div>

      {viewMode === 'card' ? renderCardView() : renderTableView()}

      {/* Add Store Modal will be implemented later */}
      {showAddModal && (
        <div className="modal">
          {/* Add Store Form */}
        </div>
      )}

      {/* Edit Store Modal will be implemented later */}
      {showEditModal && (
        <div className="modal">
          {/* Edit Store Form */}
        </div>
      )}
    </div>
  )
}

export default StoresPage 