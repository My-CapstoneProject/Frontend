import './Modal.css'

function ViewProductModal({ product, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Product Details</h2>
        <div className="product-details">
          <img src={product.image} alt={product.name} className="product-image" />
          
          <div className="detail-group">
            <label>Name:</label>
            <p>{product.name}</p>
          </div>

          <div className="detail-group">
            <label>Brand:</label>
            <p>{product.brand}</p>
          </div>

          <div className="detail-group">
            <label>Price:</label>
            <p>${product.price}</p>
          </div>

          <div className="detail-group">
            <label>Status:</label>
            <p>{product.status}</p>
          </div>

          <div className="detail-group">
            <label>Description:</label>
            <p>{product.description}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ViewProductModal 