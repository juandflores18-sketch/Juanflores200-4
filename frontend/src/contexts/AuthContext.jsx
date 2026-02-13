import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = 'http://localhost:3000/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/perfil`)
      setUser(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      logout()
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const { token, usuario } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(usuario)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (nombre, email, password, nivel = 'usuario') => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE}/auth/registro`, { nombre, email, password, nivel })
      const { token, usuario } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(usuario)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al registrar usuario'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}