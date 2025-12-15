'use client'

/**
 * Error Page Global de Next.js
 * Se muestra cuando hay errores en Server Components o Client Components
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('🔴 Next.js Error Page:', error)

    // In production, you would log to an error reporting service
    // logErrorToService(error)
  }, [error])

  const handleGoHome = () => {
    window.location.href = '/'
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
                Ha ocurrido un error inesperado
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mensaje de error */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">
              Detalles del error:
            </h3>
            <p className="text-sm text-red-700 font-mono break-words">
              {error.message || 'Error desconocido'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                ID del error: {error.digest}
              </p>
            )}
          </div>

          {/* Detalles técnicos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                Stack trace (solo en desarrollo)
              </summary>
              <pre className="text-xs text-gray-700 overflow-auto max-h-96 mt-2 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          )}

          {/* Sugerencias */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Intenta recargar la página usando el botón de abajo</li>
              <li>Verifica tu conexión a internet</li>
              <li>Limpia la caché de tu navegador</li>
              <li>Si el problema persiste, contacta a soporte técnico</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              onClick={reset}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar nuevamente
            </Button>
            <Button
              onClick={handleGoHome}
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
