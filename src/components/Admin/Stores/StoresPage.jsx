import { useState, useEffect } from "react";
import { storeService } from "../../../services/api";
import "./Stores.css";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await storeService.getAll();
      setStores(data);
    } catch (err) {
      setError("Failed to fetch stores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (storeId, newStatus) => {
    try {
      await storeService.updateStatus(storeId, newStatus);
      fetchStores();
    } catch (err) {
      console.error("Failed to update store status:", err);
    }
  };

  const handleEdit = (store) => {
    setSelectedStore(store);
    setShowAddModal(true);
  };

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Stores</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Store
        </button>
      </div>

      <div className="cards-grid">
        {stores.map((store) => (
          <div key={store.id} className="card">
            <div className="card-header">
              <h3>{store.name}</h3>
              <span className={`badge badge-${store.status === 'ACTIVE' ? 'success' : 'error'}`}>
                {store.status}
              </span>
            </div>
            <div className="card-content">
              <p><strong>Location:</strong> {store.location}</p>
              <p><strong>Region:</strong> {store.region}</p>
              <p><strong>Owner:</strong> {store.ownerName}</p>
            </div>
            <div className="card-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(store)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button 
                className={`btn ${store.status === 'ACTIVE' ? 'btn-error' : 'btn-success'}`}
                onClick={() => handleStatusChange(store.id, store.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
              >
                <i className={`fas fa-${store.status === 'ACTIVE' ? 'ban' : 'check'}`}></i>
                {store.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedStore ? 'Edit Store' : 'Add New Store'}</h2>
              <button 
                className="close-icon"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedStore(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {/* Add your store form here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPage;
