import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Only redirect if we're on the login page
    if (location.pathname === '/') {
      navigate(userData.role === 'admin' ? '/admin' : '/employee', { replace: true })
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const isAdmin = () => user?.role === 'admin'
  const isEmployee = () => user?.role === 'employee'

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
    isEmployee
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext 