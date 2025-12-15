/**
 * Sistema centralizado de manejo de errores
 * Proporciona utilidades para normalizar, categorizar y presentar errores al usuario
 *
 * @author Claude Sonnet 4.5
 * @module ErrorHandler
 */

import { toast } from '@/hooks/use-toast'

/**
 * Tipos de errores soportados
 */
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Categorías de severidad
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Interfaz para errores normalizados
 */
export interface NormalizedError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string
  technicalDetails?: string
  statusCode?: number
  timestamp: Date
}

/**
 * Clase base para errores de la aplicación
 */
export class AppError extends Error {
  type: ErrorType
  severity: ErrorSeverity
  userMessage: string
  statusCode?: number
  technicalDetails?: string

  constructor(
    message: string,
    userMessage: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.severity = severity
    this.userMessage = userMessage
    this.statusCode = statusCode
    this.technicalDetails = message
  }
}

/**
 * Normaliza cualquier tipo de error a una estructura estándar
 */
export function normalizeError(error: unknown): NormalizedError {
  const timestamp = new Date()

  // Error de aplicación personalizado
  if (error instanceof AppError) {
    return {
      type: error.type,
      severity: error.severity,
      message: error.message,
      userMessage: error.userMessage,
      technicalDetails: error.technicalDetails,
      statusCode: error.statusCode,
      timestamp,
    }
  }

  // Error estándar de JavaScript
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      message: error.message,
      userMessage: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      technicalDetails: error.stack,
      timestamp,
    }
  }

  // Error de API (objeto)
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any

    // Determinar mensaje
    const message =
      errorObj.error ||
      errorObj.message ||
      errorObj.detail ||
      'Error desconocido'

    // Determinar tipo basado en status code
    const statusCode = errorObj.statusCode || errorObj.status
    const type = getErrorTypeFromStatus(statusCode)

    return {
      type,
      severity: getSeverityFromType(type),
      message: typeof message === 'string' ? message : JSON.stringify(message),
      userMessage: getUserMessageFromType(type, message),
      statusCode,
      technicalDetails: JSON.stringify(errorObj),
      timestamp,
    }
  }

  // Error desconocido
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.ERROR,
    message: String(error),
    userMessage: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
    timestamp,
  }
}

/**
 * Determina el tipo de error basado en el código de estado HTTP
 */
function getErrorTypeFromStatus(statusCode?: number): ErrorType {
  if (!statusCode) return ErrorType.UNKNOWN

  if (statusCode === 400) return ErrorType.VALIDATION
  if (statusCode === 401) return ErrorType.AUTHENTICATION
  if (statusCode === 403) return ErrorType.AUTHORIZATION
  if (statusCode === 404) return ErrorType.NOT_FOUND
  if (statusCode >= 500) return ErrorType.SERVER
  if (statusCode === 0 || !navigator.onLine) return ErrorType.NETWORK

  return ErrorType.UNKNOWN
}

/**
 * Determina la severidad basada en el tipo de error
 */
function getSeverityFromType(type: ErrorType): ErrorSeverity {
  switch (type) {
    case ErrorType.NETWORK:
      return ErrorSeverity.WARNING
    case ErrorType.VALIDATION:
      return ErrorSeverity.INFO
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      return ErrorSeverity.ERROR
    case ErrorType.SERVER:
      return ErrorSeverity.CRITICAL
    default:
      return ErrorSeverity.ERROR
  }
}

/**
 * Genera un mensaje amigable para el usuario basado en el tipo de error
 */
function getUserMessageFromType(type: ErrorType, technicalMessage?: string): string {
  const baseMessages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]:
      'No se pudo conectar al servidor. Verifica tu conexión a internet.',
    [ErrorType.VALIDATION]:
      technicalMessage || 'Los datos proporcionados no son válidos. Por favor, revisa el formulario.',
    [ErrorType.AUTHENTICATION]:
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    [ErrorType.AUTHORIZATION]:
      'No tienes permisos para realizar esta acción.',
    [ErrorType.NOT_FOUND]:
      'El recurso solicitado no fue encontrado.',
    [ErrorType.SERVER]:
      'Ocurrió un error en el servidor. Nuestro equipo ha sido notificado.',
    [ErrorType.UNKNOWN]:
      'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
  }

  return baseMessages[type]
}

/**
 * Muestra un error al usuario usando el sistema de toast
 */
export function showError(error: unknown, customTitle?: string) {
  const normalized = normalizeError(error)

  // Log técnico para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', {
      type: normalized.type,
      severity: normalized.severity,
      message: normalized.message,
      technicalDetails: normalized.technicalDetails,
      statusCode: normalized.statusCode,
      timestamp: normalized.timestamp,
    })
  }

  // Mostrar toast al usuario
  toast({
    title: customTitle || getErrorTitle(normalized.type),
    description: normalized.userMessage,
    variant: 'destructive',
    duration: getSeverityDuration(normalized.severity),
  })
}

/**
 * Obtiene el título apropiado para el tipo de error
 */
function getErrorTitle(type: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: 'Error de Conexión',
    [ErrorType.VALIDATION]: 'Datos Inválidos',
    [ErrorType.AUTHENTICATION]: 'Sesión Expirada',
    [ErrorType.AUTHORIZATION]: 'Acceso Denegado',
    [ErrorType.NOT_FOUND]: 'No Encontrado',
    [ErrorType.SERVER]: 'Error del Servidor',
    [ErrorType.UNKNOWN]: 'Error',
  }

  return titles[type]
}

/**
 * Determina la duración del toast basado en la severidad
 */
function getSeverityDuration(severity: ErrorSeverity): number {
  switch (severity) {
    case ErrorSeverity.INFO:
      return 3000
    case ErrorSeverity.WARNING:
      return 4000
    case ErrorSeverity.ERROR:
      return 5000
    case ErrorSeverity.CRITICAL:
      return 7000
    default:
      return 5000
  }
}

/**
 * Wrapper para fetch que maneja errores automáticamente
 */
export async function fetchWithErrorHandling<T = any>(
  url: string,
  options?: RequestInit,
  errorTitle?: string
): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      // Intentar parsear el cuerpo del error
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }

      throw new AppError(
        errorData.error || errorData.message || 'Request failed',
        getUserMessageFromType(getErrorTypeFromStatus(response.status)),
        getErrorTypeFromStatus(response.status),
        getSeverityFromType(getErrorTypeFromStatus(response.status)),
        response.status
      )
    }

    return await response.json()
  } catch (error) {
    showError(error, errorTitle)
    throw error
  }
}

/**
 * Hook para manejar errores en componentes
 */
export function useErrorHandler() {
  const handleError = (error: unknown, customTitle?: string) => {
    showError(error, customTitle)
  }

  const handleAsyncError = async <T,>(
    asyncFn: () => Promise<T>,
    errorTitle?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error, errorTitle)
      return null
    }
  }

  return { handleError, handleAsyncError }
}
