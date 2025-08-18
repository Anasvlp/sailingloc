import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Grid } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
  onShowAll?: () => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt, onShowAll }) => {
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main image */}
        <div 
          className="col-span-2 row-span-2 relative overflow-hidden rounded-l-xl cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Side images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden cursor-pointer ${
              index === 1 ? 'rounded-tr-xl' : ''
            } ${index === 3 ? 'rounded-br-xl' : ''}`}
            onClick={() => {
              setCurrentIndex(index + 1)
              setShowModal(true)
            }}
          >
            <img
              src={image}
              alt={`${alt} ${index + 2}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Grid className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">+{images.length - 5} photos</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Show all button */}
        {images.length > 1 && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Grid className="h-4 w-4" />
            <span>Voir toutes les photos</span>
          </button>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Image */}
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery