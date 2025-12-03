"use client"

import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BadgeCheck, ChevronRight, Star } from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
}

export function DashboardHeader({ dateRange, onDateRangeChange }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <span className="hover:text-indigo-600 cursor-pointer">Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="hover:text-indigo-600 cursor-pointer">Mi Negocio</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-900 font-medium">Cafe Vinilo</span>
      </nav>

      {/* Business Card + Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        {/* Business Info */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="/coffee-shop-logo-vinyl-record.jpg" alt="Cafe Vinilo" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Cafe Vinilo</h1>
              <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500" />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                4.8
              </span>
              <span className="text-gray-300">|</span>
              <span>127 resenas</span>
              <span className="text-gray-300">|</span>
              <span>1,234 vistas</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={isOpen} onCheckedChange={setIsOpen} className="data-[state=checked]:bg-emerald-500" />
              <Badge
                variant="outline"
                className={`${
                  isOpen ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isOpen ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Ultimos 7 dias</SelectItem>
            <SelectItem value="30d">Ultimos 30 dias</SelectItem>
            <SelectItem value="90d">Ultimos 90 dias</SelectItem>
            <SelectItem value="1y">Ultimo ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
