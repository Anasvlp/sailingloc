import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Users, Heart, Anchor } from 'lucide-react'

interface BoatCardProps {
  boat: {
    id: string
    title: string
    images: string[]
    location: {
      name: string
      country: string
    }
    category: string
    capacity: number
    pricePerDay: number
    avgRating?: number
    reviewCount?: number
  }
  layout?: 'grid' | 'list' | 'compact'
}

const BoatCard: React.FC<BoatCardProps> = ({ boat, layout = 'grid' }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'SAILBOAT': 'Voilier',
      'CATAMARAN': 'Catamaran',
      'MOTORBOAT': 'Bateau moteur',
      'RIB': 'Semi-rigide'
    }
    return labels[category] || category
  }

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card-hover"
      >
        <Link to={`/boats/${boat.id}`} className="block">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 aspect-video md:aspect-square relative overflow-hidden">
              {boat.images && boat.images.length > 0 ? (
                <img
                  src={boat.images[0]}
                  alt={boat.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Anchor className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {getCategoryLabel(boat.category)}
                  </span>
                  {boat.avgRating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{boat.avgRating}</span>
                      {boat.reviewCount && (
                        <span className="text-sm text-gray-500">({boat.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {boat.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{boat.location.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{boat.capacity} pers.</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(boat.pricePerDay)}
                  </span>
                  <span className="text-gray-600"> / jour</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  if (layout === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card-hover"
      >
        <Link to={`/boats/${boat.id}`} className="block">
          <div className="flex space-x-4">
            <div className="w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
              {boat.images && boat.images.length > 0 ? (
                <img
                  src={boat.images[0]}
                  alt={boat.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Anchor className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-primary-600">
                  {getCategoryLabel(boat.category)}
                </span>
                {boat.avgRating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className="text-xs font-medium">{boat.avgRating}</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                {boat.title}
              </h3>
              
              <p className="text-xs text-gray-600 mb-2">
                {boat.location.name} • {boat.capacity} pers.
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(boat.pricePerDay)}/j
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Default grid layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-hover"
    >
      <Link to={`/boats/${boat.id}`} className="block">
        <div className="aspect-4-3 relative overflow-hidden rounded-t-xl">
          {boat.images && boat.images.length > 0 ? (
            <img
              src={boat.images[0]}
              alt={boat.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Anchor className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              {getCategoryLabel(boat.category)}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{boat.location.name}</span>
            </div>
            {boat.avgRating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="text-sm font-medium">{boat.avgRating}</span>
                {boat.reviewCount && (
                  <span className="text-sm text-gray-500">({boat.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {boat.title}
          </h3>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <Users className="h-4 w-4" />
            <span>{boat.capacity} passagers</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(boat.pricePerDay)}
              </span>
              <span className="text-gray-600"> / jour</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BoatCard