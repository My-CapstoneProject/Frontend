import { createContext, useState } from 'react'
import { orderService } from '../services/api'

export const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOrders = async (storeId) => {
    setLoading(true)
    try {
      const data = await orderService.getByStore(storeId)
      setOrders(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      const updatedOrder = await orderService.updateStatus(id, status)
      setOrders(orders.map(order => 
        order.id === id ? updatedOrder : order
      ))
      return updatedOrder
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const createOrder = async (orderData) => {
    try {
      const newOrder = await orderService.create(orderData)
      setOrders([...orders, newOrder])
      return newOrder
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        updateOrderStatus,
        createOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  )
} 