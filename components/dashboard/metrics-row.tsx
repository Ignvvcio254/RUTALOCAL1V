"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, MapPin, Star, MessageCircle, TrendingUp, TrendingDown, Reply } from "lucide-react"
import { LineChart, Line, BarChart, Bar, ResponsiveContainer } from "recharts"

const sparklineData = [
  { value: 30 },
  { value: 45 },
  { value: 35 },
  { value: 50 },
  { value: 42 },
  { value: 65 },
  { value: 58 },
]

const barData = [
  { value: 20 },
  { value: 35 },
  { value: 28 },
  { value: 45 },
  { value: 32 },
  { value: 40 },
  { value: 38 },
]

interface MetricCardProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  value: string
  trend?: {
    value: string
    positive: boolean
  }
  extra?: React.ReactNode
  chart?: React.ReactNode
}

function MetricCard({ icon, iconBg, title, value, trend, extra, chart }: MetricCardProps) {
  return (
    <Card className="p-4 md:p-5 bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        {chart && <div className="w-20 h-10">{chart}</div>}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          {trend.positive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={trend.positive ? "text-emerald-600" : "text-red-600"}>{trend.value}</span>
          <span className="text-gray-400">vs semana anterior</span>
        </div>
      )}
      {extra}
    </Card>
  )
}

export function MetricsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Eye className="h-5 w-5 text-indigo-600" />}
        iconBg="bg-indigo-50"
        title="Vistas del perfil"
        value="1,234"
        trend={{ value: "+23%", positive: true }}
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        }
      />

      <MetricCard
        icon={<MapPin className="h-5 w-5 text-purple-600" />}
        iconBg="bg-purple-50"
        title="Clics en ubicacion"
        value="342"
        trend={{ value: "-5%", positive: false }}
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <Bar dataKey="value" fill="#7C3AED" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      <MetricCard
        icon={<Star className="h-5 w-5 text-amber-500" />}
        iconBg="bg-amber-50"
        title="Valoracion promedio"
        value="4.8"
        extra={
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= 4 ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-100"}`}
                />
              ))}
            </div>
            <Progress value={96} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-400">96% de 5 estrellas</p>
          </div>
        }
      />

      <MetricCard
        icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}
        iconBg="bg-emerald-50"
        title="Mensajes recibidos"
        value="18"
        extra={
          <div className="space-y-3 mt-2">
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">3 sin leer</Badge>
            <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent">
              <Reply className="h-4 w-4" />
              Responder
            </Button>
          </div>
        }
      />
    </div>
  )
}
