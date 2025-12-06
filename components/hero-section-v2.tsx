"use client"

import { useState } from "react"
import { Search, Coffee, Palette, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSectionV2() {
  const [searchQuery, setSearchQuery] = useState("")

  const quickFilters = [
    { icon: Coffee, label: "Cafés", emoji: "☕" },
    { icon: Palette, label: "Arte", emoji: "🎨" },
    { icon: Home, label: "Hostales", emoji: "🏠" },
  ]

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center px-6 py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Emoji/Icon */}
        <div className="animate-in fade-in duration-700">
          <span className="text-7xl">🗺️</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-in fade-in duration-700 delay-150">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Descubre Santiago Auténtico
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Conecta con emprendimientos locales y vive experiencias únicas
          </p>
        </div>

        {/* Search Bar */}
        <div className="animate-in fade-in duration-700 delay-300">
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 group-focus-within:opacity-50 transition-opacity" />
            <div className="relative bg-white rounded-2xl p-5 flex items-center gap-4 shadow-xl border border-gray-100">
              <Search className="w-6 h-6 text-indigo-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="¿Qué experiencia buscas hoy?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Buscar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-700 delay-450">
          {quickFilters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.label}
                className="group px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{filter.emoji}</span>
                  <span>{filter.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
