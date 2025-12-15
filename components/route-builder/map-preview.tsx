"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Maximize2, Minimize2, Loader2 } from "lucide-react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { env } from '@/lib/env'
import type { RouteItem } from "./route-builder-container"

// Token de Mapbox desde env
const MAPBOX_TOKEN = env.maps.mapboxToken

interface MapPreviewProps {
  items: RouteItem[]
  title: string
}

/**
 * MapPreview - Componente para previsualizar rutas en un mapa
 * Muestra marcadores numerados y líneas de conexión entre paradas
 */
export function MapPreview({ items, title }: MapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Centro por defecto: Santiago, Chile
  const defaultCenter: [number, number] = [env.maps.defaultCenter.lng, env.maps.defaultCenter.lat]

  const categoryColors: Record<string, string> = {
    "café": "#f97316",
    "cafetería": "#f97316",
    "gastronomía": "#ef4444",
    "restaurante": "#ef4444",
    "arte": "#a855f7",
    "tour": "#3b82f6",
    "turismo": "#3b82f6",
    "hostal": "#10b981",
    "hospedaje": "#10b981",
    "hotel": "#10b981",
  }

  const getColor = useCallback((category: string) => {
    return categoryColors[category.toLowerCase()] || "#6366f1"
  }, [])

  // Calcular centro basado en items
  const calculateCenter = useCallback((): [number, number] => {
    if (items.length === 0) {
      return defaultCenter
    }

    const validItems = items.filter(item => 
      item.lng && item.lat && 
      !isNaN(item.lng) && !isNaN(item.lat)
    )

    if (validItems.length === 0) {
      return defaultCenter
    }

    const avgLng = validItems.reduce((sum, item) => sum + item.lng, 0) / validItems.length
    const avgLat = validItems.reduce((sum, item) => sum + item.lat, 0) / validItems.length
    return [avgLng, avgLat]
  }, [items])

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('🗺️ [MapPreview] Initializing map...')
    console.log('🗺️ [MapPreview] Container exists:', !!mapContainer.current)
    console.log('🗺️ [MapPreview] Token length:', MAPBOX_TOKEN?.length || 0)
    console.log('🗺️ [MapPreview] Items count:', items.length)

    // Configurar token
    mapboxgl.accessToken = MAPBOX_TOKEN

    const center = calculateCenter()
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: items.length > 0 ? 13 : 12,
        attributionControl: false,
      })

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      map.current.on("load", () => {
        console.log('🗺️ [MapPreview] Map loaded successfully')
        console.log('🗺️ [MapPreview] Container dimensions:', mapContainer.current?.offsetWidth, 'x', mapContainer.current?.offsetHeight)
        console.log('🗺️ [MapPreview] Token valid:', !!MAPBOX_TOKEN && MAPBOX_TOKEN.length > 20)
        setMapLoaded(true)
        setIsLoading(false)
      })

      map.current.on("error", (e) => {
        console.error("🗺️ [MapPreview] Mapbox error:", e)
        setIsLoading(false)
      })
    } catch (error) {
      console.error('🗺️ [MapPreview] Error initializing map:', error)
      setIsLoading(false)
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      setMapLoaded(false)
    }
  }, [])

  // Actualizar marcadores y ruta cuando cambian los items
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Limpiar ruta anterior
    try {
      if (map.current.getSource("route")) {
        if (map.current.getLayer("route-line")) {
          map.current.removeLayer("route-line")
        }
        map.current.removeSource("route")
      }
    } catch (e) {
      // Ignorar errores de limpieza
    }

    if (items.length === 0) {
      map.current.flyTo({
        center: defaultCenter,
        zoom: 12,
        duration: 1000
      })
      return
    }

    // Filtrar items con coordenadas válidas
    const validItems = items.filter(item => 
      item.lng && item.lat && 
      !isNaN(item.lng) && !isNaN(item.lat)
    )

    if (validItems.length === 0) return

    // Agregar marcadores
    validItems.forEach((item, index) => {
      const el = document.createElement("div")
      el.className = "route-marker"
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: ${getColor(item.category)};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          ${index + 1}
        </div>
      `

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <strong>${item.name}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
            ${item.category} • ${item.duration}
          </p>
        </div>
      `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([item.lng, item.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })

    // Dibujar línea de ruta
    if (validItems.length > 1) {
      const coordinates = validItems.map(item => [item.lng, item.lat])

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates
          }
        }
      })

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#6366f1",
          "line-width": 4,
          "line-dasharray": [2, 2]
        }
      })
    }

    // Ajustar vista para mostrar todos los puntos
    if (validItems.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      validItems.forEach(item => {
        bounds.extend([item.lng, item.lat])
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
        duration: 1000
      })
    }
  }, [items, mapLoaded, getColor])

  return (
    <div className={`h-full flex flex-col bg-gray-100 relative ${isExpanded ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {items.length > 0 && (
            <p className="text-xs text-gray-500">{items.length} paradas en la ruta</p>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-500">Cargando mapa...</p>
            </div>
          </div>
        )}
        
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Placeholder when empty */}
        {items.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
            <div className="text-center">
              <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Agrega lugares para ver la ruta</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {items.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(categoryColors).slice(0, 4).map(([category, color]) => (
              <div key={category} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-600 capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
