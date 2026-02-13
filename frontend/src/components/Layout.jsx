import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Layout.css'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            E-Commerce App
          </Link>
          
          <div className="nav-menu">
            <Link to="/" className="nav-link">Productos</Link>
            <Link to="/carrito" className="nav-link">Carrito</Link>
            <Link to="/pagos" className="nav-link">Pagos</Link>
            <Link to="/ordenes" className="nav-link">Mis Ordenes</Link>
            
            {user?.nivel === 'admin' && (
              <Link to="/admin/productos" className="nav-link">Admin Productos</Link>
            )}
          </div>

          <div className="nav-user">
            <span className="user-info">Hola, {user?.nombre}</span>
            <span className="user-role">{user?.nivel}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout