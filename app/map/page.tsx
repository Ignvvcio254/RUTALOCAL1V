'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MapPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new interactive map
    router.replace('/map-interactive')
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al mapa interactivo...</p>
      </div>
    </div>
  )
}
