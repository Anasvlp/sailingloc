import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
  }) => api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  refreshToken: () => api.post('/auth/refresh'),
}

// Boats API
export const boatsAPI = {
  getBoats: (params?: any) => api.get('/boats', { params }),
  
  getBoat: (id: string) => api.get(`/boats/${id}`),
  
  createBoat: (boatData: any) => api.post('/boats', boatData),
  
  updateBoat: (id: string, boatData: any) => api.put(`/boats/${id}`, boatData),
  
  deleteBoat: (id: string) => api.delete(`/boats/${id}`),
  
  getLocations: () => api.get('/boats/locations/all'),
}

// Bookings API
export const bookingsAPI = {
  getBookings: (params?: any) => api.get('/bookings', { params }),
  
  getBooking: (id: string) => api.get(`/bookings/${id}`),
  
  createBooking: (bookingData: any) => api.post('/bookings', bookingData),
  
  updateBooking: (id: string, bookingData: any) => api.put(`/bookings/${id}`, bookingData),
  
  cancelBooking: (id: string) => api.delete(`/bookings/${id}`),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  
  getFavorites: () => api.get('/users/favorites'),
  
  addFavorite: (boatId: string) => api.post('/users/favorites', { boatId }),
  
  removeFavorite: (boatId: string) => api.delete(`/users/favorites/${boatId}`),
  
  getMessages: () => api.get('/users/messages'),
  
  sendMessage: (messageData: any) => api.post('/users/messages', messageData),
}

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (bookingData: any) => api.post('/payments/create-intent', bookingData),
  
  confirmPayment: (paymentIntentId: string) => api.post('/payments/confirm', { paymentIntentId }),
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  
  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  
  getBoats: (params?: any) => api.get('/admin/boats', { params }),
  
  moderateBoat: (id: string, action: string) => api.post(`/admin/boats/${id}/moderate`, { action }),
  
  getBookings: (params?: any) => api.get('/admin/bookings', { params }),
  
  getReviews: (params?: any) => api.get('/admin/reviews', { params }),
  
  moderateReview: (id: string, action: string) => api.post(`/admin/reviews/${id}/moderate`, { action }),
}

export default api