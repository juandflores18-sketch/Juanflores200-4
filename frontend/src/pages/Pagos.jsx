import React, { useState, useEffect } from 'react'
import { useCarrito } from '../contexts/CarritoContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import paymentImage from '../assets/istockphoto-919525494-612x612.jpg'
import paymentIcons from '../assets/royalty-payment-icon-set-multiple-260nw-2595735841.webp'
import './Pagos.css'

const Pagos = () => {
  const { carrito } = useCarrito()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paypalOrder, setPaypalOrder] = useState(null)

  useEffect(() => {
    if (carrito.items.length === 0) {
      navigate('/carrito')
    }
  }, [carrito.items.length, navigate])

  const handleStripePayment = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/pagos/crear-sesion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear sesión de pago')
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaypalPayment = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/pagos/crear-orden-paypal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear orden PayPal')
      }

      const data = await response.json()
      setPaypalOrder(data)
      window.open(data.approvalUrl, '_blank')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleManualPayment = async () => {
    if (!window.confirm('¿Estás seguro de que deseas confirmar esta orden sin pago?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/pagos/confirmar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al confirmar orden')
      }

      const data = await response.json()
      alert(`Orden confirmada exitosamente. ID de orden: ${data.ordenId}`)
      navigate('/ordenes')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === 'stripe') {
      handleStripePayment()
    } else if (paymentMethod === 'paypal') {
      handlePaypalPayment()
    } else {
      handleManualPayment()
    }
  }

  if (carrito.items.length === 0) {
    return null
  }

  return (
    <div className="pagos-container">
      <div className="pagos-header">
        <h1>Proceso de Pago</h1>
        <p>Resumen de tu compra</p>
      </div>

      <div className="pagos-content">
        <div className="payment-image">
          <img src={paymentImage} alt="Proceso de Pago" className="payment-main-image" />
        </div>

        <div className="carrito-resumen">
          <h3>Resumen del Carrito</h3>
          {carrito.items.map(item => (
            <div key={item.id} className="resumen-item">
              <span>{item.nombre} (x{item.cantidad})</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="resumen-total">
            <strong>Total: ${carrito.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Método de Pago</h3>
          
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Tarjeta de Crédito (Stripe)</span>
                <span className="option-desc">Pago seguro con tarjeta</span>
              </div>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">PayPal</span>
                <span className="option-desc">Pago con PayPal</span>
              </div>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="manual"
                checked={paymentMethod === 'manual'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Pago Manual</span>
                <span className="option-desc">Confirmar orden sin proceso de pago</span>
              </div>
            </label>
          </div>

          <div className="payment-icons">
            <img src={paymentIcons} alt="Métodos de Pago" className="payment-icons-image" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="payment-actions">
            <button onClick={() => navigate('/carrito')} className="btn-secondary">
              Volver al Carrito
            </button>
            <button 
              onClick={handlePayment} 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Realizar Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagos