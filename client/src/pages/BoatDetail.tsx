import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  Anchor, 
  Wifi, 
  Car, 
  Coffee,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Clock
} from 'lucide-react'
import { boatsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import BookingForm from '../components/booking/BookingForm'
import ReviewsList from '../components/reviews/ReviewsList'
import ImageGallery from '../components/ui/ImageGallery'
import BoatMap from '../components/map/BoatMap'

const BoatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'reviews' | 'location'>('overview')

  const { data: boat, isLoading, error } = useQuery(
    ['boat', id],
    () => boatsAPI.getBoat(id!),
    {
      enabled: !!id
    }
  )

  const handleBooking = (bookingData: any) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/checkout/${id}`, { state: { bookingData } })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !boat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bateau introuvable</h2>
          <p className="text-gray-600 mb-4">Ce bateau n'existe pas ou n'est plus disponible</p>
          <button
            onClick={() => navigate('/boats')}
            className="btn-primary"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    )
  }

  const boatData = boat.data

  const equipmentIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Cuisine': Coffee,
    'Ancre': Anchor,
    'GPS': MapPin
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {boatData.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="font-medium">{boatData.avgRatings?.overall || 'Nouveau'}</span>
                {boatData.reviewCount > 0 && (
                  <span>({boatData.reviewCount} avis)</span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{boatData.location.name}, {boatData.location.country}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share className="h-5 w-5" />
              <span className="hidden sm:inline">Partager</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-5 w-5" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {boatData.images && boatData.images.length > 0 ? (
            <ImageGallery 
              images={boatData.images} 
              alt={boatData.title}
              onShowAll={() => setShowAllPhotos(true)}
            />
          ) : (
            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
              <Anchor className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {boatData.category} proposé par {boatData.owner.firstName}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{boatData.capacity} passagers</span>
                  {boatData.cabins && <span>• {boatData.cabins} cabines</span>}
                  {boatData.bathrooms && <span>• {boatData.bathrooms} salles de bain</span>}
                  <span>• {boatData.length}m</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {boatData.owner.avatar ? (
                  <img
                    src={boatData.owner.avatar}
                    alt={boatData.owner.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {boatData.owner.firstName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Aperçu' },
                  { id: 'amenities', label: 'Équipements' },
                  { id: 'reviews', label: 'Avis' },
                  { id: 'location', label: 'Localisation' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{boatData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Anchor className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">{boatData.brand} {boatData.model}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Année {boatData.year}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">{boatData.capacity} passagers max</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">{boatData.length}m de long</span>
                      </div>
                    </div>
                  </div>

                  {boatData.rules && boatData.rules.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Règles du bateau</h3>
                      <ul className="space-y-2">
                        {boatData.rules.map((rule: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'amenities' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipements disponibles</h3>
                  {boatData.equipment && boatData.equipment.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {boatData.equipment.map((item: string, index: number) => {
                        const IconComponent = equipmentIcons[item] || Award
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary-600" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">Aucun équipement spécifique mentionné.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewsList boatId={boatData.id} reviews={boatData.reviews} avgRatings={boatData.avgRatings} />
              )}

              {activeTab === 'location' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
                  <BoatMap 
                    boats={[boatData]} 
                    className="h-64 w-full rounded-lg mb-4"
                  />
                  <p className="text-gray-600">
                    {boatData.location.name}, {boatData.location.region && `${boatData.location.region}, `}{boatData.location.country}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm 
                boat={boatData}
                onBook={handleBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoatDetail