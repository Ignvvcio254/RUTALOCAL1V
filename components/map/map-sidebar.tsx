"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ResultsList } from "./results-list"
import { MOCK_BUSINESSES } from "@/lib/mock-data"
import { useMediaQuery } from "@/hooks/use-mobile"

export interface MapFilters {
  category: string
  distance: number
  rating: number
  priceRange: number
  openNow: boolean
}

interface MapSidebarProps {
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  selectedBusiness: string | null
  onSelectBusiness: (id: string | null) => void
  isMobile?: boolean
}

export function MapSidebar({
  filters,
  onFiltersChange,
  selectedBusiness,
  onSelectBusiness,
  isMobile,
}: MapSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFilters, setExpandedFilters] = useState(!isMobile)
  const [sortBy, setSortBy] = useState("cercanos")
  const isMobileView = useMediaQuery("(max-width: 768px)")

  const filterChips = [
    { id: "todos", label: "Todos" },
    { id: "café", label: "Cafés ☕" },
    { id: "arte", label: "Arte 🎨" },
    { id: "tour", label: "Tours 🗺️" },
    { id: "hostal", label: "Hostales 🏠" },
  ]

  const filteredResults = MOCK_BUSINESSES.filter((business) => {
    if (filters.category !== "todos" && business.category !== filters.category) return false
    if (business.rating < filters.rating) return false
    if (business.priceRange > filters.priceRange) return false
    if (filters.openNow && !business.isOpen) return false
    if (searchQuery && !business.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const Content = (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar negocios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 p-0 placeholder-muted-foreground focus-visible:ring-0"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onFiltersChange({ ...filters, category: chip.id })}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
              filters.category === chip.id
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Collapsible advanced filters */}
      <div className="border border-border rounded-lg">
        <button
          onClick={() => setExpandedFilters(!expandedFilters)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted"
        >
          <span className="font-medium text-sm">Filtros avanzados</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedFilters ? "rotate-180" : ""}`} />
        </button>

        {expandedFilters && (
          <div className="border-t border-border p-3 space-y-4">
            {/* Distance slider */}
            <div>
              <Label className="text-sm font-medium">Distancia: {filters.distance}km</Label>
              <Slider
                value={[filters.distance]}
                onValueChange={(value) => onFiltersChange({ ...filters, distance: value[0] })}
                max={10}
                min={0}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Rating filter */}
            <div>
              <Label className="text-sm font-medium">Calificación mínima</Label>
              <div className="flex gap-2 mt-2">
                {[0, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onFiltersChange({ ...filters, rating })}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                      filters.rating === rating
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {rating === 0 ? "Todas" : `${rating}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <Label className="text-sm font-medium">Rango de precios</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map((price) => (
                  <button
                    key={price}
                    onClick={() => onFiltersChange({ ...filters, priceRange: price })}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                      filters.priceRange === price
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {"💰".repeat(price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Open now */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Abierto ahora</Label>
              <Switch
                checked={filters.openNow}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, openNow: checked })}
              />
            </div>

            {/* Clear filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onFiltersChange({
                  category: "todos",
                  distance: 5,
                  rating: 0,
                  priceRange: 3,
                  openNow: false,
                })
              }
              className="w-full"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{filteredResults.length} lugares encontrados</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm px-2 py-1 border border-border rounded bg-background"
        >
          <option value="cercanos">Más cercanos</option>
          <option value="valorados">Mejor valorados</option>
          <option value="populares">Más populares</option>
        </select>
      </div>

      {/* Results list */}
      <ScrollArea className="flex-1">
        <ResultsList
          results={filteredResults}
          selectedBusiness={selectedBusiness}
          onSelectBusiness={onSelectBusiness}
        />
      </ScrollArea>
    </div>
  )

  if (isMobileView) {
    return (
      <Sheet open={expandedFilters} onOpenChange={setExpandedFilters}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Descubre negocios locales</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{Content}</div>
        </SheetContent>
        {!expandedFilters && (
          <Button
            onClick={() => setExpandedFilters(true)}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            Ver lugares
          </Button>
        )}
      </Sheet>
    )
  }

  return Content
}
