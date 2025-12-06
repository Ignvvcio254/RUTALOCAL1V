"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MapMarkers } from "./map-markers"
import { LocationCard } from "./location-card"

export function HeroSection() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <div className="h-[60vh] flex overflow-hidden">
      {/* Left Content Area */}
      <div className="w-2/5 bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-8 md:p-12">
        <div className="max-w-md w-full space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight text-balance">Descubre Santiago Auténtico</h1>
            <p className="text-lg text-gray-600 leading-relaxed text-pretty">
              Conecta con emprendimientos locales y vive experiencias únicas
            </p>
          </div>

          {/* AI Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-white rounded-xl p-4 flex items-center gap-3 shadow-lg">
              <Search className="w-5 h-5 text-indigo-500" />
              <input
                type="text"
                placeholder="¿Qué experiencia buscas?"
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {["☕ Cafés", "🎨 Arte", "🏠 Hostales"].map((pill) => (
              <button
                key={pill}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explorar Mapa
          </Button>
        </div>
      </div>

      {/* Right Map Area */}
      <div className="w-3/5 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-500 opacity-20" />

        {/* Map Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Animated Map Markers */}
        <MapMarkers isAnimating={isAnimating} />

        {/* Floating Location Card */}
        <LocationCard />
      </div>
    </div>
  )
}
