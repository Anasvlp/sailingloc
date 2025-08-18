import React from 'react'
import { Star, User } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  cleanliness: number
  accuracy: number
  communication: number
  location: number
  value: number
  createdAt: string
  user: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

interface ReviewsListProps {
  boatId: string
  reviews: Review[]
  avgRatings: {
    overall: number
    cleanliness: number
    accuracy: number
    communication: number
    location: number
    value: number
  }
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, avgRatings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const ratingCategories = [
    { key: 'cleanliness', label: 'Propreté' },
    { key: 'accuracy', label: 'Conformité' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Emplacement' },
    { key: 'value', label: 'Rapport qualité-prix' }
  ]

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 fill-current text-yellow-400" />
            <span className="text-2xl font-bold">{avgRatings.overall}</span>
          </div>
          <span className="text-gray-600">
            {reviews.length} avis
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ratingCategories.map(category => (
            <div key={category.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{category.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(avgRatings[category.key as keyof typeof avgRatings] / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">
                  {avgRatings[category.key as keyof typeof avgRatings]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.user.firstName} {review.user.lastName[0]}.
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun avis pour le moment
            </h3>
            <p className="text-gray-600">
              Soyez le premier à laisser un avis sur ce bateau !
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsList