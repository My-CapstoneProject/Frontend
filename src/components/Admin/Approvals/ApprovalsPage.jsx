import { useState, useEffect } from "react";
import { authService, storeService } from "../../../services/api";
import "./Approvals.css";

const ApprovalsPage = () => {
  const [pendingStores, setPendingStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    fetchPendingStores();
  }, []);

  const fetchPendingStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const stores = await storeService.getPendingStores();
      setPendingStores(stores);
    } catch (err) {
      setError("Failed to fetch pending store approvals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (storeId) => {
    try {
      setError(null);
      await storeService.approveStore(storeId);
      await fetchPendingStores();
    } catch (err) {
      setError("Failed to approve store");
      console.error(err);
    }
  };

  const handleUpdateStore = async (storeId, updatedData) => {
    try {
      await storeService.updateStore(storeId, updatedData);
      setEditingStore(null);
      fetchPendingStores();
    } catch (err) {
      setError("Failed to update store details");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="approvals-page">
      <h1 className="page-title">Pending Store Approvals</h1>
      <div className="table-container">
        <table className="approvals-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Store ID</th>
              <th>Region</th>
              <th>Owner Name</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingStores.map((store) => (
              <tr key={store.id}>
                <td>
                  {editingStore === store.id ? (
                    <input
                      type="text"
                      defaultValue={store.name}
                      onChange={(e) => 
                        handleUpdateStore(store.id, {
                          ...store,
                          name: e.target.value
                        })
                      }
                    />
                  ) : (
                    store.name
                  )}
                </td>
                <td>{store.id}</td>
                <td>
                  {editingStore === store.id ? (
                    <input
                      type="text"
                      defaultValue={store.region}
                      onChange={(e) =>
                        handleUpdateStore(store.id, {
                          ...store,
                          region: e.target.value
                        })
                      }
                    />
                  ) : (
                    store.region
                  )}
                </td>
                <td>{store.ownerName}</td>
                <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  {editingStore === store.id ? (
                    <button
                      className="btn-primary"
                      onClick={() => setEditingStore(null)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() => setEditingStore(store.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn-success"
                    onClick={() => handleApproval(store.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingStores.length === 0 && (
          <div className="no-data">No pending store approvals</div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
