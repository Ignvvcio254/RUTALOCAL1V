import { Sparkles, ArrowRight } from "lucide-react"
import { NegocioCard } from "./negocio-card"

const businessCards = [
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
]

export function RecommendationsSection() {
  return (
    <section className="px-6 py-16 md:px-12 lg:px-16">
      {/* Header */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-3xl font-bold text-gray-900">Recomendado para ti ahora</h2>
          </div>
          <p className="text-gray-600">Basado en tu ubicación y preferencias</p>
        </div>

        {/* Right section with badge and link */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">Powered by AI</span>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-purple-600"
          >
            Ver todas
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businessCards.map((card) => (
          <NegocioCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  )
}
