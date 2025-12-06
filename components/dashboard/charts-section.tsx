"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts"

const visitData = [
  { day: "Lun", vistas: 156, clics: 42 },
  { day: "Mar", vistas: 189, clics: 58 },
  { day: "Mie", vistas: 145, clics: 35 },
  { day: "Jue", vistas: 210, clics: 67 },
  { day: "Vie", vistas: 267, clics: 89 },
  { day: "Sab", vistas: 312, clics: 98 },
  { day: "Dom", vistas: 198, clics: 54 },
]

const reviewData = [
  { name: "5 estrellas", value: 65, color: "#10B981" },
  { name: "4 estrellas", value: 25, color: "#34D399" },
  { name: "3 estrellas", value: 8, color: "#FBBF24" },
  { name: "1-2 estrellas", value: 2, color: "#EF4444" },
]

export function ChartsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Visitas por dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              Cargando gráfico...
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Distribucion de resenas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              Cargando gráfico...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visits Chart */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900">Visitas por dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorVistas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="vistas"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorVistas)"
                  name="Vistas de perfil"
                />
                <Area
                  type="monotone"
                  dataKey="clics"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fill="url(#colorClics)"
                  name="Clics en mapa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Distribution */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900">Distribucion de resenas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
              style={{ marginLeft: "-30px" }}
            >
              <p className="text-3xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-500">promedio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
