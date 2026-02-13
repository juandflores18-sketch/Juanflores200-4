import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Productos from './pages/Productos'
import Carrito from './pages/Carrito'
import Pagos from './pages/Pagos'
import Ordenes from './pages/Ordenes'
import AdminProductos from './pages/AdminProductos'
import './App.css'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Cargando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && user.nivel !== requiredRole) {
    return <Navigate to="/" />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Productos />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="ordenes" element={<Ordenes />} />
              <Route path="admin/productos" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProductos />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App