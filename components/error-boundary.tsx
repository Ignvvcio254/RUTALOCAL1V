'use client'

/**
 * Error Boundary Global para la aplicación
 * Captura errores de React y proporciona UI de recuperación
 *
 * @author Claude Sonnet 4.5
 * @module ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Captura errores en el árbol de componentes de React
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging
    console.error('🔴 Error Boundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Aquí podrías enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Algo salió mal</CardTitle>
                  <CardDescription>
                    Ha ocurrido un error inesperado en la aplicación
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensaje de error para el usuario */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">
                  Detalles del error:
                </h3>
                <p className="text-sm text-red-700 font-mono break-words">
                  {this.state.error?.message || 'Error desconocido'}
                </p>
              </div>

              {/* Detalles técnicos (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                    Información técnica (solo en desarrollo)
                  </summary>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-96 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Sugerencias para el usuario */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  ¿Qué puedes hacer?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Intenta recargar la página</li>
                  <li>Verifica tu conexión a internet</li>
                  <li>Si el problema persiste, contacta a soporte</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar nuevamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook para lanzar errores desde componentes funcionales
 */
export function useErrorBoundary() {
  const [, setState] = React.useState()

  return React.useCallback((error: Error) => {
    setState(() => {
      throw error
    })
  }, [])
}
