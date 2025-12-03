"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Clock, PartyPopper, Sparkles, ArrowRight } from "lucide-react"

const recommendations = [
  {
    id: 1,
    icon: Camera,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "Agrega 3 fotos mas",
    description: "Los negocios con 10+ fotos reciben 40% mas visitas",
    impact: "+40%",
    impactColor: "bg-emerald-100 text-emerald-700",
    cta: "Subir fotos",
  },
  {
    id: 2,
    icon: Clock,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Actualiza tu horario",
    description: "14 usuarios buscaron tu negocio cuando estaba cerrado",
    impact: "14 perdidos",
    impactColor: "bg-amber-100 text-amber-700",
    cta: "Editar horario",
  },
  {
    id: 3,
    icon: PartyPopper,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Crea un evento",
    description: "Los negocios con eventos activos tienen 2x mas engagement",
    impact: "2x",
    impactColor: "bg-indigo-100 text-indigo-700",
    cta: "Crear evento",
  },
]

export function AiRecommendations() {
  return (
    <Card className="bg-white border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold text-gray-900">Sugerencias para mejorar</CardTitle>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 text-xs">IA</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <div className={`p-2.5 rounded-lg ${rec.iconBg} flex-shrink-0`}>
              <rec.icon className={`h-5 w-5 ${rec.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{rec.title}</p>
                <Badge className={`${rec.impactColor} text-xs`}>{rec.impact}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{rec.description}</p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
              >
                {rec.cta}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
