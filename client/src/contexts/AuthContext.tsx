import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'VISITOR' | 'USER' | 'SELLER' | 'ADMIN'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authAPI.getCurrentUser()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.data.user, token }
          })
        } catch (error) {
          localStorage.removeItem('token')
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.register(userData)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}