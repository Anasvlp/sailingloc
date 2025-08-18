import React, { useState } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchFormProps {
  onSearch: (params: SearchParams) => void
  initialValues?: Partial<SearchParams>
}

interface SearchParams {
  location?: string
  startDate?: string
  endDate?: string
  guests?: number
  category?: string
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialValues = {} }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: initialValues.location || '',
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    guests: initialValues.guests || 1,
    category: initialValues.category || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  const handleInputChange = (field: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const popularLocations = [
    'Martinique', 'Corse', 'Côte d\'Azur', 'Bretagne', 'Marseille', 'Nice', 'Cannes'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Où souhaitez-vous naviguer ?"
                value={searchParams.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="input-field pl-10"
                list="locations"
              />
              <datalist id="locations">
                {popularLocations.map(location => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Départ
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retour
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={searchParams.startDate || new Date().toISOString().split('T')[0]}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passagers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={searchParams.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className="input-field pl-10"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'personne' : 'personnes'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de bateau
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '', label: 'Tous' },
              { value: 'SAILBOAT', label: 'Voilier' },
              { value: 'CATAMARAN', label: 'Catamaran' },
              { value: 'MOTORBOAT', label: 'Bateau moteur' },
              { value: 'RIB', label: 'Semi-rigide' }
            ].map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleInputChange('category', category.value)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  searchParams.category === category.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Rechercher</span>
        </button>
      </form>
    </motion.div>
  )
}

export default SearchForm