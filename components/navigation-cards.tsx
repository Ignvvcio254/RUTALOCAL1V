"use client"

import Link from "next/link"
import { Map, Route, Bot, MapPin, Calendar, MessageCircle, Building2, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavigationCards() {
  const cards = [
    {
      id: "map",
      icon: Map,
      title: "Explorar Mapa",
      description: "Descubre negocios locales en mapa 3D interactivo",
      features: [
        { icon: Building2, text: "Edificios 3D de Santiago" },
        { icon: MapPin, text: "20 barrios destacados" },
        { icon: Sparkles, text: "+100 sitios verificados" },
      ],
      ctaText: "Ver Mapa Completo",
      ctaLink: "/map-interactive",
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
      borderColor: "hover:border-indigo-500",
      bgHover: "hover:bg-indigo-50/50",
    },
    {
      id: "routes",
      icon: Route,
      title: "Crear Ruta",
      description: "Diseña tu itinerario perfecto arrastrando y soltando",
      features: [
        { icon: Route, text: "Drag & drop intuitivo" },
        { icon: Calendar, text: "Timeline visual" },
        { icon: Clock, text: "Optimización automática" },
      ],
      ctaText: "Crear Mi Ruta",
      ctaLink: "/builder",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
      borderColor: "hover:border-purple-500",
      bgHover: "hover:bg-purple-50/50",
    },
    {
      id: "bot",
      icon: Bot,
      title: "RutaBot IA",
      description: "Tu asistente personal con IA para planificar tu visita",
      features: [
        { icon: MessageCircle, text: "Chat en tiempo real" },
        { icon: Sparkles, text: "Recomendaciones personalizadas" },
        { icon: Clock, text: "Disponible 24/7" },
      ],
      ctaText: "Chatear Ahora",
      ctaLink: "#rutabot",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
      borderColor: "hover:border-emerald-500",
      bgHover: "hover:bg-emerald-50/50",
    },
  ]

  const handleBotClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const rutabot = document.getElementById('rutabot-container')
    if (rutabot) {
      rutabot.scrollIntoView({ behavior: 'smooth' })
      // Trigger chatbot open if it has a function to do so
      const chatButton = rutabot.querySelector('button')
      if (chatButton) {
        chatButton.click()
      }
    }
  }

  return (
    <section className="px-6 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            ¿Cómo quieres explorar?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elige la forma que prefieras para descubrir Santiago
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon
            
            return (
              <div
                key={card.id}
                className={`group relative bg-white rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${card.borderColor} ${card.bgHover} animate-in fade-in slide-in-from-bottom-8`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationDuration: '700ms',
                  animationFillMode: 'backwards',
                }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 py-4">
                    {card.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon
                      return (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                          <FeatureIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{feature.text}</span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* CTA Button */}
                  {card.id === 'bot' ? (
                    <button
                      onClick={handleBotClick}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${card.gradient} ${card.hoverGradient} shadow-md hover:shadow-xl transition-all duration-300 active:scale-95`}
                    >
                      {card.ctaText} →
                    </button>
                  ) : (
                    <Link href={card.ctaLink}>
                      <Button
                        className={`w-full py-6 rounded-xl font-semibold text-white bg-gradient-to-r ${card.gradient} ${card.hoverGradient} shadow-md hover:shadow-xl transition-all duration-300`}
                        size="lg"
                      >
                        {card.ctaText} →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
