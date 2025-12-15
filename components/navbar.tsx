"use client"

import { Search, MessageCircle, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RG</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">RutaGo</span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                    {user?.avatar && (
                      <AvatarImage 
                        src={user.avatar} 
                        alt={user?.name || 'Usuario'}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
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
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
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
                    <Link href="/profile">Mi Perfil</Link>
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
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
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
  )
}
