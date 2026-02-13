import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import API_BASE_URL from '../config/api'
import './Ordenes.css'

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user } = useAuth()

  useEffect(() => {
    fetchOrdenes()
  }, [])

  const fetchOrdenes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/pagos/ordenes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar órdenes')
      }

      const data = await response.json()
      setOrdenes(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Cargando órdenes...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="ordenes-container">
      <div className="ordenes-header">
        <h1>Mis Órdenes</h1>
        <p>Historial de tus compras</p>
      </div>

      {ordenes.length === 0 ? (
        <div className="empty-ordenes">
          <h3>No tienes órdenes aún</h3>
          <p>Realiza tu primera compra para ver el historial aquí.</p>
        </div>
      ) : (
        <div className="ordenes-list">
          {ordenes.map(orden => (
            <div key={orden.id} className="orden-card">
              <div className="orden-header">
                <h3>Orden #{orden.id}</h3>
                <div className="orden-meta">
                  <span className="orden-fecha">
                    {new Date(orden.creado_en).toLocaleDateString()}
                  </span>
                  <span className={`orden-estado ${orden.estado}`}>
                    {orden.estado}
                  </span>
                </div>
              </div>
              
              <div className="orden-items">
                {orden.items.map(item => (
                  <div key={item.producto_codigo} className="orden-item">
                    <span className="item-nombre">{item.producto_codigo}</span>
                    <span className="item-cantidad">x{item.cantidad}</span>
                    <span className="item-precio">${item.precio_unitario.toFixed(2)}</span>
                    <span className="item-subtotal">
                      ${(item.cantidad * item.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="orden-total">
                <strong>Total: ${orden.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ordenes