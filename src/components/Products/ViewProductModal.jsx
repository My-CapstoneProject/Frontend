import './Modal.css'

function ViewProductModal({ product, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Product Details</h2>
        <div className="product-details">
          {/* Displaying the correct attributes from the backend */}
          <img src={product.productImageUrl} alt={product.productName} className="product-image" />

          <div className="detail-group">
            <label>Name:</label>
            <p>{product.productName}</p>
          </div>

          <div className="detail-group">
            <label>Brand:</label>
            <p>{product.productBrand}</p>
          </div>

          <div className="detail-group">
            <label>Price:</label>
            <p>Rs{product.productPrice}</p>
          </div>

          <div className="detail-group">
            <label>Category:</label>
            <p>{product.productCategory}</p>
          </div>

          <div className="detail-group">
            <label>User ID:</label>
            <p>{product.productUserId}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ViewProductModal;
