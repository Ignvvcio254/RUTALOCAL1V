'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { env } from '@/lib/env'
import { MAP_BUSINESSES, MAP_CATEGORIES, type MapBusiness } from '@/lib/mapbox-data'
import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Initialize Mapbox
mapboxgl.accessToken = env.maps.mapboxToken

interface MapboxMapProps {
  selectedBusinessId?: string
  onBusinessSelect?: (business: MapBusiness) => void
  filteredBusinesses?: MapBusiness[]
}

export function MapboxMap({
  selectedBusinessId,
  onBusinessSelect,
  filteredBusinesses = MAP_BUSINESSES
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [env.maps.defaultCenter.lng, env.maps.defaultCenter.lat],
      zoom: env.maps.defaultZoom,
      pitch: 45, // 3D view angle
      bearing: 0,
      antialias: true, // Smooth 3D buildings
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add 3D buildings layer
    map.current.on('load', () => {
      const layers = map.current!.getStyle().layers
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id

      // Add 3D building extrusions
      map.current!.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      )
    })

    // Request geolocation
    requestGeolocation()

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when filtered businesses change
  useEffect(() => {
    if (!map.current) return

    // Remove old markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    filteredBusinesses.forEach(business => {
      const category = MAP_CATEGORIES[business.category as keyof typeof MAP_CATEGORIES]
      const isVerified = business.verified
      const isSelected = business.id === selectedBusinessId

      // Create marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.innerHTML = `
        <div class="relative ${isSelected ? 'scale-125 z-50' : ''} transition-transform duration-200">
          ${isSelected ? `
            <div class="absolute inset-0 -m-4">
              <div class="w-16 h-16 rounded-full bg-indigo-400 opacity-75 animate-ping"></div>
            </div>
            <div class="absolute inset-0 -m-2">
              <div class="w-14 h-14 rounded-full bg-indigo-300 opacity-50 animate-ping animation-delay-75"></div>
            </div>
          ` : ''}
          <div class="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all ${
            isSelected
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-4 ring-indigo-200'
              : isVerified
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 ring-2 ring-yellow-300 animate-pulse'
                : 'bg-white ring-2 ring-gray-300'
          }" style="background-color: ${!isVerified && !isSelected ? category.color : ''}">
            <span class="text-xl">${category.icon}</span>
          </div>
          ${isVerified && !isSelected ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' : ''}
          ${isSelected ? '<div class="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center ring-2 ring-white"><span class="text-white text-xs font-bold">★</span></div>' : ''}
        </div>
      `

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">${business.name}</h3>
          <div class="flex items-center gap-1 text-xs text-gray-600 mb-1">
            <span>${'⭐'.repeat(Math.floor(business.rating))}</span>
            <span>${business.rating}</span>
          </div>
          <div class="text-xs text-gray-500">${business.category} • ${'$'.repeat(business.priceRange)}</div>
          <div class="text-xs text-gray-500">${business.distance}km</div>
          ${business.verified ? '<div class="text-xs text-yellow-600 font-semibold mt-1">✓ Verificado</div>' : ''}
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([business.lng, business.lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Click handler
      el.addEventListener('click', () => {
        onBusinessSelect?.(business)
      })

      markers.current.push(marker)
    })
  }, [filteredBusinesses, selectedBusinessId, onBusinessSelect])

  // Fly to selected business
  useEffect(() => {
    if (!map.current || !selectedBusinessId) return

    const business = filteredBusinesses.find(b => b.id === selectedBusinessId)
    if (business) {
      map.current.flyTo({
        center: [business.lng, business.lat],
        zoom: 16,
        pitch: 60,
        duration: 1500,
      })
    }
  }, [selectedBusinessId, filteredBusinesses])

  const requestGeolocation = () => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([longitude, latitude])

        // Fly to user location
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 2000,
        })

        // Add user location marker
        new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat([longitude, latitude])
          .addTo(map.current!)
      },
      (error) => {
        console.log('Geolocation denied or unavailable', error)
      }
    )
  }

  const goToUserLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 1000,
      })
    } else {
      requestGeolocation()
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* User Location Button */}
      <Button
        onClick={goToUserLocation}
        className="absolute bottom-6 right-6 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  )
}
