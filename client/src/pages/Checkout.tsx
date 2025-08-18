import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  Shield, 
  Calendar, 
  Users, 
  MapPin, 
  Anchor,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useQuery } from 'react-query'
import { boatsAPI, paymentsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...')

interface CheckoutFormProps {
  boat: any
  bookingData: any
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ boat, bookingData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const response = await paymentsAPI.createPaymentIntent({
          ...bookingData,
          boatId: boat.id
        })
        setClientSecret(response.data.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        toast.error('Erreur lors de la préparation du paiement')
      }
    }

    createPaymentIntent()
  }, [boat.id, bookingData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
          },
        },
      })

      if (error) {
        setPaymentError(error.message || 'Erreur de paiement')
        toast.error(error.message || 'Erreur de paiement')
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Paiement réussi ! Réservation confirmée.')
        navigate('/dashboard?tab=bookings')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError('Une erreur est survenue lors du paiement')
      toast.error('Une erreur est survenue lors du paiement')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDays = () => {
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = calculateDays()
  const subtotal = days * boat.pricePerDay
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Booking Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmer et payer</h1>
            <p className="text-gray-600">Votre voyage vous attend !</p>
          </div>

          {/* Boat Info */}
          <div className="card p-6">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {boat.images && boat.images[0] ? (
                  <img
                    src={boat.images[0]}
                    alt={boat.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Anchor className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{boat.title}</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{boat.location.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{bookingData.guests} passagers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Détail des prix</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{formatPrice(boat.pricePerDay)} × {days} jour{days > 1 ? 's' : ''}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service SailingLoc</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {boat.deposit > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Caution de {formatPrice(boat.deposit)} (pré-autorisée, non débitée)</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Politique d'annulation</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Annulation gratuite jusqu'à 48h avant le départ</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>50% de remboursement entre 48h et 24h avant</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>Aucun remboursement moins de 24h avant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Informations de paiement</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carte bancaire
                </label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{paymentError}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Vos informations de paiement sont sécurisées par Stripe</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Confirmer et payer {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-xs text-gray-500 text-center">
            En confirmant cette réservation, vous acceptez les{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-500">
              conditions d'utilisation
            </a>{' '}
            de SailingLoc et la{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-500">
              politique de confidentialité
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  )
}

const Checkout: React.FC = () => {
  const { boatId } = useParams<{ boatId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  
  const bookingData = location.state?.bookingData

  const { data: boat, isLoading, error } = useQuery(
    ['boat', boatId],
    () => boatsAPI.getBoat(boatId!),
    {
      enabled: !!boatId
    }
  )

  useEffect(() => {
    if (!bookingData) {
      navigate('/boats')
    }
  }, [bookingData, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !boat || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les informations de réservation</p>
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

  return (
    <Elements stripe={stripePromise}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckoutForm boat={boat.data} bookingData={bookingData} />
      </motion.div>
    </Elements>
  )
}

export default Checkout