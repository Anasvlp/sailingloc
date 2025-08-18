import React from 'react'
import { motion } from 'framer-motion'

const TermsOfService: React.FC = () => {
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
            Conditions d'utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-600 mb-4">
                En utilisant SailingLoc, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description du service
              </h2>
              <p className="text-gray-600 mb-4">
                SailingLoc est une plateforme de mise en relation entre propriétaires de bateaux et locataires. 
                Nous facilitons les réservations mais ne sommes pas propriétaires des bateaux listés.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Inscription et compte utilisateur
              </h2>
              <p className="text-gray-600 mb-4">
                Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>La confidentialité de votre mot de passe</li>
                <li>L'exactitude des informations fournies</li>
                <li>Toutes les activités sous votre compte</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Réservations et paiements
              </h2>
              <p className="text-gray-600 mb-4">
                Les réservations sont soumises à la disponibilité et à l'acceptation du propriétaire. 
                Les paiements sont traités de manière sécurisée par Stripe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Annulations et remboursements
              </h2>
              <p className="text-gray-600 mb-4">
                Les politiques d'annulation varient selon les propriétaires :
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Flexible : Remboursement complet jusqu'à 24h avant</li>
                <li>Modérée : Remboursement complet jusqu'à 5 jours avant</li>
                <li>Stricte : Remboursement complet jusqu'à 14 jours avant</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Responsabilités
              </h2>
              <p className="text-gray-600 mb-4">
                Les utilisateurs sont responsables de leur comportement sur la plateforme et lors des locations. 
                SailingLoc n'est pas responsable des dommages ou incidents survenus pendant les locations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 mb-4">
                Le contenu de SailingLoc est protégé par les droits d'auteur. 
                Vous ne pouvez pas reproduire, distribuer ou modifier notre contenu sans autorisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contact
              </h2>
              <p className="text-gray-600">
                Pour toute question concernant ces conditions, contactez-nous à :
                <br />
                Email : legal@sailingloc.fr
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

export default TermsOfService