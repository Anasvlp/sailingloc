import React from 'react'
import { motion } from 'framer-motion'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Politique de confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Collecte des informations
              </h2>
              <p className="text-gray-600 mb-4">
                Nous collectons les informations que vous nous fournissez directement, notamment :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Informations de compte (nom, email, téléphone)</li>
                <li>Informations de profil et préférences</li>
                <li>Informations de paiement (traitées par Stripe)</li>
                <li>Communications avec notre support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Utilisation des informations
              </h2>
              <p className="text-gray-600 mb-4">
                Nous utilisons vos informations pour :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter vos réservations et paiements</li>
                <li>Communiquer avec vous</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Partage des informations
              </h2>
              <p className="text-gray-600 mb-4">
                Nous ne vendons pas vos informations personnelles. Nous pouvons les partager dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Avec les propriétaires de bateaux pour vos réservations</li>
                <li>Avec nos prestataires de services (paiement, support)</li>
                <li>Pour respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Sécurité des données
              </h2>
              <p className="text-gray-600 mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Vos droits
              </h2>
              <p className="text-gray-600 mb-4">
                Vous avez le droit de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Accéder à vos informations personnelles</li>
                <li>Corriger ou mettre à jour vos informations</li>
                <li>Supprimer votre compte</li>
                <li>Vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Contact
              </h2>
              <p className="text-gray-600">
                Pour toute question concernant cette politique de confidentialité, contactez-nous à :
                <br />
                Email : privacy@sailingloc.fr
                <br />
                Adresse : 123 Rue de la Marine, 13000 Marseille, France
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy