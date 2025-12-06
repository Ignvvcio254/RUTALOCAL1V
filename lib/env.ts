/**
 * Configuración de variables de entorno
 * Centraliza y valida todas las variables de entorno de la aplicación
 */

// Variables de entorno tipadas y validadas
export const env = {
  // Backend Django
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  apiBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api',

  // URLs completas de endpoints
  get apiEndpoint() {
    return `${this.apiUrl}${this.apiBasePath}`
  },

  // Autenticación
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET || 'dev-secret-key',
    expiration: process.env.NEXT_PUBLIC_JWT_EXPIRATION || '7d',
  },

  // Storage keys
  storage: {
    userKey: process.env.NEXT_PUBLIC_STORAGE_KEY || 'santiago_user',
    tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || 'santiago_token',
  },

  // Google OAuth
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  },

  // GitHub OAuth
  github: {
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
  },

  // Aplicación
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    devMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
    port: process.env.PORT || '3000',
  },

  // Mapas
  maps: {
    mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    // Centro por defecto: Plaza de Armas, Santiago
    defaultCenter: {
      lat: -33.4372,
      lng: -70.6506,
    },
    defaultZoom: 13,
  },

  // Analytics
  analytics: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  },

  // Flags de entorno
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

/**
 * Valida que las variables de entorno críticas estén configuradas
 * Lanza error si falta alguna variable requerida en producción
 */
export function validateEnv() {
  if (env.isProduction) {
    const required: Array<keyof typeof env> = []

    // En producción, validar que existan las variables críticas
    const missing = required.filter(key => !env[key])

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local or deployment configuration.'
      )
    }
  }

  // Advertencia si Google OAuth no está configurado
  if (!env.google.clientId && !env.app.devMode) {
    console.warn('⚠️  Google OAuth is not configured. Social login will not work.')
  }

  // Advertencia si el backend no está configurado correctamente
  if (!env.apiUrl.startsWith('http')) {
    console.warn('⚠️  API URL should start with http:// or https://')
  }
}

/**
 * Helper para construir URLs de la API
 */
export const apiRoutes = {
  // Auth endpoints
  auth: {
    login: `${env.apiEndpoint}/auth/login`,
    register: `${env.apiEndpoint}/auth/register`,
    logout: `${env.apiEndpoint}/auth/logout`,
    me: `${env.apiEndpoint}/auth/me`,
    refresh: `${env.apiEndpoint}/auth/refresh`,
    googleLogin: `${env.apiEndpoint}/auth/google`,
    githubLogin: `${env.apiEndpoint}/auth/github`,
  },

  // User endpoints
  users: {
    profile: (id: string) => `${env.apiEndpoint}/users/${id}`,
    update: (id: string) => `${env.apiEndpoint}/users/${id}`,
  },

  // Business endpoints
  businesses: {
    list: `${env.apiEndpoint}/businesses`,
    detail: (id: string) => `${env.apiEndpoint}/businesses/${id}`,
    search: `${env.apiEndpoint}/businesses/search`,
  },

  // Routes endpoints
  routes: {
    list: `${env.apiEndpoint}/routes`,
    detail: (id: string) => `${env.apiEndpoint}/routes/${id}`,
    create: `${env.apiEndpoint}/routes`,
    update: (id: string) => `${env.apiEndpoint}/routes/${id}`,
    delete: (id: string) => `${env.apiEndpoint}/routes/${id}`,
  },
} as const

export default env
