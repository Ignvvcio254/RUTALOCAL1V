/**
 * Cliente HTTP para la API de Django
 * Maneja autenticación, headers y errores de forma centralizada
 */

import { env, apiRoutes } from './env'

// Tipos para las respuestas de la API
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

/**
 * Cliente HTTP base con autenticación JWT
 */
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.apiEndpoint
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(env.storage.tokenKey)
  }

  /**
   * Obtiene los headers por defecto con autenticación
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Maneja errores de la API
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: ApiError

    try {
      const data = await response.json()
      errorData = {
        message: data.message || data.detail || 'Error desconocido',
        errors: data.errors,
        statusCode: response.status,
      }
    } catch {
      errorData = {
        message: response.statusText || 'Error en la comunicación con el servidor',
        statusCode: response.status,
      }
    }

    // Si es 401, limpiar sesión
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(env.storage.userKey)
        localStorage.removeItem(env.storage.tokenKey)
        window.location.href = '/login'
      }
    }

    throw errorData
  }

  /**
   * Realiza una petición GET
   */
  async get<T>(url: string, includeAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.json()
  }

  /**
   * Realiza una petición POST
   */
  async post<T, D = unknown>(url: string, data?: D, includeAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.json()
  }

  /**
   * Realiza una petición PUT
   */
  async put<T, D = unknown>(url: string, data?: D, includeAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.json()
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T, D = unknown>(url: string, data?: D, includeAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.json()
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(url: string, includeAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    // DELETE puede no retornar contenido
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient()

// Servicios de API específicos para cada módulo
export const authApi = {
  /**
   * Login con email y contraseña
   */
  login: async (email: string, password: string) => {
    return apiClient.post<{ user: unknown; token: string }>(
      apiRoutes.auth.login,
      { email, password },
      false
    )
  },

  /**
   * Registro de nuevo usuario
   */
  register: async (name: string, email: string, password: string) => {
    return apiClient.post<{ user: unknown; token: string }>(
      apiRoutes.auth.register,
      { name, email, password },
      false
    )
  },

  /**
   * Login con Google OAuth
   */
  loginWithGoogle: async (token: string) => {
    return apiClient.post<{ user: unknown; token: string }>(
      apiRoutes.auth.googleLogin,
      { token },
      false
    )
  },

  /**
   * Login con GitHub OAuth
   */
  loginWithGithub: async (code: string) => {
    return apiClient.post<{ user: unknown; token: string }>(
      apiRoutes.auth.githubLogin,
      { code },
      false
    )
  },

  /**
   * Logout
   */
  logout: async () => {
    return apiClient.post(apiRoutes.auth.logout, {}, true)
  },

  /**
   * Obtener usuario actual
   */
  me: async () => {
    return apiClient.get(apiRoutes.auth.me, true)
  },

  /**
   * Refresh token
   */
  refresh: async (refreshToken: string) => {
    return apiClient.post<{ token: string }>(
      apiRoutes.auth.refresh,
      { refresh_token: refreshToken },
      false
    )
  },
}

export const businessApi = {
  /**
   * Obtener lista de negocios
   */
  list: async (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return apiClient.get(`${apiRoutes.businesses.list}${queryString}`)
  },

  /**
   * Obtener detalle de un negocio
   */
  detail: async (id: string) => {
    return apiClient.get(apiRoutes.businesses.detail(id))
  },

  /**
   * Buscar negocios
   */
  search: async (query: string) => {
    return apiClient.get(`${apiRoutes.businesses.search}?q=${encodeURIComponent(query)}`)
  },
}

export const routeApi = {
  /**
   * Obtener rutas del usuario
   */
  list: async () => {
    return apiClient.get(apiRoutes.routes.list)
  },

  /**
   * Obtener detalle de una ruta
   */
  detail: async (id: string) => {
    return apiClient.get(apiRoutes.routes.detail(id))
  },

  /**
   * Crear nueva ruta
   */
  create: async (data: unknown) => {
    return apiClient.post(apiRoutes.routes.create, data)
  },

  /**
   * Actualizar ruta
   */
  update: async (id: string, data: unknown) => {
    return apiClient.put(apiRoutes.routes.update(id), data)
  },

  /**
   * Eliminar ruta
   */
  delete: async (id: string) => {
    return apiClient.delete(apiRoutes.routes.delete(id))
  },
}

export default apiClient
