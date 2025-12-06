/**
 * Ejemplos de uso de la API con Django
 * Copia estos ejemplos y adáptalos según tus necesidades
 */

import { authApi, businessApi, routeApi } from './api'
import { env } from './env'

// ============================================
// EJEMPLOS DE AUTENTICACIÓN
// ============================================

/**
 * Ejemplo 1: Login básico
 */
export async function exampleLogin() {
  try {
    const response = await authApi.login('usuario@example.com', 'password123')

    // Guardar token
    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(response.user))

    console.log('Login exitoso:', response.user)
    return response.user
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

/**
 * Ejemplo 2: Registro de usuario
 */
export async function exampleRegister() {
  try {
    const response = await authApi.register(
      'Juan Pérez',
      'juan@example.com',
      'password123'
    )

    // Guardar token
    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(response.user))

    console.log('Registro exitoso:', response.user)
    return response.user
  } catch (error) {
    console.error('Error en registro:', error)
    throw error
  }
}

/**
 * Ejemplo 3: Logout
 */
export async function exampleLogout() {
  try {
    await authApi.logout()

    // Limpiar localStorage
    localStorage.removeItem(env.storage.tokenKey)
    localStorage.removeItem(env.storage.userKey)

    console.log('Logout exitoso')
  } catch (error) {
    console.error('Error en logout:', error)
  }
}

/**
 * Ejemplo 4: Obtener usuario actual
 */
export async function exampleGetCurrentUser() {
  try {
    const user = await authApi.me()
    console.log('Usuario actual:', user)
    return user
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    throw error
  }
}

// ============================================
// EJEMPLOS DE NEGOCIOS
// ============================================

/**
 * Ejemplo 5: Listar todos los negocios
 */
export async function exampleListBusinesses() {
  try {
    const businesses = await businessApi.list()
    console.log('Negocios encontrados:', businesses)
    return businesses
  } catch (error) {
    console.error('Error al listar negocios:', error)
    throw error
  }
}

/**
 * Ejemplo 6: Buscar negocios con filtros
 */
export async function exampleSearchBusinesses() {
  try {
    // Pasar parámetros de búsqueda
    const businesses = await businessApi.list({
      category: 'restaurante',
      city: 'Santiago',
      rating_min: '4',
    })

    console.log('Negocios filtrados:', businesses)
    return businesses
  } catch (error) {
    console.error('Error en búsqueda:', error)
    throw error
  }
}

/**
 * Ejemplo 7: Obtener detalle de un negocio
 */
export async function exampleGetBusinessDetail(businessId: string) {
  try {
    const business = await businessApi.detail(businessId)
    console.log('Detalle del negocio:', business)
    return business
  } catch (error) {
    console.error('Error al obtener negocio:', error)
    throw error
  }
}

/**
 * Ejemplo 8: Buscar negocios por texto
 */
export async function exampleSearchByQuery(query: string) {
  try {
    const results = await businessApi.search(query)
    console.log(`Resultados para "${query}":`, results)
    return results
  } catch (error) {
    console.error('Error en búsqueda:', error)
    throw error
  }
}

// ============================================
// EJEMPLOS DE RUTAS
// ============================================

/**
 * Ejemplo 9: Crear una nueva ruta
 */
export async function exampleCreateRoute() {
  try {
    const newRoute = await routeApi.create({
      name: 'Mi Ruta Gastronómica',
      description: 'Los mejores restaurantes de Santiago Centro',
      businesses: ['1', '2', '3'], // IDs de negocios
      duration: 180, // minutos
      tags: ['comida', 'centro', 'urbano'],
    })

    console.log('Ruta creada:', newRoute)
    return newRoute
  } catch (error) {
    console.error('Error al crear ruta:', error)
    throw error
  }
}

/**
 * Ejemplo 10: Listar rutas del usuario
 */
export async function exampleListUserRoutes() {
  try {
    const routes = await routeApi.list()
    console.log('Mis rutas:', routes)
    return routes
  } catch (error) {
    console.error('Error al listar rutas:', error)
    throw error
  }
}

/**
 * Ejemplo 11: Actualizar una ruta
 */
export async function exampleUpdateRoute(routeId: string) {
  try {
    const updatedRoute = await routeApi.update(routeId, {
      name: 'Nuevo nombre de ruta',
      description: 'Descripción actualizada',
    })

    console.log('Ruta actualizada:', updatedRoute)
    return updatedRoute
  } catch (error) {
    console.error('Error al actualizar ruta:', error)
    throw error
  }
}

/**
 * Ejemplo 12: Eliminar una ruta
 */
export async function exampleDeleteRoute(routeId: string) {
  try {
    await routeApi.delete(routeId)
    console.log('Ruta eliminada exitosamente')
  } catch (error) {
    console.error('Error al eliminar ruta:', error)
    throw error
  }
}

// ============================================
// EJEMPLOS DE MANEJO DE ERRORES
// ============================================

/**
 * Ejemplo 13: Manejo avanzado de errores
 */
export async function exampleErrorHandling() {
  try {
    await authApi.login('invalid@email.com', 'wrongpassword')
  } catch (error: unknown) {
    // El error viene tipado desde lib/api.ts
    const apiError = error as { message: string; statusCode: number; errors?: Record<string, string[]> }

    if (apiError.statusCode === 401) {
      console.error('Credenciales inválidas')
    } else if (apiError.statusCode === 400) {
      console.error('Datos inválidos:', apiError.errors)
    } else if (apiError.statusCode === 500) {
      console.error('Error del servidor')
    }

    // Mostrar mensaje al usuario
    alert(apiError.message)
  }
}

/**
 * Ejemplo 14: Uso en componente React
 */
export function ExampleComponent() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true)
      setError(null)

      try {
        const data = await businessApi.list()
        setBusinesses(data)
      } catch (err: unknown) {
        const apiError = err as { message: string }
        setError(apiError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {businesses.map((business: unknown) => (
        <div key={business.id}>{business.name}</div>
      ))}
    </div>
  )
}

/**
 * Ejemplo 15: Custom Hook para fetch con loading
 */
export function useBusinesses() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    businessApi.list()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// Uso del hook
function MyComponent() {
  const { data, loading, error } = useBusinesses()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{JSON.stringify(data)}</div>
}

// ============================================
// NOTA: Importar useState y useEffect en tus componentes
// ============================================

/*
import { useState, useEffect } from 'react'
import { businessApi, authApi, routeApi } from '@/lib/api'
import { env } from '@/lib/env'
*/
