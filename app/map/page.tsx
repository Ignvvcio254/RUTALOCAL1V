"use client"

import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Clock,
  X,
  Navigation,
  Heart,
  Phone,
  Share2,
  ArrowLeft,
  Locate,
  Plus,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import Link from "next/link"

const BUSINESSES = [
  {
    id: "1",
    name: "Café de la Plaza",
    category: "cafe",
    rating: 4.8,
    reviewCount: 234,
    distance: 0.3,
    deliveryTime: "15-20",
    image: "/cozy-artisan-coffee-shop-interior-warm-lighting.jpg",
    isOpen: true,
    closesAt: "22:00",
    priceRange: 2,
    address: "Av. Providencia 2124",
    tags: ["Wi-Fi", "Pet Friendly", "Terraza"],
    lat: 45,
    lng: 32,
    featured: true,
  },
  {
    id: "2",
    name: "Galería Arte Vivo",
    category: "arte",
    rating: 4.9,
    reviewCount: 89,
    distance: 0.5,
    deliveryTime: "Reservar",
    image: "/modern-art-gallery-white-walls-paintings.jpg",
    isOpen: true,
    closesAt: "19:00",
    priceRange: 3,
    address: "Merced 349, Lastarria",
    tags: ["Exposiciones", "Talleres", "Tienda"],
    lat: 62,
    lng: 48,
    featured: true,
  },
  {
    id: "3",
    name: "Walking Tours Santiago",
    category: "tour",
    rating: 4.9,
    reviewCount: 512,
    distance: 0.8,
    deliveryTime: "2h tour",
    image: "/santiago-chile-city-tour-guide-group-walking.jpg",
    isOpen: true,
    closesAt: "18:00",
    priceRange: 2,
    address: "Plaza de Armas",
    tags: ["Guía Local", "Historia", "Gratis propina"],
    lat: 28,
    lng: 65,
    featured: false,
  },
  {
    id: "4",
    name: "Hostal Bellavista",
    category: "hostal",
    rating: 4.6,
    reviewCount: 178,
    distance: 1.2,
    deliveryTime: "Check-in 14:00",
    image: "/boutique-hostel-colorful-rooms-bellavista-chile.jpg",
    isOpen: true,
    closesAt: "23:00",
    priceRange: 1,
    address: "Pío Nono 156, Bellavista",
    tags: ["Desayuno", "Bar", "Terraza"],
    lat: 75,
    lng: 25,
    featured: false,
  },
  {
    id: "5",
    name: "Tostadores Locales",
    category: "cafe",
    rating: 4.7,
    reviewCount: 156,
    distance: 1.5,
    deliveryTime: "10-15",
    image: "/specialty-coffee-roasters-barista-pouring-latte.jpg",
    isOpen: true,
    closesAt: "20:00",
    priceRange: 2,
    address: "Av. Italia 1449",
    tags: ["Specialty", "Brunch", "Vegano"],
    lat: 55,
    lng: 72,
    featured: false,
  },
  {
    id: "6",
    name: "Taller Cerámica Andina",
    category: "arte",
    rating: 4.5,
    reviewCount: 67,
    distance: 2.1,
    deliveryTime: "3h clase",
    image: "/pottery-ceramics-workshop-hands-clay-wheel.jpg",
    isOpen: true,
    closesAt: "19:00",
    priceRange: 2,
    address: "José Victorino Lastarria 307",
    tags: ["Workshop", "Souvenirs", "Grupos"],
    lat: 38,
    lng: 55,
    featured: false,
  },
]

const CATEGORIES = [
  { id: "todos", label: "Todos", icon: "🗺️" },
  { id: "cafe", label: "Cafés", icon: "☕" },
  { id: "arte", label: "Arte", icon: "🎨" },
  { id: "tour", label: "Tours", icon: "🚶" },
  { id: "hostal", label: "Hostales", icon: "🏠" },
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; marker: string }> = {
  cafe: { bg: "bg-amber-50", text: "text-amber-700", marker: "bg-amber-500" },
  arte: { bg: "bg-violet-50", text: "text-violet-700", marker: "bg-violet-500" },
  tour: { bg: "bg-sky-50", text: "text-sky-700", marker: "bg-sky-500" },
  hostal: { bg: "bg-emerald-50", text: "text-emerald-700", marker: "bg-emerald-500" },
}

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    distance: 5,
    rating: 0,
    openNow: false,
    priceRange: 3,
  })
  const [hoveredBusiness, setHoveredBusiness] = useState<string | null>(null)

  const filteredBusinesses = BUSINESSES.filter((b) => {
    if (selectedCategory !== "todos" && b.category !== selectedCategory) return false
    if (b.rating < filters.rating) return false
    if (filters.openNow && !b.isOpen) return false
    if (b.priceRange > filters.priceRange) return false
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const selectedBusinessData = BUSINESSES.find((b) => b.id === selectedBusiness)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>

          {/* Search bar - Uber Eats style */}
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-3">
              <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <Input
                placeholder="Buscar cafés, tours, arte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-gray-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-200 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "rounded-full border-gray-200 h-10 w-10",
              showFilters && "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:text-white",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Category chips - horizontal scroll */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm",
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Expandable filters panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Distancia máx.</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[filters.distance]}
                    onValueChange={(v) => setFilters({ ...filters, distance: v[0] })}
                    max={10}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{filters.distance}km</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Calificación</label>
                <div className="flex gap-1">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters({ ...filters, rating: r })}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        filters.rating === r ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {r === 0 ? "Todas" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Precio</label>
                <div className="flex gap-1">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilters({ ...filters, priceRange: p })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        filters.priceRange >= p
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {"$".repeat(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">Abierto ahora</label>
                <Switch checked={filters.openNow} onCheckedChange={(v) => setFilters({ ...filters, openNow: v })} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content - Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Results list */}
        <div className="w-full md:w-[420px] flex-shrink-0 bg-white overflow-y-auto border-r border-gray-100">
          {/* Results count */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> lugares encontrados
              </p>
              <select className="text-sm bg-transparent border-0 text-gray-600 font-medium cursor-pointer focus:ring-0">
                <option>Más cercanos</option>
                <option>Mejor valorados</option>
                <option>Populares</option>
              </select>
            </div>
          </div>

          {/* Business cards */}
          <div className="divide-y divide-gray-100">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                onClick={() => setSelectedBusiness(business.id)}
                onMouseEnter={() => setHoveredBusiness(business.id)}
                onMouseLeave={() => setHoveredBusiness(null)}
                className={cn(
                  "flex gap-4 p-4 cursor-pointer transition-all",
                  selectedBusiness === business.id ? "bg-indigo-50" : "hover:bg-gray-50",
                )}
              >
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={business.image || "/placeholder.svg"}
                    alt={business.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                  {business.featured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] px-2 py-0.5 rounded-full border-0">
                      Destacado
                    </Badge>
                  )}
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                          CATEGORY_COLORS[business.category]?.bg,
                          CATEGORY_COLORS[business.category]?.text,
                        )}
                      >
                        {CATEGORIES.find((c) => c.id === business.category)?.icon}
                        {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900">{business.rating}</span>
                      <span className="text-gray-500">({business.reviewCount})</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{business.distance}km</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{"$".repeat(business.priceRange)}</span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 truncate">{business.address}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span
                        className={cn("text-xs font-medium", business.isOpen ? "text-emerald-600" : "text-red-500")}
                      >
                        {business.isOpen ? `Abierto • Cierra ${business.closesAt}` : "Cerrado"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {business.deliveryTime}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5 mt-2 overflow-hidden">
                    {business.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map placeholder - Professional SVG map */}
        <div className="hidden md:flex flex-1 relative bg-gray-100">
          {/* SVG Map with markers */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Map background with streets */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="#f3f4f6" />
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Main roads */}
              <path d="M 0 50 L 100 50" stroke="#d1d5db" strokeWidth="2" />
              <path d="M 50 0 L 50 100" stroke="#d1d5db" strokeWidth="2" />
              <path d="M 20 0 L 80 100" stroke="#e5e7eb" strokeWidth="1" />
              <path d="M 0 30 L 100 70" stroke="#e5e7eb" strokeWidth="1" />

              {/* Parks/green areas */}
              <ellipse cx="25" cy="75" rx="12" ry="8" fill="#dcfce7" opacity="0.6" />
              <ellipse cx="78" cy="20" rx="10" ry="6" fill="#dcfce7" opacity="0.6" />
            </svg>

            {/* Business markers */}
            {filteredBusinesses.map((business, index) => (
              <div
                key={business.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{ left: `${business.lat}%`, top: `${business.lng}%` }}
                onClick={() => setSelectedBusiness(business.id)}
              >
                {/* Marker */}
                <div
                  className={cn(
                    "relative transition-all duration-200",
                    (selectedBusiness === business.id || hoveredBusiness === business.id) && "scale-125 z-20",
                  )}
                >
                  {/* Pulse animation for selected */}
                  {selectedBusiness === business.id && (
                    <div className="absolute inset-0 -m-2">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full animate-ping opacity-30",
                          CATEGORY_COLORS[business.category]?.marker,
                        )}
                      />
                    </div>
                  )}

                  {/* Marker pin */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
                      CATEGORY_COLORS[business.category]?.marker,
                      selectedBusiness === business.id && "ring-4 ring-indigo-200",
                    )}
                  >
                    <span className="text-lg">{CATEGORIES.find((c) => c.id === business.category)?.icon}</span>
                  </div>

                  {/* Pin point */}
                  <div
                    className={cn(
                      "absolute left-1/2 -bottom-2 w-3 h-3 rotate-45 -translate-x-1/2 border-r-2 border-b-2 border-white",
                      CATEGORY_COLORS[business.category]?.marker,
                    )}
                  />

                  {/* Hover tooltip */}
                  <div
                    className={cn(
                      "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
                      selectedBusiness === business.id && "opacity-100",
                    )}
                  >
                    <div className="bg-white rounded-lg shadow-xl px-3 py-2 text-sm">
                      <p className="font-semibold text-gray-900">{business.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {business.rating} • {business.distance}km
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="bg-white shadow-md hover:bg-gray-50 h-10 w-10">
              <Locate className="w-4 h-4" />
            </Button>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-none border-b">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-none">
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-medium text-gray-700">{filteredBusinesses.length} negocios activos</span>
            </div>
          </div>

          {/* Selected business detail card */}
          {selectedBusinessData && (
            <div className="absolute bottom-6 left-6 right-6 max-w-md animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Image header */}
                <div className="relative h-40">
                  <img
                    src={selectedBusinessData.image || "/placeholder.svg"}
                    alt={selectedBusinessData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => setSelectedBusiness(null)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-4 right-4">
                    <Badge
                      className={cn(
                        "mb-2",
                        CATEGORY_COLORS[selectedBusinessData.category]?.bg,
                        CATEGORY_COLORS[selectedBusinessData.category]?.text,
                      )}
                    >
                      {CATEGORIES.find((c) => c.id === selectedBusinessData.category)?.icon}{" "}
                      {selectedBusinessData.category.toUpperCase()}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">{selectedBusinessData.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-lg">{selectedBusinessData.rating}</span>
                        <span className="text-sm text-gray-500">({selectedBusinessData.reviewCount})</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{selectedBusinessData.distance}km</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{"$".repeat(selectedBusinessData.priceRange)}</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        selectedBusinessData.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          selectedBusinessData.isOpen ? "bg-emerald-500" : "bg-red-500",
                        )}
                      />
                      {selectedBusinessData.isOpen ? "Abierto" : "Cerrado"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedBusinessData.address}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedBusinessData.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl h-11">
                      <Navigation className="w-4 h-4 mr-2" />
                      Cómo llegar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-xl border-gray-200 bg-transparent"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-xl border-gray-200 bg-transparent"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-xl border-gray-200 bg-transparent"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Bottom sheet for selected business */}
      {selectedBusinessData && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
            {/* Handle */}
            <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content - same as desktop card */}
            <div className="px-4 pb-6">
              <div className="flex gap-4">
                <img
                  src={selectedBusinessData.image || "/placeholder.svg"}
                  alt={selectedBusinessData.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <Badge
                    className={cn(
                      "mb-1",
                      CATEGORY_COLORS[selectedBusinessData.category]?.bg,
                      CATEGORY_COLORS[selectedBusinessData.category]?.text,
                    )}
                  >
                    {selectedBusinessData.category.toUpperCase()}
                  </Badge>
                  <h3 className="font-bold text-lg">{selectedBusinessData.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{selectedBusinessData.rating}</span>
                    <span className="text-gray-500">• {selectedBusinessData.distance}km</span>
                  </div>
                </div>
                <button onClick={() => setSelectedBusiness(null)} className="p-2 hover:bg-gray-100 rounded-full h-fit">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl h-12">
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo llegar
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl bg-transparent">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl bg-transparent">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
