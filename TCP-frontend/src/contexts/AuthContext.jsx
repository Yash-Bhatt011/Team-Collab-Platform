import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUser(data.user)
          } else {
            // Use saved user data if verification endpoint doesn't work as expected
            setUser(JSON.parse(savedUser))
          }
        } else {
          // Clear invalid auth data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Try to use saved user data as fallback
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (userData) => {
    try {
      // Store auth data
      localStorage.setItem('token', userData.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return userData
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}