"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("santiago_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulación de autenticación (acepta cualquier credencial por ahora)
    // TODO: Conectar con backend Django
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular delay de red

    const mockUser: User = {
      id: "1",
      email: email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
    }

    setUser(mockUser)
    localStorage.setItem("santiago_user", JSON.stringify(mockUser))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulación de registro (acepta cualquier credencial por ahora)
    // TODO: Conectar con backend Django
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay de red

    const mockUser: User = {
      id: Date.now().toString(),
      email: email,
      name: name,
    }

    setUser(mockUser)
    localStorage.setItem("santiago_user", JSON.stringify(mockUser))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)

    // Simulación de login con Google
    // TODO: Implementar OAuth con Google
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Date.now().toString(),
      email: "usuario@gmail.com",
      name: "Usuario de Google",
    }

    setUser(mockUser)
    localStorage.setItem("santiago_user", JSON.stringify(mockUser))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("santiago_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
