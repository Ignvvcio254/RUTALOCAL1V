"use client"

export function LocationCard() {
  return (
    <div className="absolute bottom-8 right-8">
      {/* Glassmorphism Card */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/30 rounded-2xl p-6 shadow-2xl w-72">
        {/* Live Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Live</span>
        </div>

        {/* Main Text */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">24 negocios</h3>
        <p className="text-gray-600 text-sm mb-4">cerca de ti en Santiago Centro</p>

        {/* Featured Businesses */}
        <div className="space-y-3">
          {["Café del Patio", "Galería Modern", "Hostal Verde"].map((name, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : "bg-purple-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
          Ver Todos
        </button>
      </div>
    </div>
  )
}
