"use client"

import { Card } from "@/components/ui/card"

export function MapLegend() {
  const categories = [
    { color: "#F97316", label: "Cafés", icon: "☕" },
    { color: "#A855F7", label: "Arte", icon: "🎨" },
    { color: "#3B82F6", label: "Tours", icon: "🗺️" },
    { color: "#10B981", label: "Hostales", icon: "🏠" },
  ]

  return (
    <Card className="p-3 bg-white/95 backdrop-blur shadow-lg">
      <p className="text-xs font-semibold mb-2 text-gray-700">Categorías</p>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm border-2 border-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon}
            </div>
            <span className="text-xs text-gray-700">{cat.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
