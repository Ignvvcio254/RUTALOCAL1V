"use client"

import { MapPin, Maximize2 } from "lucide-react"
import type { RouteItem } from "./route-builder-container"

interface MapPreviewProps {
  items: RouteItem[]
  title: string
}

export function MapPreview({ items, title }: MapPreviewProps) {
  const calculateCenter = () => {
    if (items.length === 0) {
      return { lat: -33.8688, lng: -51.2093 }
    }

    const avgLat = items.reduce((sum, item) => sum + item.lat, 0) / items.length
    const avgLng = items.reduce((sum, item) => sum + item.lng, 0) / items.length
    return { lat: avgLat, lng: avgLng }
  }

  const center = calculateCenter()

  const categoryColors = {
    café: "#f97316",
    arte: "#a855f7",
    tour: "#3b82f6",
    hostal: "#10b981",
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />
        </svg>

        {/* Map Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" className="absolute">
            {/* Draw route lines */}
            {items.length > 1 && (
              <g>
                {items.map((item, index) => {
                  if (index < items.length - 1) {
                    const nextItem = items[index + 1]
                    const x1 = 50 + (item.lng - center.lng) * 100
                    const y1 = 50 + (item.lat - center.lat) * 100
                    const x2 = 50 + (nextItem.lng - center.lng) * 100
                    const y2 = 50 + (nextItem.lat - center.lat) * 100

                    return (
                      <line
                        key={`line-${index}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )
                  }
                })}
              </g>
            )}

            {/* Draw markers */}
            {items.map((item, index) => {
              const x = 50 + (item.lng - center.lng) * 100
              const y = 50 + (item.lat - center.lat) * 100
              const color = categoryColors[item.category as keyof typeof categoryColors]

              return (
                <g key={`marker-${index}`}>
                  {/* Marker circle */}
                  <circle cx={`${x}%`} cy={`${y}%`} r="12" fill={color} opacity="0.9" />
                  {/* Step number */}
                  <text
                    x={`${x}%`}
                    y={`${y}%`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {index + 1}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Placeholder when empty */}
          {items.length === 0 && (
            <div className="text-center z-10">
              <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Agrega lugares para ver el mapa</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-600">LEYENDA</p>
        <div className="space-y-1 text-xs">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-600">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expand Button */}
      <button className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow z-10">
        <Maximize2 size={18} className="text-gray-600" />
      </button>
    </div>
  )
}
