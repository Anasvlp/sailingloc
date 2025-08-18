import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Anchor } from 'lucide-react'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Boat {
  id: string
  title: string
  pricePerDay: number
  location: {
    name: string
    latitude: number
    longitude: number
  }
  images?: string[]
}

interface BoatMapProps {
  boats: Boat[]
  onBoatSelect?: (boat: Boat) => void
  selectedBoat?: Boat | null
  className?: string
}

const BoatMap: React.FC<BoatMapProps> = ({ 
  boats, 
  onBoatSelect, 
  selectedBoat, 
  className = "h-96 w-full rounded-lg" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6) // Center of France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add markers for boats
    boats.forEach(boat => {
      if (!boat.location.latitude || !boat.location.longitude) return

      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div class="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        `,
        className: 'custom-boat-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const marker = L.marker([boat.location.latitude, boat.location.longitude], {
        icon: customIcon
      }).addTo(mapInstanceRef.current!)

      // Add popup
      const popupContent = `
        <div class="p-2 min-w-48">
          <h3 class="font-semibold text-gray-900 mb-2">${boat.title}</h3>
          <p class="text-sm text-gray-600 mb-2">${boat.location.name}</p>
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-primary-600">
              ${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
              }).format(boat.pricePerDay)}/jour
            </span>
            <button 
              onclick="window.selectBoat('${boat.id}')"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
            >
              Voir
            </button>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Handle marker click
      marker.on('click', () => {
        onBoatSelect?.(boat)
      })

      markersRef.current.push(marker)
    })

    // Fit map to show all markers
    if (boats.length > 0) {
      const group = new L.FeatureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [boats, onBoatSelect])

  // Highlight selected boat
  useEffect(() => {
    if (!selectedBoat || !mapInstanceRef.current) return

    const selectedMarker = markersRef.current.find((marker, index) => 
      boats[index]?.id === selectedBoat.id
    )

    if (selectedMarker) {
      selectedMarker.openPopup()
      mapInstanceRef.current.setView(
        [selectedBoat.location.latitude, selectedBoat.location.longitude], 
        12
      )
    }
  }, [selectedBoat, boats])

  // Global function for popup buttons
  useEffect(() => {
    (window as any).selectBoat = (boatId: string) => {
      const boat = boats.find(b => b.id === boatId)
      if (boat) {
        onBoatSelect?.(boat)
      }
    }

    return () => {
      delete (window as any).selectBoat
    }
  }, [boats, onBoatSelect])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}

export default BoatMap