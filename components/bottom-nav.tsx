"use client"

import { useState } from "react"
import { Home, Map, Search, Route, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SearchModal } from "./search-modal"

interface NavItem {
  id: string
  label: string
  icon: typeof Home
  href: string
  action?: () => void
}

export function BottomNav() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleChatClick = () => {
    const rutabot = document.getElementById('rutabot-container')
    if (rutabot) {
      rutabot.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        const chatButton = rutabot.querySelector('button')
        if (chatButton) {
          chatButton.click()
        }
      }, 500)
    }
  }

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      href: '/',
    },
    {
      id: 'map',
      label: 'Mapa',
      icon: Map,
      href: '/map-interactive',
    },
    {
      id: 'search',
      label: 'Buscar',
      icon: Search,
      href: '#',
      action: handleSearchClick,
    },
    {
      id: 'routes',
      label: 'Rutas',
      icon: Route,
      href: '/builder',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      href: '#',
      action: handleChatClick,
    },
  ]

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <nav className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-gray-200/50 px-4 py-3">
          <div className="flex items-center justify-around gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isSearchButton = item.id === 'search'

              if (item.action) {
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={cn(
                      "flex flex-col items-center justify-center transition-all duration-200",
                      isSearchButton && "relative"
                    )}
                  >
                    {isSearchButton ? (
                      // Botón central destacado flotante
                      <div className="flex flex-col items-center -mt-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center mb-2 ring-4 ring-white">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 px-3 py-2">
                        <Icon
                          className={cn(
                            "w-6 h-6 transition-colors",
                            isActive ? "text-indigo-600" : "text-gray-500"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors",
                            isActive ? "text-indigo-600" : "text-gray-500"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    )}
                  </button>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 active:scale-95"
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive ? "text-indigo-600" : "text-gray-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive ? "text-indigo-600" : "text-gray-500"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
