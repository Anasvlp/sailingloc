import React from 'react'
import { motion } from 'framer-motion'
import { Anchor, Users, Shield, Award, Heart, Compass } from 'lucide-react'

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Tous nos bateaux sont vérifiés et assurés. Vos données sont protégées.'
    },
    {
      icon: Users,
      title: 'Communauté de confiance',
      description: 'Propriétaires et locataires vérifiés pour des échanges en toute sérénité.'
    },
    {
      icon: Award,
      title: 'Service d\'excellence',
      description: 'Support client 7j/7 et assistance technique pour vos navigations.'
    },
    {
      icon: Heart,
      title: 'Passion maritime',
      description: 'Créé par des passionnés de navigation pour partager l\'amour de la mer.'
    }
  ]

  const team = [
    {
      name: 'Pierre Martin',
      role: 'Fondateur & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Skipper professionnel depuis 15 ans, Pierre a créé SailingLoc pour démocratiser l\'accès à la navigation.'
    },
    {
      name: 'Marie Dubois',
      role: 'Directrice Technique',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Experte en développement web et passionnée de voile, Marie assure la qualité de notre plateforme.'
    },
    {
      name: 'Thomas Leroy',
      role: 'Responsable Communauté',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ancien moniteur de voile, Thomas veille à la satisfaction de notre communauté de navigateurs.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Anchor className="h-16 w-16 text-white mx-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              À propos de SailingLoc
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Nous connectons les passionnés de navigation avec les propriétaires de bateaux 
              pour créer des expériences maritimes inoubliables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                SailingLoc est née de la conviction que la navigation doit être accessible à tous. 
                Nous croyons que chacun devrait pouvoir vivre la liberté et la beauté de la mer, 
                que ce soit pour une journée ou une semaine d'évasion.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Notre plateforme met en relation les propriétaires de bateaux avec des navigateurs 
                passionnés, créant une communauté basée sur la confiance, le partage et l'amour 
                de la mer.
              </p>
              <div className="flex items-center space-x-2 text-primary-600">
                <Compass className="h-5 w-5" />
                <span className="font-medium">Depuis 2020, plus de 10 000 navigations réalisées</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Navigation en mer"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à offrir la meilleure expérience de location de bateaux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des passionnés de navigation au service de votre expérience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Rejoignez l'aventure SailingLoc
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Que vous soyez propriétaire de bateau ou passionné de navigation, 
              notre communauté vous attend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors">
                Louer un bateau
              </button>
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Proposer mon bateau
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About