"use client"

import { Plus, Minus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
}

export function MapControls({ onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <Card className="p-2 bg-white/95 backdrop-blur shadow-lg flex flex-col gap-2">
      <Button size="icon" variant="outline" onClick={onZoomIn} className="h-9 w-9 bg-transparent">
        <Plus className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" onClick={onZoomOut} className="h-9 w-9 bg-transparent">
        <Minus className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" className="h-9 w-9 bg-transparent">
        <MapPin className="w-4 h-4" />
      </Button>
    </Card>
  )
}
