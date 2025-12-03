"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, CalendarPlus, MessageCircle, Download, HelpCircle, X } from "lucide-react"

interface QuickActionsSidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

const actions = [
  {
    icon: Pencil,
    label: "Editar perfil",
    color: "text-indigo-600",
    bg: "bg-indigo-50 hover:bg-indigo-100",
  },
  {
    icon: CalendarPlus,
    label: "Crear evento",
    color: "text-purple-600",
    bg: "bg-purple-50 hover:bg-purple-100",
  },
  {
    icon: MessageCircle,
    label: "Ver mensajes",
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    badge: 3,
  },
  {
    icon: Download,
    label: "Exportar datos",
    color: "text-gray-600",
    bg: "bg-gray-50 hover:bg-gray-100",
  },
]

export function QuickActionsSidebar({ isMobile, onClose }: QuickActionsSidebarProps) {
  return (
    <div className={`${isMobile ? "p-4" : "sticky top-0 h-screen p-4 bg-gray-50 border-l border-gray-100"}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Acciones rapidas</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {!isMobile && <h3 className="text-sm font-medium text-gray-500 mb-4">Acciones rapidas</h3>}

        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 ${action.bg} ${action.color}`}
          >
            <action.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{action.label}</span>
            {action.badge && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">{action.badge}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Help Card */}
      <Card className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Centro de ayuda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-indigo-100 mb-4">Tienes dudas? Nuestro equipo esta aqui para ayudarte.</p>
          <Button size="sm" variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
            Contactar soporte
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
