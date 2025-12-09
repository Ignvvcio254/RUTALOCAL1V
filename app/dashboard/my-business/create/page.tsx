'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { TokenManager } from '@/lib/auth/token-manager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Upload, 
  X, 
  ImagePlus,
  Loader2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Categorías disponibles
const CATEGORIES = [
  { value: 'hospedaje', label: 'Hospedaje' },
  { value: 'gastronomia', label: 'Gastronomía' },
  { value: 'entretenimiento', label: 'Entretenimiento' },
  { value: 'compras', label: 'Compras' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'salud', label: 'Salud y Bienestar' },
  { value: 'educacion', label: 'Educación' },
  { value: 'deportes', label: 'Deportes' },
  { value: 'otros', label: 'Otros' }
]

// Rangos de precio
const PRICE_RANGES = [
  { value: 1, label: '$ - Económico' },
  { value: 2, label: '$$ - Moderado' },
  { value: 3, label: '$$$ - Alto' },
  { value: 4, label: '$$$$ - Premium' }
]

interface ImagePreview {
  file: File
  preview: string
}

export default function CreateBusinessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    price_range: 2,
    opening_hours: '',
    amenities: '',
    tags: ''
  })

  // Images
  const [coverImage, setCoverImage] = useState<ImagePreview | null>(null)
  const [galleryImages, setGalleryImages] = useState<ImagePreview[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB')
        return
      }
      setCoverImage({
        file,
        preview: URL.createObjectURL(file)
      })
      setError(null)
    }
  }

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (galleryImages.length + files.length > 10) {
      setError('Máximo 10 imágenes en la galería')
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Algunas imágenes superan los 5MB y fueron omitidas')
        return false
      }
      return true
    })

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setGalleryImages(prev => [...prev, ...newImages])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const removeCoverImage = () => {
    if (coverImage) {
      URL.revokeObjectURL(coverImage.preview)
      setCoverImage(null)
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const token = TokenManager.getAccessToken()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/business/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error al subir imagen')
    }

    const data = await response.json()
    return data.url || data.data?.url || data.image_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = TokenManager.getAccessToken()
      
      if (!token) {
        router.push('/login')
        return
      }

      // Validaciones básicas
      if (!formData.name || !formData.category || !formData.description || !formData.address) {
        setError('Por favor completa todos los campos obligatorios')
        setLoading(false)
        return
      }

      if (!coverImage) {
        setError('Debes subir una imagen de portada')
        setLoading(false)
        return
      }

      // Subir imagen de portada
      setUploadingImages(true)
      const coverImageUrl = await uploadImageToCloudinary(coverImage.file)

      // Subir imágenes de galería
      const galleryUrls = await Promise.all(
        galleryImages.map(img => uploadImageToCloudinary(img.file))
      )
      setUploadingImages(false)

      // Preparar datos del negocio
      const businessData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        price_range: formData.price_range,
        opening_hours: formData.opening_hours,
        cover_image: coverImageUrl,
        gallery_images: galleryUrls,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      // Crear negocio
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/owner/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(businessData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el negocio')
      }

      const newBusiness = await response.json()
      console.log('✅ Negocio creado:', newBusiness)

      // Redirigir al dashboard del negocio
      router.push(`/dashboard/my-business/${newBusiness.id}`)
    } catch (error) {
      console.error('❌ Error:', error)
      setError(error instanceof Error ? error.message : 'Error al crear el negocio')
      setLoading(false)
      setUploadingImages(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/my-business">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Negocios
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Negocio</h1>
          <p className="text-gray-600">
            Completa la información de tu negocio. Los campos marcados con * son obligatorios.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Información Básica
              </CardTitle>
              <CardDescription>Datos principales de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Negocio *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Restaurante La Buena Mesa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu negocio, servicios, especialidades..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_range">Rango de Precio</Label>
                <select
                  id="price_range"
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ubicación
              </CardTitle>
              <CardDescription>Dirección y coordenadas de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Dirección Completa *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle, número, comuna, ciudad"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="-33.4489"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="-70.6693"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contacto@negocio.com"
                />
              </div>

              <div>
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.minegocio.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Horarios y Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="opening_hours">Horario de Atención</Label>
                <Input
                  id="opening_hours"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleInputChange}
                  placeholder="Lun-Vie: 9:00-18:00, Sáb: 10:00-14:00"
                />
              </div>

              <div>
                <Label htmlFor="amenities">Comodidades (separadas por comas)</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="WiFi, Estacionamiento, Accesible, Aire acondicionado"
                />
              </div>

              <div>
                <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Familiar, Romántico, Para grupos, Pet friendly"
                />
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5" />
                Imágenes
              </CardTitle>
              <CardDescription>
                Sube imágenes de tu negocio (máximo 5MB por imagen)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Imagen de Portada */}
              <div>
                <Label className="mb-2 block">Imagen de Portada *</Label>
                {coverImage ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={coverImage.preview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click para subir imagen de portada</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Galería */}
              <div>
                <Label className="mb-2 block">Galería de Imágenes (opcional, máximo 10)</Label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={img.preview}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {galleryImages.length < 10 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50">
                    <ImagePlus className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-600">Agregar más imágenes</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/dashboard/my-business" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading || uploadingImages}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {uploadingImages ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo imágenes...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando negocio...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 mr-2" />
                  Crear Negocio
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
