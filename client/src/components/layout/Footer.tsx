import React from 'react'
import { Link } from 'react-router-dom'
import { Anchor, Mail, Phone, MapPin } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Anchor className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SailingLoc</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              La plateforme de référence pour la location de bateaux entre particuliers. 
              Découvrez les plus belles destinations nautiques de France.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@sailingloc.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/boats" className="text-gray-300 hover:text-white transition-colors">
                  Découvrir
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Devenir propriétaire
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SailingLoc. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-sm mt-4 md:mt-0">
            <MapPin className="h-4 w-4" />
            <span>Fabriqué en France avec ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer