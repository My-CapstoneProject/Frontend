import { useState } from 'react'
import './Modal.css'
import { productService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

function AddProductModal({ onClose, onProductAdded }) {
  const { user } = useAuth()
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    storeId: user?.storeId || '',
  })

  const categories = [
    'Fruits',
    'Vegetables',
    'Dairy',
    'Bakery',
    'Beverages',
    'Snacks',
    'Meat',
    'Others'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onProductAdded(product)
      onClose()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
                className="form-input"
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={product.brand}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                required
                className="form-input"
                placeholder="Enter brand name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                required
                className="form-select"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="form-input"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal 