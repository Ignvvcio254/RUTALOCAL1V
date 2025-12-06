"use client"

import { forwardRef, useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import MarkerClusterGroup from "react-leaflet-cluster"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { MOCK_BUSINESSES, type Business } from "@/lib/mock-data"

interface MapComponentProps {
  center: { lat: number; lng: number }
  zoom: number
  selectedBusiness: string | null
  onSelectBusiness: (id: string | null) => void
  filters: {
    category: string
    distance: number
    rating: number
    priceRange: number
    openNow: boolean
  }
}

const MapComponent = forwardRef<L.Map, MapComponentProps>(
  ({ center, zoom, selectedBusiness, onSelectBusiness, filters }, ref) => {
    const [markers, setMarkers] = useState<Business[]>([])

    useEffect(() => {
      // Filter businesses based on criteria
      const filtered = MOCK_BUSINESSES.filter((business) => {
        if (filters.category !== "todos" && business.category !== filters.category) return false
        if (business.rating < filters.rating) return false
        if (business.priceRange > filters.priceRange) return false
        if (filters.openNow && !business.isOpen) return false
        return true
      })
      setMarkers(filtered)
    }, [filters])

    const getCategoryColor = (category: string) => {
      const colors: Record<string, string> = {
        café: "#F97316",
        arte: "#A855F7",
        tour: "#3B82F6",
        hostal: "#10B981",
      }
      return colors[category] || "#6B7280"
    }

    const createCustomIcon = (category: string, isSelected: boolean) => {
      return L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 ${isSelected ? "animate-pulse" : ""}" style="
              width: 40px;
              height: 40px;
              background: ${getCategoryColor(category)};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              transform: translate(-50%, -50%);
            ">
              ${category === "café" ? "☕" : category === "arte" ? "🎨" : category === "tour" ? "🗺️" : "🏠"}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        className: "",
      })
    }

    return (
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} className="w-full h-full" ref={ref}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {markers.map((business) => (
            <Marker
              key={business.id}
              position={[business.lat, business.lng]}
              icon={createCustomIcon(business.category, selectedBusiness === business.id)}
              eventHandlers={{
                click: () => {
                  onSelectBusiness(business.id)
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="text-sm text-muted-foreground">{business.distance}km away</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    )
  },
)

MapComponent.displayName = "MapComponent"

export default MapComponent
