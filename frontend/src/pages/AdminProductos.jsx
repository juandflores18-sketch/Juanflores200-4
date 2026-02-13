import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AdminProductos.css'

const AdminProductos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    precio: '',
    descripcion: '',
    imagen: ''
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user?.nivel === 'admin') {
      fetchProductos()
    }
  }, [user])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/productos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar productos')
      }

      const data = await response.json()
      setProductos(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingProduct 
        ? `http://localhost:3000/api/productos/${editingProduct.codigo}`
        : 'http://localhost:3000/api/productos'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al ${editingProduct ? 'actualizar' : 'crear'} producto`)
      }

      const data = await response.json()
      
      if (editingProduct) {
        setProductos(prev => prev.map(p => p.id === data.id ? data : p))
        setEditingProduct(null)
      } else {
        setProductos(prev => [...prev, data])
      }
      
      setFormData({ nombre: '', codigo: '', precio: '', descripcion: '' })
      setShowForm(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio.toString(),
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (codigo) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/productos/${codigo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar producto')
      }

      setProductos(prev => prev.filter(p => p.codigo !== codigo))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setFormData({ nombre: '', codigo: '', precio: '', descripcion: '', imagen: '' })
    setShowForm(false)
  }

  if (loading) return <div className="loading">Cargando productos...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-productos-container">
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Agregar Producto
        </button>
      </div>

      {showForm && (
        <div className="producto-form">
          <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Código</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                disabled={editingProduct}
              />
            </div>
            
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>URL de Imagen</label>
              <input
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="productos-list">
        {productos.map(producto => (
          <div key={producto.id} className="producto-card">
            {producto.imagen && (
              <div className="producto-image">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
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
                onClick={() => handleEdit(producto)}
                className="btn-edit"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(producto.codigo)}
                className="btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProductos