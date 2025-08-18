import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Anchor, 
  Menu, 
  X, 
  User, 
  Heart, 
  Settings, 
  LogOut,
  Plus,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Anchor className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-xl font-bold gradient-text">SailingLoc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/boats"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/boats') ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Découvrir
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/about') ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              À propos
            </Link>
            
            {isAuthenticated && user?.role === 'SELLER' && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un bateau</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Mon profil</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Mes réservations</span>
                      </Link>

                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>Administration</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <div className="space-y-3">
                <Link
                  to="/boats"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Découvrir
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  À propos
                </Link>
                
                {!isAuthenticated && (
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block btn-primary text-sm text-center"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar