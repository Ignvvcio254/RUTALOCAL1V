# 🔐 PLAN DE IMPLEMENTACIÓN - AUTENTICACIÓN JWT
## Sistema de Login Profesional con JWT + Diseño Mejorado

**Versión:** 1.0.0  
**Fecha:** Diciembre 2024  
**Prioridad:** CRÍTICA 🚨

---

## 🎯 OBJETIVOS

### Funcionales
- ✅ **Login obligatorio** - Redirigir `/` → `/login` si no autenticado
- ✅ **JWT Authentication** - Tokens seguros con refresh
- ✅ **Protected Routes** - Middleware para rutas protegidas
- ✅ **Session Management** - Manejo de sesiones persistentes
- ✅ **Auto-logout** - Cerrar sesión al expirar token

### UI/UX
- ✅ **Diseño profesional** - Minimalista y elegante
- ✅ **Micro-interacciones** - Detalles sutiles de alta calidad
- ✅ **Responsive** - Mobile-first approach
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado
- ✅ **Performance** - Sin animaciones pesadas

---

## 📋 ESTRUCTURA DEL PLAN

### **Fase 1: Arquitectura JWT** (2-3 horas)
### **Fase 2: Route Protection** (1-2 horas)
### **Fase 3: Diseño Login Mejorado** (3-4 horas)
### **Fase 4: Integración Backend** (2-3 horas)
### **Fase 5: Testing y Ajustes** (1-2 horas)

**Total estimado: 9-14 horas**

---

## 🏗️ FASE 1: ARQUITECTURA JWT (2-3 horas)

### Objetivo
Implementar sistema completo de autenticación con JWT (Access + Refresh tokens)

### 1.1 Tipos de Tokens

```typescript
// lib/auth/types.ts
export interface AuthTokens {
  accessToken: string      // Expira en 15 min
  refreshToken: string     // Expira en 7 días
  tokenType: 'Bearer'
  expiresIn: number        // Segundos hasta expiración
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  emailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}
```

### 1.2 Token Manager (Clase)

```typescript
// lib/auth/token-manager.ts
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'ruta_local_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'ruta_local_refresh_token'
  private static readonly TOKEN_EXPIRY_KEY = 'ruta_local_token_expiry'

  /**
   * Guarda tokens en localStorage/sessionStorage
   */
  static saveTokens(tokens: AuthTokens, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage
    
    storage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken)
    storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken)
    
    const expiryTime = Date.now() + tokens.expiresIn * 1000
    storage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
  }

  /**
   * Obtiene el access token
   */
  static getAccessToken(): string | null {
    return (
      localStorage.getItem(this.ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
    )
  }

  /**
   * Obtiene el refresh token
   */
  static getRefreshToken(): string | null {
    return (
      localStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    )
  }

  /**
   * Verifica si el token está expirado
   */
  static isTokenExpired(): boolean {
    const expiry = 
      localStorage.getItem(this.TOKEN_EXPIRY_KEY) ||
      sessionStorage.getItem(this.TOKEN_EXPIRY_KEY)

    if (!expiry) return true

    return Date.now() > parseInt(expiry, 10)
  }

  /**
   * Limpia todos los tokens
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY)
  }

  /**
   * Decodifica el JWT (sin verificar firma)
   */
  static decodeToken(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload)
      return JSON.parse(decoded)
    } catch {
      return null
    }
  }
}
```

### 1.3 Auth Service (Clase)

```typescript
// lib/auth/auth.service.ts
import { TokenManager } from './token-manager'
import type { LoginCredentials, LoginResponse, AuthUser } from './types'

export class AuthService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  private static refreshPromise: Promise<AuthTokens> | null = null

  /**
   * Login con email y contraseña
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al iniciar sesión')
    }

    const data: LoginResponse = await response.json()

    // Guardar tokens
    TokenManager.saveTokens(data.tokens, credentials.remember || false)

    return data
  }

  /**
   * Refresh token (renovar access token)
   */
  static async refreshAccessToken(): Promise<AuthTokens> {
    // Evitar múltiples llamadas simultáneas
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      const refreshToken = TokenManager.getRefreshToken()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${this.API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        TokenManager.clearTokens()
        throw new Error('Failed to refresh token')
      }

      const tokens: AuthTokens = await response.json()
      TokenManager.saveTokens(tokens, true)

      return tokens
    })()

    try {
      const tokens = await this.refreshPromise
      return tokens
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser(): Promise<AuthUser> {
    const token = TokenManager.getAccessToken()

    if (!token) {
      throw new Error('No access token')
    }

    // Si el token está expirado, renovar
    if (TokenManager.isTokenExpired()) {
      await this.refreshAccessToken()
    }

    const response = await fetch(`${this.API_URL}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user')
    }

    return response.json()
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken()

    if (refreshToken) {
      try {
        await fetch(`${this.API_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TokenManager.getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      } catch {
        // Ignorar errores de logout
      }
    }

    TokenManager.clearTokens()
  }

  /**
   * Verifica si hay sesión activa
   */
  static hasActiveSession(): boolean {
    const token = TokenManager.getAccessToken()
    return !!token && !TokenManager.isTokenExpired()
  }
}
```

### 1.4 HTTP Interceptor (Clase)

```typescript
// lib/auth/http-interceptor.ts
import { TokenManager } from './token-manager'
import { AuthService } from './auth.service'

export class HttpInterceptor {
  /**
   * Fetch wrapper con auto-refresh de tokens
   */
  static async fetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = TokenManager.getAccessToken()

    // Agregar token si existe
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    let response = await fetch(url, options)

    // Si es 401, intentar renovar token
    if (response.status === 401) {
      try {
        await AuthService.refreshAccessToken()
        
        // Reintentar con nuevo token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${TokenManager.getAccessToken()}`,
        }
        
        response = await fetch(url, options)
      } catch {
        // Token refresh falló, limpiar y redirigir
        TokenManager.clearTokens()
        window.location.href = '/login'
        throw new Error('Session expired')
      }
    }

    return response
  }
}
```

### Archivos a crear - Fase 1:
```
lib/auth/
├── types.ts                  # Tipos de autenticación
├── token-manager.ts          # Gestor de tokens
├── auth.service.ts           # Servicio de autenticación
└── http-interceptor.ts       # Interceptor HTTP
```

---

## 🛡️ FASE 2: ROUTE PROTECTION (1-2 horas)

### Objetivo
Proteger rutas y redirigir a login si no autenticado

### 2.1 Middleware de Next.js

```typescript
// middleware.ts (en la raíz del proyecto)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register', '/forgot-password']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener token de las cookies o headers
  const token = request.cookies.get('access_token')?.value

  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  // Si no hay token y la ruta no es pública → Login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si hay token y está en ruta de auth → Dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirigir raíz a login si no autenticado
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/map-interactive/:path*',
    '/builder/:path*',
    '/login',
    '/register',
  ],
}
```

### 2.2 Route Guard Component

```typescript
// components/auth/route-guard.tsx
"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthService } from '@/lib/auth/auth.service'
import { Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const hasSession = AuthService.hasActiveSession()

      if (!hasSession) {
        router.push(`/login?redirect=${pathname}`)
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
```

### 2.3 Actualizar Auth Context

```typescript
// contexts/auth-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth/auth.service"
import { TokenManager } from "@/lib/auth/token-manager"
import type { AuthUser, LoginCredentials } from "@/lib/auth/types"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (AuthService.hasActiveSession()) {
          const currentUser = await AuthService.getCurrentUser()
          setUser(currentUser)
        }
      } catch {
        TokenManager.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const { user: loggedUser } = await AuthService.login(credentials)
      setUser(loggedUser)
      
      // Redirigir al dashboard o URL guardada
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect') || '/dashboard'
      router.push(redirect)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
    } catch {
      await logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
```

### 2.4 Actualizar Root Page

```typescript
// app/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  // Siempre redirigir a login
  // El middleware manejará la redirección si está autenticado
  redirect('/login')
}
```

### Archivos a crear/modificar - Fase 2:
```
middleware.ts                      # NEW - Middleware de Next.js
components/auth/route-guard.tsx    # NEW - Guard component
contexts/auth-context.tsx          # MODIFY - Con JWT
app/page.tsx                       # MODIFY - Redirect a login
```

---

## 🎨 FASE 3: DISEÑO LOGIN MEJORADO (3-4 horas)

### Objetivo
Diseño profesional, minimalista con micro-interacciones sutiles de alta calidad

### Principios de Diseño:
- ✅ **Minimalismo elegante** - Sin elementos innecesarios
- ✅ **Micro-interacciones sutiles** - Transiciones suaves < 200ms
- ✅ **Espacios en blanco** - Diseño respirado
- ✅ **Tipografía clara** - Jerarquía visual definida
- ✅ **Colores profesionales** - Paleta sobria y moderna

### Paleta de Colores Profesional:

```css
/* Theme: Professional Blue + Dark Accents */
--auth-primary: #2563eb       /* Blue 600 - Botones principales */
--auth-primary-hover: #1d4ed8 /* Blue 700 - Hover states */
--auth-accent: #0ea5e9        /* Sky 500 - Acentos */
--auth-dark: #0f172a          /* Slate 900 - Textos principales */
--auth-gray: #64748b           /* Slate 500 - Textos secundarios */
--auth-light: #f8fafc         /* Slate 50 - Fondos claros */
--auth-border: #e2e8f0        /* Slate 200 - Bordes */

/* Gradientes sutiles */
--auth-gradient-bg: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)
--auth-gradient-card: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
```

### Layout del Login:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              [Logo + Isotipo]                   │
│                                                 │
│              Ruta Local                         │
│         Descubre Santiago auténtico             │
│                                                 │
│    ┌───────────────────────────────────┐       │
│    │                                   │       │
│    │    Iniciar Sesión                 │       │
│    │    ────────────────               │       │
│    │                                   │       │
│    │    Email                          │       │
│    │    [  tu@email.com         ]      │       │
│    │                                   │       │
│    │    Contraseña                     │       │
│    │    [  ••••••••••          👁]     │       │
│    │                                   │       │
│    │    [✓] Recordarme                 │       │
│    │                                   │       │
│    │    [ Iniciar Sesión ]             │       │
│    │                                   │       │
│    │    ¿Olvidaste tu contraseña?      │       │
│    │                                   │       │
│    │    ───────  o  ───────            │       │
│    │                                   │       │
│    │    [  Google  ] [  GitHub  ]      │       │
│    │                                   │       │
│    │    ¿No tienes cuenta? Regístrate  │       │
│    │                                   │       │
│    └───────────────────────────────────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Componente Login v2:

```typescript
// app/login/page.tsx
"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Campos requeridos",
        description: "Completa todos los campos",
        variant: "destructive",
      })
      return
    }

    try {
      await login({ email, password, remember })
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      {/* Background decoration - Sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Logo + Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-2">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Ruta Local
          </h1>
          <p className="text-slate-600 text-sm">
            Descubre Santiago auténtico
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-900">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(checked) => setRemember(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600 cursor-pointer select-none"
                  >
                    Recordarme
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-500/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">O continúa con</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-200 hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-200 hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </form>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-slate-600">¿No tienes una cuenta? </span>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Regístrate gratis
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          Al continuar, aceptas nuestros{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### Animaciones CSS Personalizadas:

```css
/* app/globals.css */

/* Animación de pulso suave para fondos */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Transiciones suaves en inputs */
.input-focus-transition {
  transition: border-color 200ms ease-in-out, box-shadow 200ms ease-in-out;
}

/* Hover effect sutil en botones */
.button-hover-lift {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}

.button-hover-lift:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Archivos a crear/modificar - Fase 3:
```
app/login/page.tsx         # MODIFY - Nuevo diseño profesional
app/register/page.tsx      # MODIFY - Mismo estilo
app/globals.css            # MODIFY - Animaciones personalizadas
```

---

## 🔌 FASE 4: INTEGRACIÓN BACKEND (2-3 horas)

### Objetivo
Conectar con endpoints reales de Django usando JWT

### 4.1 Endpoints Django Esperados

```python
# Backend Django - Endpoints necesarios

# POST /api/auth/login/
# Request: { email, password }
# Response: { user: {...}, tokens: { access, refresh, ... } }

# POST /api/auth/refresh/
# Request: { refresh }
# Response: { access, refresh, ... }

# GET /api/auth/me/
# Headers: Authorization: Bearer <token>
# Response: { user: {...} }

# POST /api/auth/logout/
# Request: { refresh }
# Response: { message: "Logout successful" }

# POST /api/auth/register/
# Request: { name, email, password }
# Response: { user: {...}, tokens: {...} }
```

### 4.2 Configuración de Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_DEV_MODE=false

# Para producción
# NEXT_PUBLIC_API_URL=https://api.rutalocal.cl
```

### 4.3 Test de Integración

```typescript
// lib/auth/__tests__/auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should login successfully', async () => {
    const result = await AuthService.login({
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(result.user).toBeDefined()
    expect(result.tokens.accessToken).toBeDefined()
  })

  it('should refresh token when expired', async () => {
    // Mock expired token
    TokenManager.saveTokens({
      accessToken: 'expired',
      refreshToken: 'valid',
      tokenType: 'Bearer',
      expiresIn: -1
    }, true)

    const newTokens = await AuthService.refreshAccessToken()
    expect(newTokens.accessToken).not.toBe('expired')
  })

  it('should logout and clear tokens', async () => {
    await AuthService.logout()
    
    expect(TokenManager.getAccessToken()).toBeNull()
    expect(TokenManager.getRefreshToken()).toBeNull()
  })
})
```

---

## 🧪 FASE 5: TESTING Y AJUSTES (1-2 horas)

### 5.1 Checklist de Testing

- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas (error handling)
- [ ] Remember me funcional
- [ ] Token refresh automático
- [ ] Logout limpia tokens
- [ ] Rutas protegidas redirigen a login
- [ ] Login redirige a dashboard si ya autenticado
- [ ] Persistencia de sesión (localStorage vs sessionStorage)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accesibilidad (navegación por teclado, screen readers)
- [ ] Performance (< 2s FCP)

### 5.2 Casos Edge

```typescript
// Casos a probar:
1. Token expirado durante navegación → Auto refresh
2. Refresh token inválido → Logout forzado
3. Network offline → Mensaje de error amigable
4. Multiple tabs → Sincronización de sesión
5. Navegador sin JavaScript → Mensaje de error
```

---

## 📊 RESUMEN DE ARCHIVOS

### Archivos Nuevos (13):
```
lib/auth/
├── types.ts
├── token-manager.ts
├── auth.service.ts
└── http-interceptor.ts

components/auth/
└── route-guard.tsx

middleware.ts

lib/auth/__tests__/
└── auth-flow.test.ts
```

### Archivos Modificados (4):
```
app/page.tsx                   # Redirect a login
app/login/page.tsx             # Diseño mejorado + JWT
app/layout.tsx                 # (opcional) Metadata
contexts/auth-context.tsx      # Integración JWT
app/globals.css                # Animaciones
```

---

## ⏱️ CRONOGRAMA DETALLADO

| Fase | Tarea | Tiempo | Prioridad |
|------|-------|---------|-----------|
| 1 | Tipos + TokenManager | 30 min | 🔴 Alta |
| 1 | AuthService | 1h | 🔴 Alta |
| 1 | HttpInterceptor | 30 min | 🔴 Alta |
| 2 | Middleware Next.js | 45 min | 🔴 Alta |
| 2 | RouteGuard Component | 30 min | 🔴 Alta |
| 2 | AuthContext con JWT | 45 min | 🔴 Alta |
| 3 | Diseño Login v2 | 2h | 🟡 Media |
| 3 | Animaciones CSS | 1h | 🟢 Baja |
| 4 | Integración Backend | 2h | 🔴 Alta |
| 5 | Testing + Ajustes | 2h | 🟡 Media |

**Total: 9-14 horas**

---

## 🎯 MÉTRICAS DE ÉXITO

### Performance
- ✅ FCP < 1.5s
- ✅ TTI < 3s
- ✅ No layout shifts (CLS = 0)

### Security
- ✅ Tokens en httpOnly (si usa cookies)
- ✅ HTTPS en producción
- ✅ CORS configurado correctamente
- ✅ No exponer tokens en localStorage (considerar cookies)

### UX
- ✅ Feedback inmediato (< 100ms)
- ✅ Estados de carga claros
- ✅ Errores descriptivos
- ✅ Accesible (WCAG AA)

---

## 🚀 PRÓXIMOS PASOS

1. **Implementar Fase 1** - Arquitectura JWT (2-3h)
2. **Implementar Fase 2** - Route Protection (1-2h)
3. **Implementar Fase 3** - Diseño Login v2 (3-4h)
4. **Coordinar con Backend** - Endpoints Django (2-3h)
5. **Testing completo** - Flujos de autenticación (1-2h)

---

## 📝 NOTAS IMPORTANTES

### Seguridad
- ⚠️ **NUNCA** guardar tokens en localStorage si la app maneja datos sensibles
- ✅ Considerar usar **httpOnly cookies** para tokens
- ✅ Implementar **CSRF protection** si usas cookies
- ✅ Usar **HTTPS** en producción SIEMPRE

### Performance
- ✅ Lazy load el login page no es necesario (es entry point)
- ✅ Preload fonts para evitar FOUT
- ✅ Optimizar imágenes (WebP, lazy loading)

### Accesibilidad
- ✅ Labels asociados a inputs
- ✅ ARIA labels donde sea necesario
- ✅ Navegación por teclado (Tab, Enter, Esc)
- ✅ Mensajes de error accesibles (aria-live)

---

**Última actualización:** Diciembre 2024  
**Estado:** 📋 Planificado - Listo para implementación  
**Prioridad:** 🚨 CRÍTICA
