import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Anchor, 
  Calendar, 
  Star,
  TrendingUp,
  DollarSign,
  MapPin,
  Shield,
  Settings
} from 'lucide-react'
import { useQuery } from 'react-query'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery('admin-stats', adminAPI.getStats)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(stats?.data?.revenue || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% ce mois</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.bookings || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-600">+8% ce mois</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.users || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-purple-600">+15% ce mois</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bateaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.boats || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Anchor className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-600">+5% ce mois</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des réservations</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique à implémenter</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinations populaires</h3>
          <div className="space-y-3">
            {[
              { name: 'Martinique', bookings: 45, percentage: 85 },
              { name: 'Corse', bookings: 38, percentage: 72 },
              { name: 'Côte d\'Azur', bookings: 32, percentage: 60 },
              { name: 'Bretagne', bookings: 28, percentage: 53 }
            ].map((destination, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{destination.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${destination.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{destination.bookings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-4">
          {[
            { type: 'booking', message: 'Nouvelle réservation pour "Catamaran Lagoon 42"', time: 'Il y a 2h' },
            { type: 'user', message: 'Nouvel utilisateur inscrit: Marie Dubois', time: 'Il y a 4h' },
            { type: 'boat', message: 'Nouveau bateau ajouté: "Voilier Beneteau 40"', time: 'Il y a 6h' },
            { type: 'review', message: 'Nouvel avis 5 étoiles sur "Bavaria 46"', time: 'Il y a 8h' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-full">
                {activity.type === 'booking' && <Calendar className="h-4 w-4 text-blue-600" />}
                {activity.type === 'user' && <Users className="h-4 w-4 text-green-600" />}
                {activity.type === 'boat' && <Anchor className="h-4 w-4 text-orange-600" />}
                {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AdminUsers: React.FC = () => {
  const { data: users, isLoading } = useQuery('admin-users', () => adminAPI.getUsers())

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.data?.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'Admin' : user.role === 'SELLER' ? 'Vendeur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isVerified ? 'Vérifié' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      Modifier
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Suspendre
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: BarChart3, current: currentPath === '/admin' },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users, current: currentPath === '/admin/users' },
    { name: 'Bateaux', href: '/admin/boats', icon: Anchor, current: currentPath === '/admin/boats' },
    { name: 'Réservations', href: '/admin/bookings', icon: Calendar, current: currentPath === '/admin/bookings' },
    { name: 'Avis', href: '/admin/reviews', icon: Star, current: currentPath === '/admin/reviews' },
    { name: 'Modération', href: '/admin/moderation', icon: Shield, current: currentPath === '/admin/moderation' },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings, current: currentPath === '/admin/settings' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Gérez votre plateforme SailingLoc</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<AdminStats />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/boats" element={<div>Gestion des bateaux (à implémenter)</div>} />
                <Route path="/bookings" element={<div>Gestion des réservations (à implémenter)</div>} />
                <Route path="/reviews" element={<div>Gestion des avis (à implémenter)</div>} />
                <Route path="/moderation" element={<div>Modération (à implémenter)</div>} />
                <Route path="/settings" element={<div>Paramètres (à implémenter)</div>} />
              </Routes>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard