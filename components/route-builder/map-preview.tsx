"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Maximize2, Minimize2 } from "lucide-react"
import type { RouteItem } from "./route-builder-container"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Token de Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiaWdudmN2Y2lvMjU0IiwiYSI6ImNtNW80Y2t1cjBrNzkybXNkZDlpamR2amsifQ.L1F2oAPdkGkIDiJFA56QNw'

interface MapPreviewProps {
  items: RouteItem[]
  title: string
}

export function MapPreview({ items, title }: MapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Centro por defecto: Santiago, Chile
  const defaultCenter: [number, number] = [-70.6506, -33.4372]

  const calculateCenter = (): [number, number] => {
    if (items.length === 0) {
      return defaultCenter
    }

    const avgLng = items.reduce((sum, item) => sum + item.lng, 0) / items.length
    const avgLat = items.reduce((sum, item) => sum + item.lat, 0) / items.length
    return [avgLng, avgLat]
  }

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

  const getColor = (category: string) => {
    return categoryColors[category.toLowerCase()] || "#6366f1"
  }

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: calculateCenter(),
      zoom: items.length > 0 ? 13 : 12,
      attributionControl: false,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Actualizar marcadores y ruta cuando cambian los items
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Limpiar ruta anterior
    if (map.current.getSource("route")) {
      map.current.removeLayer("route-line")
      map.current.removeSource("route")
    }

    if (items.length === 0) {
      map.current.flyTo({
        center: defaultCenter,
        zoom: 12,
        duration: 1000
      })
      return
    }

    // Agregar marcadores
    items.forEach((item, index) => {
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

      const marker = new mapboxgl.Marker(el)
        .setLngLat([item.lng, item.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })

    // Dibujar línea de ruta
    if (items.length > 1) {
      const coordinates = items.map(item => [item.lng, item.lat])

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
    if (items.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      items.forEach(item => {
        bounds.extend([item.lng, item.lat])
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
        duration: 1000
      })
    }
  }, [items, mapLoaded])

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
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Placeholder when empty */}
        {items.length === 0 && (
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
