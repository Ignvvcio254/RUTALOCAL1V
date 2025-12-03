"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { MapLegend } from "./map-legend"
import { MapControls } from "./map-controls"
import { BusinessInfoPopup } from "./business-info-popup"

const MapComponent = dynamic(() => import("./map-component"), { ssr: false })

interface MapViewContainerProps {
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

export function MapViewContainer({ selectedBusiness, onSelectBusiness, filters }: MapViewContainerProps) {
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: -51.2093 })
  const [zoom, setZoom] = useState(13)
  const [showLegend, setShowLegend] = useState(true)
  const mapRef = useRef(null)

  return (
    <div className="relative w-full h-full">
      <MapComponent
        ref={mapRef}
        center={mapCenter}
        zoom={zoom}
        selectedBusiness={selectedBusiness}
        onSelectBusiness={onSelectBusiness}
        filters={filters}
      />

      {/* Top-left: Legend */}
      <div className="absolute top-4 left-4 z-40">{showLegend && <MapLegend />}</div>

      {/* Top-right: GPS button */}
      <div className="absolute top-4 right-4 z-40">
        <MapControls onZoomIn={() => setZoom((z) => z + 1)} onZoomOut={() => setZoom((z) => z - 1)} />
      </div>

      {/* Selected business popup */}
      {selectedBusiness && <BusinessInfoPopup businessId={selectedBusiness} onClose={() => onSelectBusiness(null)} />}
    </div>
  )
}
