"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Route, MessageCircle, ChevronRight } from "lucide-react"

const activities = [
  {
    id: 1,
    user: "Juan Martinez",
    avatar: "/latino-man-portrait.png",
    action: "dejo una resena",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    rating: 5,
    time: "Hace 2 horas",
  },
  {
    id: 2,
    user: "Maria Lopez",
    avatar: "/latina-portrait.png",
    action: "agrego tu negocio a una ruta",
    icon: Route,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    time: "Hace 4 horas",
  },
  {
    id: 3,
    user: "Pedro Sanchez",
    avatar: "/casual-man-portrait.png",
    action: "te envio un mensaje",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    time: "Hace 1 dia",
  },
  {
    id: 4,
    user: "Ana Garcia",
    avatar: "/young-woman-portrait.png",
    action: "dejo una resena",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    rating: 4,
    time: "Hace 2 dias",
  },
]

export function ActivityFeed() {
  return (
    <Card className="bg-white border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
              <AvatarFallback>{activity.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-gray-600">{activity.action}</span>
                {activity.rating && (
                  <span className="ml-1 inline-flex">
                    {[...Array(activity.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
            </div>
            <div className={`p-2 rounded-lg ${activity.iconBg}`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
          </div>
        ))}

        <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
          Ver todas
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
