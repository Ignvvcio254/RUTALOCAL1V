"use client"

import { useState, useEffect } from "react"
import { Map, Route, Bot, Bell, User, LogOut, MapPin, Search, Store, Loader2, Navigation } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

// Comunas de Santiago con sus coordenadas centrales
const COMUNAS_SANTIAGO = [
  { name: "Santiago Centro", lat: -33.4489, lng: -70.6693 },
  { name: "Providencia", lat: -33.4330, lng: -70.6100 },
  { name: "Las Condes", lat: -33.4103, lng: -70.5672 },
  { name: "Ñuñoa", lat: -33.4569, lng: -70.5975 },
  { name: "La Florida", lat: -33.5167, lng: -70.5833 },
  { name: "Maipú", lat: -33.5167, lng: -70.7500 },
  { name: "Vitacura", lat: -33.3958, lng: -70.5833 },
  { name: "Lo Barnechea", lat: -33.3500, lng: -70.5167 },
  { name: "Peñalolén", lat: -33.4833, lng: -70.5333 },
  { name: "Recoleta", lat: -33.4167, lng: -70.6333 },
  { name: "Renca", lat: -33.4000, lng: -70.7167 },
  { name: "Independencia", lat: -33.4167, lng: -70.6667 },
  { name: "San Miguel", lat: -33.5000, lng: -70.6500 },
  { name: "La Reina", lat: -33.4500, lng: -70.5500 },
  { name: "Macul", lat: -33.4833, lng: -70.6000 },
]

// Función para obtener la comuna desde coordenadas usando reverse geocoding
async function getComunaFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=locality,place&language=es&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    )
    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      // Buscar la localidad o comuna
      for (const feature of data.features) {
        if (feature.place_type.includes('locality') || feature.place_type.includes('place')) {
          return feature.text
        }
      }
      return data.features[0].text
    }
    return "Santiago"
  } catch (error) {
    console.error('Error getting comuna:', error)
    return "Santiago"
  }
}

export function NavbarHome() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>("Cargando...")
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null)

  // Obtener ubicación real del usuario al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserCoords({ lat: latitude, lng: longitude })
          
          // Obtener nombre de la comuna
          const comuna = await getComunaFromCoords(latitude, longitude)
          setCurrentLocation(comuna)
          setIsLoadingLocation(false)
        },
        (error) => {
          console.log('Geolocation error:', error)
          setCurrentLocation("Santiago Centro")
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    } else {
      setCurrentLocation("Santiago Centro")
      setIsLoadingLocation(false)
    }
  }, [])

  const handleBotClick = () => {
    // Trigger custom event to open chatbot globally
    window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: { open: true } }))
  }

  // Cambiar a una comuna específica
  const handleSelectComuna = (comuna: typeof COMUNAS_SANTIAGO[0]) => {
    setCurrentLocation(comuna.name)
    setUserCoords({ lat: comuna.lat, lng: comuna.lng })
    // Emitir evento para que otros componentes puedan reaccionar
    window.dispatchEvent(new CustomEvent('location-changed', { 
      detail: { name: comuna.name, lat: comuna.lat, lng: comuna.lng } 
    }))
  }

  // Usar ubicación actual del GPS
  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserCoords({ lat: latitude, lng: longitude })
          
          const comuna = await getComunaFromCoords(latitude, longitude)
          setCurrentLocation(comuna)
          setIsLoadingLocation(false)
          
          // Emitir evento
          window.dispatchEvent(new CustomEvent('location-changed', { 
            detail: { name: comuna, lat: latitude, lng: longitude } 
          }))
        },
        (error) => {
          console.log('Geolocation error:', error)
          setCurrentLocation("No disponible")
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
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
                <img 
                  src="/RGOlogo.png" 
                  alt="RutaGo" 
                  className="w-9 h-9 rounded-lg object-cover shadow-md"
                />
                <span className="hidden sm:block font-bold text-gray-900 text-lg">RutaGo</span>
              </Link>

              {/* Selector de Ubicación */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-indigo-500" />
                    )}
                    <span className="max-w-[120px] truncate">{currentLocation}</span>
                    <span className="text-xs">▾</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
                  <DropdownMenuLabel>Cambiar ubicación</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Usar ubicación actual */}
                  <DropdownMenuItem 
                    onClick={handleUseCurrentLocation}
                    className="text-indigo-600 font-medium"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Usar mi ubicación actual
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-gray-400">Comunas de Santiago</DropdownMenuLabel>
                  
                  {/* Lista de comunas */}
                  {COMUNAS_SANTIAGO.map((comuna) => (
                    <DropdownMenuItem 
                      key={comuna.name}
                      onClick={() => handleSelectComuna(comuna)}
                      className={currentLocation === comuna.name ? "bg-indigo-50 text-indigo-600" : ""}
                    >
                      <MapPin className="w-3 h-3 mr-2 opacity-50" />
                      {comuna.name}
                    </DropdownMenuItem>
                  ))}
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
                    {user?.avatar && (
                      <AvatarImage 
                        src={user.avatar} 
                        alt={user?.name || 'Usuario'}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {user?.avatar && (
                          <AvatarImage 
                            src={user.avatar} 
                            alt={user?.name || 'Usuario'}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
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
