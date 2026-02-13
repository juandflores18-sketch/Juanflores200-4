import React, { createContext, useContext, useState, useEffect } from 'react'
import API_BASE_URL from '../config/api'

const CarritoContext = createContext()

export const useCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito must be used within a CarritoProvider')
  }
  return context
}

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCarrito()
  }, [])

  const fetchCarrito = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/carrito`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCarrito(data)
      }
    } catch (error) {
      console.error('Error fetching carrito:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCarrito = async (codigo, cantidad = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autenticado')

      const response = await fetch(`${API_BASE_URL}/carrito`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo, cantidad })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al agregar al carrito')
      }

      const data = await response.json()
      setCarrito(data)
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCarrito = async (itemId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autenticado')

      const response = await fetch(`${API_BASE_URL}/carrito/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar del carrito')
      }

      await fetchCarrito()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCarrito = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autenticado')

      const response = await fetch(`${API_BASE_URL}/carrito`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al vaciar carrito')
      }

      setCarrito({ items: [], total: 0 })
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    carrito,
    loading,
    addToCarrito,
    removeFromCarrito,
    clearCarrito,
    fetchCarrito
  }

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}