import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Heart, 
  MessageSquare, 
  Settings, 
  Plus,
  BarChart3,
  Anchor,
  MapPin,
  Users,
  Star,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import { boatsAPI, bookingsAPI, usersAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MessageCenter from '../components/messaging/MessageCenter'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'boats' | 'messages' | 'profile'>('bookings')

  const { data: bookings, isLoading: bookingsLoading } = useQuery(
    ['user-bookings'],
    () => bookingsAPI.getBookings({ userId: user?.id }),
    { enabled: !!user }
  )

  const { data: favorites, isLoading: favoritesLoading } = useQuery(
    ['user-favorites'],
    () => usersAPI.getFavorites(),
    { enabled: !!user }
  )

  const { data: userBoats, isLoading: boatsLoading } = useQuery(
    ['user-boats'],
    () => boatsAPI.getBoats({ ownerId: user?.id }),
    { enabled: !!user && (user.role === 'SELLER' || user.role === 'ADMIN') }
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée'
      case 'PENDING': return 'En attente'
      case 'CANCELLED': return 'Annulée'
      case 'COMPLETED': return 'Terminée'
      default: return status
    }
  }

  const tabs = [
    { id: 'bookings', label: 'Mes réservations', icon: Calendar },
    { id: 'favorites', label: 'Mes favoris', icon: Heart },
    ...(user?.role === 'SELLER' || user?.role === 'ADMIN' ? [
      { id: 'boats', label: 'Mes bateaux', icon: Anchor }
    ] : []),
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profil', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.firstName} !
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos réservations et découvrez de nouvelles aventures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes réservations</h2>
                  </div>

                  {bookingsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : bookings?.data?.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.data.map((booking: any) => (
                        <div key={booking.id} className="card p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex space-x-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                {booking.boat.images?.[0] ? (
                                  <img
                                    src={booking.boat.images[0]}
                                    alt={booking.boat.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Anchor className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{booking.boat.title}</h3>
                                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{booking.boat.location.name}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                  <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                  <span>{booking.guestCount} passagers</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                {getStatusLabel(booking.status)}
                              </span>
                              <p className="text-lg font-semibold text-gray-900 mt-2">
                                {formatPrice(booking.totalPrice)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Vous n'avez pas encore de réservation.</p>
                      <button className="btn-primary">
                        Découvrir les bateaux
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes favoris</h2>
                  </div>

                  {favoritesLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : favorites?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.data.map((favorite: any) => (
                        <div key={favorite.id} className="card-hover">
                          <div className="aspect-4-3 relative overflow-hidden rounded-t-xl">
                            {favorite.boat.images?.[0] ? (
                              <img
                                src={favorite.boat.images[0]}
                                alt={favorite.boat.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Anchor className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{favorite.boat.title}</h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{favorite.boat.location.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(favorite.boat.pricePerDay)}/jour
                              </span>
                              <button className="text-red-500 hover:text-red-600">
                                <Heart className="h-5 w-5 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori</h3>
                      <p className="text-gray-600 mb-6">Ajoutez des bateaux à vos favoris pour les retrouver facilement.</p>
                      <button className="btn-primary">
                        Découvrir les bateaux
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Boats Tab (Sellers only) */}
              {activeTab === 'boats' && (user?.role === 'SELLER' || user?.role === 'ADMIN') && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes bateaux</h2>
                    <button className="btn-primary flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Ajouter un bateau</span>
                    </button>
                  </div>

                  {boatsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : userBoats?.data?.boats?.length > 0 ? (
                    <div className="space-y-4">
                      {userBoats.data.boats.map((boat: any) => (
                        <div key={boat.id} className="card p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex space-x-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                {boat.images?.[0] ? (
                                  <img
                                    src={boat.images[0]}
                                    alt={boat.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Anchor className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{boat.title}</h3>
                                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{boat.location.name}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4" />
                                    <span>{boat.capacity} pers.</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4" />
                                    <span>{boat.avgRating || 'Nouveau'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(boat.pricePerDay)}/jour
                              </span>
                              <div className="flex items-center space-x-1">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Anchor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bateau</h3>
                      <p className="text-gray-600 mb-6">Ajoutez votre premier bateau pour commencer à louer.</p>
                      <button className="btn-primary flex items-center space-x-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        <span>Ajouter un bateau</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  </div>
                  <MessageCenter />
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mon profil</h2>
                  </div>
                  <div className="card p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-gray-600">{user?.email}</p>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-2">
                          {user?.role === 'SELLER' ? 'Propriétaire' : 'Locataire'}
                        </span>
                      </div>
                    </div>
                    <button className="btn-primary">
                      Modifier mon profil
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard