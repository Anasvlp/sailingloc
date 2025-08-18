import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { Filter, Map, Grid, List, Star, MapPin, Users, Calendar } from 'lucide-react'
import { boatsAPI } from '../services/api'
import SearchForm from '../components/search/SearchForm'
import BoatCard from '../components/boats/BoatCard'
import BoatMap from '../components/map/BoatMap'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const BoatList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const searchFilters = {
    location: searchParams.get('location') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined,
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    sortBy: searchParams.get('sortBy') || 'recent',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: 12
  }

  const { data, isLoading, error } = useQuery(
    ['boats', searchFilters],
    () => boatsAPI.getBoats(searchFilters),
    {
      keepPreviousData: true
    }
  )

  const handleSearch = (params: any) => {
    const newSearchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.append(key, value as string)
      }
    })
    
    setSearchParams(newSearchParams)
  }

  const handleSortChange = (sortBy: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortBy', sortBy)
    setSearchParams(newParams)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les bateaux</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchForm onSearch={handleSearch} initialValues={searchFilters} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {data?.total ? `${data.total} bateaux disponibles` : 'Recherche de bateaux'}
            </h1>
            {searchFilters.location && (
              <p className="text-gray-600">
                à {searchFilters.location}
                {searchFilters.startDate && searchFilters.endDate && (
                  <span> • du {new Date(searchFilters.startDate).toLocaleDateString()} au {new Date(searchFilters.endDate).toLocaleDateString()}</span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Sort */}
            <select
              value={searchFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-field text-sm"
            >
              <option value="recent">Plus récents</option>
              <option value="price">Prix croissant</option>
              <option value="rating">Mieux notés</option>
              <option value="popular">Plus populaires</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-outline text-sm"
            >
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Results */}
        {data && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.boats.map((boat: any) => (
                  <BoatCard key={boat.id} boat={boat} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-6">
                {data.boats.map((boat: any) => (
                  <BoatCard key={boat.id} boat={boat} layout="list" />
                ))}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.boats.map((boat: any) => (
                    <BoatCard key={boat.id} boat={boat} layout="compact" />
                  ))}
                </div>
                <div className="sticky top-0">
                  <BoatMap 
                    boats={data.boats} 
                    className="h-96 w-full rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Pagination */}
            {data.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {[...Array(data.pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.set('page', (i + 1).toString())
                        setSearchParams(newParams)
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.pagination.page === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {data.boats.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun bateau trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche ou vos dates.
                  </p>
                  <button
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="btn-primary"
                  >
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BoatList