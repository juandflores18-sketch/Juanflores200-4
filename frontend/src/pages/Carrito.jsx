import React, { useState, useEffect } from 'react'
import { useCarrito } from '../contexts/CarritoContext'
import { useNavigate } from 'react-router-dom'
import './Carrito.css'

const Carrito = () => {
  const { carrito, loading, removeFromCarrito, clearCarrito } = useCarrito()
  const [updatingItems, setUpdatingItems] = useState(new Set())
  const navigate = useNavigate()

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingItems(prev => new Set([...prev, itemId]))
      await removeFromCarrito(itemId)
    } catch (error) {
      alert('Error al eliminar del carrito: ' + error.message)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleClearCarrito = async () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      try {
        await clearCarrito()
      } catch (error) {
        alert('Error al vaciar el carrito: ' + error.message)
      }
    }
  }

  const handleCheckout = () => {
    if (carrito.items.length === 0) {
      alert('El carrito está vacío')
      return
    }
    navigate('/pagos')
  }

  if (loading) {
    return <div className="loading">Cargando carrito...</div>
  }

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h1>Mi Carrito</h1>
        {carrito.items.length > 0 && (
          <button onClick={handleClearCarrito} className="clear-btn">
            Vaciar Carrito
          </button>
        )}
      </div>

      {carrito.items.length === 0 ? (
        <div className="empty-carrito">
          <h3>Carrito Vacío</h3>
          <p>Aún no has agregado productos al carrito.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ver Productos
          </button>
        </div>
      ) : (
        <>
          <div className="carrito-items">
            {carrito.items.map(item => (
              <div key={item.id} className="carrito-item">
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p className="item-codigo">Código: {item.producto_codigo}</p>
                  <p className="item-precio">Precio unitario: ${item.precio.toFixed(2)}</p>
                  <p className="item-subtotal">Subtotal: ${item.subtotal.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <span className="item-cantidad">Cantidad: {item.cantidad}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    disabled={updatingItems.has(item.id)}
                  >
                    {updatingItems.has(item.id) ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <div className="resumen-total">
              <h3>Total: ${carrito.total.toFixed(2)}</h3>
            </div>
            <div className="carrito-actions">
              <button onClick={() => navigate('/')} className="btn-secondary">
                Seguir Comprando
              </button>
              <button onClick={handleCheckout} className="btn-primary">
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Carrito