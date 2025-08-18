import React, { useState } from 'react'
import { Calendar, Users, Shield, CreditCard } from 'lucide-react'

interface BookingFormProps {
  boat: {
    id: string
    title: string
    pricePerDay: number
    deposit: number
    capacity: number
  }
  onBook: (bookingData: any) => void
}

const BookingForm: React.FC<BookingFormProps> = ({ boat, onBook }) => {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    message: ''
  })

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = calculateDays()
  const subtotal = days * boat.pricePerDay
  const serviceFee = subtotal * 0.1 // 10% service fee
  const total = subtotal + serviceFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBook({
      ...bookingData,
      boatId: boat.id,
      totalPrice: total,
      deposit: boat.deposit
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(boat.pricePerDay)}
          </span>
          <span className="text-gray-600">/ jour</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                required
                value={bookingData.startDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                required
                value={bookingData.endDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passagers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="input-field pl-10 text-sm"
            >
              {[...Array(boat.capacity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'passager' : 'passagers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message au propriétaire (optionnel)
          </label>
          <textarea
            value={bookingData.message}
            onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Présentez-vous et décrivez votre projet de navigation..."
            rows={3}
            className="input-field text-sm resize-none"
          />
        </div>

        {/* Price breakdown */}
        {days > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatPrice(boat.pricePerDay)} × {days} jour{days > 1 ? 's' : ''}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frais de service</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {boat.deposit > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <Shield className="h-4 w-4" />
                <span>Caution: {formatPrice(boat.deposit)}</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!bookingData.startDate || !bookingData.endDate || days <= 0}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="h-4 w-4" />
          <span>Réserver maintenant</span>
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Vous ne serez débité qu'après confirmation de la réservation
      </p>
    </div>
  )
}

export default BookingForm