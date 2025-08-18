import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Anchor, Home } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <Anchor className="h-24 w-24 text-primary-600 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page introuvable
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas. 
            Elle a peut-être été déplacée ou supprimée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <Home className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            Ou{' '}
            <Link to="/boats" className="text-primary-600 hover:text-primary-500">
              découvrez nos bateaux
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound