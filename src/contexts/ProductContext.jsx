import { createContext, useState, useContext } from 'react'
import { productService } from '../services/api'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product) => {
    try {
      const newProduct = await productService.create(product)
      setProducts([...products, newProduct])
      return newProduct
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateProduct = async (id, product) => {
    try {
      const updatedProduct = await productService.update(id, product)
      setProducts(products.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        error, 
        fetchProducts, 
        addProduct, 
        updateProduct 
      }}
    >
      {children}
    </ProductContext.Provider>
  )
} 