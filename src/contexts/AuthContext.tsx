import { createContext, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// Simple in-memory storage for demo purposes
const users: Record<string, User & { password: string }> = {}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const register = useCallback(async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    // Check if user already exists
    if (users[data.email]) {
      throw new Error('User already exists')
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      password: data.password, // In a real app, this should be hashed
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user'
    }

    users[data.email] = newUser

    // Set user in state (excluding password)
    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    navigate('/')
  }, [navigate])

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const user = users[credentials.email]
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials')
    }

    const { password, ...userWithoutPassword } = user
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    navigate('/')
  }, [navigate])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}