import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // API call to update profile would go here
      updateUser(formData)
      setIsEditing(false)
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-flex px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full mt-2">
                {user?.role === 'SELLER' ? 'Propriétaire' : user?.role === 'ADMIN' ? 'Administrateur' : 'Locataire'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Votre numéro de téléphone"
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          firstName: user?.firstName || '',
                          lastName: user?.lastName || '',
                          email: user?.email || '',
                          phone: user?.phone || ''
                        })
                      }}
                      className="btn-outline"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Sauvegarder</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Modifier le profil
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile