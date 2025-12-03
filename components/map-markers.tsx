"use client"

import { MapPin } from "lucide-react"

interface MapMarkersProps {
  isAnimating: boolean
}

export function MapMarkers({ isAnimating }: MapMarkersProps) {
  const markers = [
    { id: 1, x: 15, y: 20, color: "from-red-500 to-red-600" },
    { id: 2, x: 35, y: 35, color: "from-emerald-500 to-emerald-600" },
    { id: 3, x: 60, y: 25, color: "from-blue-500 to-blue-600" },
    { id: 4, x: 75, y: 55, color: "from-amber-500 to-amber-600" },
    { id: 5, x: 45, y: 70, color: "from-pink-500 to-pink-600" },
    { id: 6, x: 20, y: 65, color: "from-violet-500 to-violet-600" },
  ]

  return (
    <div className="absolute inset-0">
      {markers.map((marker) => (
        <div
          key={marker.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
            isAnimating ? "animate-in fade-in zoom-in duration-500" : ""
          }`}
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            animation: isAnimating ? `floatingMarker${marker.id} 4s ease-in-out infinite` : "none",
          }}
        >
          {/* Outer Pulse Ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Marker Pin */}
          <div
            className={`relative w-12 h-12 bg-gradient-to-br ${marker.color} rounded-full shadow-lg flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-200`}
          >
            <div className="absolute inset-1 bg-white/20 rounded-full" />
            <MapPin className="w-6 h-6 text-white" />
          </div>

          {/* Pulse Animation */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${marker.color} opacity-40 animate-pulse`} />
        </div>
      ))}

      <style jsx>{`
        @keyframes floatingMarker1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes floatingMarker2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        @keyframes floatingMarker3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        @keyframes floatingMarker4 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-7px); }
        }
        @keyframes floatingMarker5 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-9px); }
        }
        @keyframes floatingMarker6 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
