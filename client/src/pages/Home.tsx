import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users, Star, Anchor } from 'lucide-react'
import SearchForm from '../components/search/SearchForm'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleSearch = (searchParams: any) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value as string)
      }
    })
    
    navigate(`/boats?${queryParams.toString()}`)
  }

  const popularDestinations = [
    {
      name: 'Martinique',
      image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800',
      boats: 45,
      description: 'Eaux cristallines des Caraïbes'
    },
    {
      name: 'Corse',
      image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
      boats: 38,
      description: 'Île de beauté méditerranéenne'
    },
    {
      name: 'Côte d\'Azur',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
      boats: 52,
      description: 'Glamour de la Riviera française'
    },
    {
      name: 'Bretagne',
      image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
      boats: 29,
      description: 'Côtes sauvages et authentiques'
    }
  ]

  const features = [
    {
      icon: Search,
      title: 'Recherche facile',
      description: 'Trouvez le bateau parfait avec nos filtres avancés'
    },
    {
      icon: Star,
      title: 'Qualité garantie',
      description: 'Tous nos bateaux sont vérifiés et notés par la communauté'
    },
    {
      icon: MapPin,
      title: 'Partout en France',
      description: 'Des centaines de destinations dans toute la France'
    },
    {
      icon: Users,
      title: 'Communauté de confiance',
      description: 'Propriétaires et locataires vérifiés'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Naviguez vers
              <span className="block gradient-text bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                l'aventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto text-balance">
              Découvrez et louez les plus beaux bateaux de France. 
              Votre prochaine escapade maritime vous attend.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <SearchForm onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Destinations populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez les plus belles destinations nautiques de France
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => navigate(`/boats?location=${destination.name}`)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-4-3 mb-4">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm text-gray-200">{destination.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-900">
                      {destination.boats} bateaux
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SailingLoc ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plateforme de référence pour la location de bateaux entre particuliers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Anchor className="h-16 w-16 text-white mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à larguer les amarres ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de navigateurs qui ont déjà trouvé leur bonheur sur SailingLoc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/boats')}
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Découvrir les bateaux
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Devenir propriétaire
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home