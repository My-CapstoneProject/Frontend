import { useState, useEffect } from 'react'
import './Modal.css'
import { productService } from '../../services/api'

function EditProductModal({ product, onClose, onProductUpdated }) {
  const [editedProduct, setEditedProduct] = useState(product)

  useEffect(() => {
    setEditedProduct(product)
  }, [product])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await productService.update(editedProduct)
      onProductUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleChange = (e) => {
    setEditedProduct({
      ...editedProduct,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={editedProduct.productName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productBrand">Brand</label>
            <input
              type="text"
              id="productBrand"
              name="productBrand"
              value={editedProduct.productBrand}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">Price</label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={editedProduct.productPrice}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductModal 