import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCarrito } from '../contexts/CarritoContext'
import axios from 'axios'
import './Productos.css'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { user } = useAuth()
  const { addToCarrito } = useCarrito()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/productos')
      setProductos(response.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (producto) => {
    try {
      await addToCarrito(producto.codigo, 1)
      alert('Producto agregado al carrito')
    } catch (error) {
      alert('Error al agregar al carrito: ' + error.message)
    }
  }

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Cargando productos...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h1>Equipamiento de Gimnasio</h1>
        <p className="productos-subtitle">Descubre nuestra selección premium de productos para tu entrenamiento</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="productos-grid">
        {filteredProductos.map(producto => (
          <div key={producto.id} className="producto-card">
            <div className="producto-image">
              <img
                src={producto.imagen || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop'}
                alt={producto.nombre}
                className="producto-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop'
                }}
              />
            </div>
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="producto-codigo">Código: {producto.codigo}</p>
              <p className="producto-precio">${producto.precio.toFixed(2)}</p>
              {producto.descripcion && (
                <p className="producto-descripcion">{producto.descripcion}</p>
              )}
            </div>
            <div className="producto-actions">
              <button
                onClick={() => handleAddToCart(producto)}
                className="btn-primary"
                disabled={user?.nivel === 'admin'}
              >
                {user?.nivel === 'admin' ? 'Admin' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div className="no-products">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  )
}

export default Productos