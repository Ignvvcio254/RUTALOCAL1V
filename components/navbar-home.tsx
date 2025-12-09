"use client"

import { useState } from "react"
import { Map, Route, Bot, Bell, User, LogOut, MapPin, Search, Store } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchModal } from "./search-modal"

export function NavbarHome() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleBotClick = () => {
    // Trigger custom event to open chatbot globally
    window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: { open: true } }))
  }

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Ubicación */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">RL</span>
                </div>
                <span className="hidden sm:block font-bold text-gray-900 text-lg">Ruta Local</span>
              </Link>

              {/* Selector de Ubicación */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Providencia</span>
                    <span className="text-xs">▾</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Cambiar ubicación</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>📍 Providencia</DropdownMenuItem>
                  <DropdownMenuItem>📍 Ñuñoa</DropdownMenuItem>
                  <DropdownMenuItem>📍 Las Condes</DropdownMenuItem>
                  <DropdownMenuItem>📍 Santiago Centro</DropdownMenuItem>
                  <DropdownMenuItem>📍 Bellavista</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-indigo-600">
                    Usar mi ubicación actual
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Acciones Rápidas Desktop (Centro) */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">Buscar</span>
              </Button>

              <Link href="/map-interactive">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <Map className="w-4 h-4" />
                  <span className="font-medium">Mapa</span>
                </Button>
              </Link>

              <Link href="/builder">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all"
                >
                  <Route className="w-4 h-4" />
                  <span className="font-medium">Crear Ruta</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBotClick}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span className="font-medium">RutaGo</span>
              </Button>
            </div>

            {/* Mobile: Sin botones de acciones rápidas */}

          {/* Iconos de Usuario (Derecha) */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Avatar / Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Mi Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-business">
                      <Store className="w-4 h-4 mr-2" />
                      Mis Negocios
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/builder">Mis Rutas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}
