'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { TokenManager } from '@/lib/auth/token-manager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Plus, Eye, Star, Heart, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Business {
  id: string
  name: string
  status: string
  rating: number
  review_count: number
  views: number
  favorites_count: number
  cover_image: string
}

interface OwnerProfile {
  can_create_businesses: boolean
  max_businesses_allowed: number
  businesses_created_count: number
  can_create_more: boolean
  remaining_slots: string | number
}

export default function MyBusinessesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      // Usar TokenManager para obtener el token
      const token = TokenManager.getAccessToken()
      
      if (!token) {
        console.error('❌ No token found - redirecting to login')
        router.push('/login')
        return
      }
      
      console.log('✅ Token found, fetching owner data...')
      
      // Obtener perfil
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/owner/profile/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!profileRes.ok) {
        console.error('❌ Profile fetch failed:', profileRes.status, profileRes.statusText)
        if (profileRes.status === 401) {
          console.log('🔄 Token expired, redirecting to login...')
          TokenManager.clearTokens()
          router.push('/login')
          return
        }
        throw new Error(`Failed to fetch profile: ${profileRes.statusText}`)
      }
      
      const profileData = await profileRes.json()
      console.log('✅ Profile loaded:', profileData)
      setProfile(profileData)

      // Obtener negocios
      const businessesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/owner/my-businesses/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!businessesRes.ok) {
        console.error('❌ Businesses fetch failed:', businessesRes.status, businessesRes.statusText)
        throw new Error(`Failed to fetch businesses: ${businessesRes.statusText}`)
      }
      
      const businessesData = await businessesRes.json()
      console.log('✅ Businesses loaded:', businessesData)
      setBusinesses(businessesData)
    } catch (error) {
      console.error('❌ Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'draft': { label: 'Borrador', className: 'bg-gray-200 text-gray-700', icon: Clock },
      'pending_review': { label: 'Pendiente', className: 'bg-yellow-200 text-yellow-800', icon: Clock },
      'published': { label: 'Publicado', className: 'bg-green-200 text-green-800', icon: CheckCircle },
      'rejected': { label: 'Rechazado', className: 'bg-red-200 text-red-800', icon: XCircle },
    }
    const badge = badges[status as keyof typeof badges] || badges.draft
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!profile?.can_create_businesses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Acceso Denegado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No tienes permisos para crear negocios. Contacta al administrador para obtener acceso.
            </p>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Negocios</h1>
          <p className="text-gray-600">
            Has creado {profile.businesses_created_count} de {profile.max_businesses_allowed === -1 ? '∞' : profile.max_businesses_allowed} negocios permitidos
            {profile.remaining_slots !== 'Ilimitado' && ` • Quedan ${profile.remaining_slots} espacios`}
          </p>
        </div>

        {/* Actions */}
        {profile.can_create_more && (
          <div className="mb-6">
            <Link href="/dashboard/my-business/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Negocio
              </Button>
            </Link>
          </div>
        )}

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes negocios</h3>
              <p className="text-gray-600 mb-4">Crea tu primer negocio y comienza a recibir clientes</p>
              {profile.can_create_more && (
                <Link href="/dashboard/my-business/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Mi Primer Negocio
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <img 
                  src={business.cover_image} 
                  alt={business.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    {getStatusBadge(business.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {business.views} vistas
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {business.rating ? Number(business.rating).toFixed(1) : '0.0'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      {business.favorites_count}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {business.review_count} reviews
                    </div>
                  </div>
                  <Link href={`/dashboard/my-business/${business.id}`}>
                    <Button variant="outline" className="w-full">
                      Ver Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
