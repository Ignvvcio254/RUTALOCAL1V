'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TokenManager } from '@/lib/auth/token-manager'
import { toast } from 'sonner'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Procesando autenticación...')

  useEffect(() => {
    handleOAuthCallback()
  }, [])

  const handleOAuthCallback = async () => {
    try {
      console.log('🔄 [Callback] Iniciando proceso de callback...')
      console.log('📍 [Callback] URL actual:', window.location.href)

      // Obtener fragmento del hash (#access_token=...)
      const hash = window.location.hash.substring(1) // Remover el #
      const params = new URLSearchParams(hash)

      const accessToken = params.get('access_token')
      const providerToken = params.get('provider_token')
      const refreshToken = params.get('refresh_token')
      const expiresIn = params.get('expires_in')
      const tokenType = params.get('token_type')

      console.log('🔍 [Callback] Tokens detectados en hash URL')
      console.log('  - access_token:', accessToken ? 'presente ✅' : 'ausente ❌')
      console.log('  - provider_token:', providerToken ? 'presente ✅' : 'ausente ❌')

      if (!providerToken) {
        throw new Error('No se recibió el token de Google OAuth')
      }

      console.log('🌐 [Callback] Enviando token al backend:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`)

      // Enviar token al backend Django
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: providerToken, // Token de Google OAuth
        }),
      })

      console.log('📨 [Callback] Respuesta del backend:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ [Callback] Error del backend:', JSON.stringify(errorData))
        throw new Error(errorData.message || 'Error en la autenticación con Google')
      }

      const data = await response.json()
      console.log('✅ [Callback] Respuesta exitosa del backend')
      console.log('👤 [Callback] Usuario:', data.user?.email)

      if (!data.success || !data.tokens) {
        throw new Error('Respuesta inválida del servidor')
      }

      // Guardar tokens JWT del backend Django
      await TokenManager.saveTokens({
        accessToken: data.tokens.accessToken || data.tokens.access,
        refreshToken: data.tokens.refreshToken || data.tokens.refresh,
        tokenType: data.tokens.tokenType || 'Bearer',
        expiresIn: data.tokens.expiresIn || 3600,
      }, true)

      console.log('💾 [Callback] Tokens JWT guardados correctamente')

      // Mostrar mensaje de éxito
      setStatus('success')
      setMessage(data.message || 'Login exitoso con Google')
      toast.success('¡Bienvenido! Login exitoso con Google')

      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => {
        console.log('➡️ [Callback] Redirigiendo a dashboard...')
        router.push('/dashboard')
      }, 1000)

    } catch (error: any) {
      console.log('❌ [Callback] ERROR CRÍTICO:', error.message)
      console.log('Error completo:', error)

      setStatus('error')
      setMessage(error.message || 'Error en la autenticación')
      toast.error(error.message || 'Error en la autenticación con Google')

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        console.log('➡️ [Callback] Redirigiendo a login...')
        router.push('/login')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Procesando autenticación...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Éxito!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error de autenticación
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirigiendo al login...</p>
          </>
        )}
      </div>
    </div>
  )
}
