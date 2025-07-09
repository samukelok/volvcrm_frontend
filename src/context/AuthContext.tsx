import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Define the type
interface AuthContextType {
  user: any | null
}

// Create a properly typed context (nullable at first)
const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/me', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Use with null check
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}