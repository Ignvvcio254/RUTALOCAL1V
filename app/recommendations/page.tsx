"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { NegocioCard } from "@/components/negocio-card"
import { Button } from "@/components/ui/button"
import { Sparkles, SlidersHorizontal, MapPin } from "lucide-react"
import Link from "next/link"

// Datos de negocios expandidos (incluye los 3 originales + más)
const allBusinessCards = [
  {
    id: "1",
    name: "Café Vinilo",
    category: "CAFÉ" as const,
    rating: 4.8,
    reviews: 127,
    distance: "800m de ti",
    description: "Café de especialidad con vinilos vintage",
    priceRange: 2,
    isOpen: true,
    image: "/cozy-coffee-shop-with-vinyl-records.jpg",
  },
  {
    id: "2",
    name: "Taller Cerámica Local",
    category: "ARTE" as const,
    rating: 4.9,
    reviews: 89,
    distance: "1.2km de ti",
    description: "Aprende cerámica con artesanos locales",
    priceRange: 3,
    isOpen: true,
    image: "/pottery-ceramic-art-studio-workshop.jpg",
  },
  {
    id: "3",
    name: "Tour Barrio Italia",
    category: "TOUR" as const,
    rating: 5.0,
    reviews: 156,
    distance: "Desde aquí",
    description: "Recorrido guiado por local con historias",
    priceRange: 2,
    isOpen: true,
    image: "/guided-city-tour-barrio-buildings.jpg",
  },
  {
    id: "4",
    name: "Librería Metales Pesados",
    category: "LIBRERÍA" as const,
    rating: 4.7,
    reviews: 94,
    distance: "600m de ti",
    description: "Librería independiente con títulos únicos",
    priceRange: 2,
    isOpen: true,
    image: "/cozy-coffee-shop-with-vinyl-records.jpg",
  },
  {
    id: "5",
    name: "Hostal Providencia",
    category: "HOSTAL" as const,
    rating: 4.6,
    reviews: 203,
    distance: "1.5km de ti",
    description: "Acogedor hostal en el corazón de Providencia",
    priceRange: 2,
    isOpen: true,
    image: "/pottery-ceramic-art-studio-workshop.jpg",
  },
  {
    id: "6",
    name: "Restaurante Boragó",
    category: "RESTAURANTE" as const,
    rating: 4.9,
    reviews: 312,
    distance: "2km de ti",
    description: "Alta cocina chilena con ingredientes nativos",
    priceRange: 3,
    isOpen: true,
    image: "/guided-city-tour-barrio-buildings.jpg",
  },
  {
    id: "7",
    name: "Bar La Piojera",
    category: "BAR" as const,
    rating: 4.4,
    reviews: 287,
    distance: "900m de ti",
    description: "Bar tradicional con historia desde 1896",
    priceRange: 1,
    isOpen: true,
    image: "/cozy-coffee-shop-with-vinyl-records.jpg",
  },
  {
    id: "8",
    name: "Galería Gabriela Mistral",
    category: "GALERÍA" as const,
    rating: 4.8,
    reviews: 145,
    distance: "1.1km de ti",
    description: "Centro cultural con exposiciones contemporáneas",
    priceRange: 1,
    isOpen: true,
    image: "/pottery-ceramic-art-studio-workshop.jpg",
  },
  {
    id: "9",
    name: "Panadería Lo Valledor",
    category: "PANADERÍA" as const,
    rating: 4.7,
    reviews: 178,
    distance: "700m de ti",
    description: "Pan artesanal y pastelería tradicional chilena",
    priceRange: 1,
    isOpen: true,
    image: "/guided-city-tour-barrio-buildings.jpg",
  },
  {
    id: "10",
    name: "Mercado Central",
    category: "MERCADO" as const,
    rating: 4.6,
    reviews: 423,
    distance: "1.8km de ti",
    description: "Mercado histórico con productos frescos y mariscos",
    priceRange: 2,
    isOpen: true,
    image: "/cozy-coffee-shop-with-vinyl-records.jpg",
  },
  {
    id: "11",
    name: "Café con Libros",
    category: "CAFÉ" as const,
    rating: 4.8,
    reviews: 156,
    distance: "500m de ti",
    description: "Café literario con tertulias y eventos culturales",
    priceRange: 2,
    isOpen: true,
    image: "/pottery-ceramic-art-studio-workshop.jpg",
  },
  {
    id: "12",
    name: "Tour Cerro San Cristóbal",
    category: "TOUR" as const,
    rating: 4.9,
    reviews: 267,
    distance: "2.2km de ti",
    description: "Recorrido por el pulmón verde de Santiago",
    priceRange: 2,
    isOpen: true,
    image: "/guided-city-tour-barrio-buildings.jpg",
  },
]

const categories = ["Todos", "CAFÉ", "ARTE", "TOUR", "LIBRERÍA", "HOSTAL", "RESTAURANTE", "BAR", "GALERÍA", "PANADERÍA", "MERCADO"]

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredBusinesses = selectedCategory === "Todos"
    ? allBusinessCards
    : allBusinessCards.filter(business => business.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-12 md:px-12 lg:px-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
          >
            ← Volver al inicio
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🤖</span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Recomendaciones para ti
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Descubre los mejores lugares cerca de ti, seleccionados por nuestra IA
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">Powered by AI</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredBusinesses.length}</p>
                  <p className="text-sm text-gray-600">Lugares disponibles</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                  <p className="text-sm text-gray-600">Rating promedio</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                  <p className="text-sm text-gray-600">Categorías</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="px-6 py-12 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> resultados
            </p>
            
            <Link href="/map-interactive">
              <Button 
                variant="outline"
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Ver en Mapa
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBusinesses.map((card, index) => (
              <div
                key={card.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: '500ms',
                  animationFillMode: 'backwards',
                }}
              >
                <NegocioCard {...card} />
              </div>
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                No se encontraron resultados para esta categoría
              </p>
              <Button onClick={() => setSelectedCategory("Todos")}>
                Ver todos los lugares
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
