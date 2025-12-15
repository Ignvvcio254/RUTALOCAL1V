"use client"

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, User, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import {
  getBusinessReviews,
  createReview,
  markReviewHelpful,
  type Review,
  type ReviewStats,
} from '@/lib/api/interactions-service'

interface ReviewSectionProps {
  businessId: string
  businessName: string
}

/**
 * ReviewSection Component
 * Displays reviews and allows users to submit new reviews.
 */
export function ReviewSection({ businessId, businessName }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [newRating, setNewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newContent, setNewContent] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await getBusinessReviews(businessId)
        setReviews(response.data.results)
        setStats(response.data.stats)
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [businessId])

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para dejar una reseña", variant: "destructive" })
      return
    }
    if (newRating === 0) {
      toast({ title: "Selecciona una calificación", description: "Por favor selecciona cuántas estrellas merece este lugar", variant: "destructive" })
      return
    }
    if (newContent.trim().length < 10) {
      toast({ title: "Reseña muy corta", description: "Por favor escribe al menos 10 caracteres", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      const response = await createReview(businessId, { rating: newRating, comment: newContent.trim() })
      setReviews((prev) => [response.data, ...prev])
      if (stats) {
        setStats({
          ...stats,
          total_reviews: stats.total_reviews + 1,
          average_rating: ((stats.average_rating * stats.total_reviews) + newRating) / (stats.total_reviews + 1),
        })
      }
      setNewRating(0)
      setNewContent('')
      setShowForm(false)
      toast({ title: "¡Gracias por tu reseña!", description: "Tu opinión ayuda a otros usuarios" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo publicar la reseña", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para marcar como útil" })
      return
    }
    try {
      await markReviewHelpful(reviewId)
      setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r))
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= (interactive ? (hoverRating || newRating) : rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer transition-colors' : ''}`}
          onClick={() => interactive && setNewRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  )

  if (loading) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.average_rating.toFixed(1)}</div>
            {renderStars(Math.round(stats.average_rating))}
            <div className="text-sm text-gray-500 mt-1">{stats.total_reviews} reseñas</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.rating_distribution[String(stars)] || 0
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-8 text-gray-500">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 hover:bg-indigo-700">Escribir una reseña</Button>
      ) : (
        <div className="p-4 border rounded-xl space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Tu reseña de {businessName}</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">¿Qué calificación le das?</label>
            {renderStars(newRating, true, 'w-8 h-8')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Cuéntanos tu experiencia</label>
            <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="¿Qué te pareció este lugar?" rows={4} className="resize-none" />
            <div className="text-xs text-gray-400 mt-1">{newContent.length}/500 caracteres</div>
          </div>
          <Button onClick={handleSubmitReview} disabled={submitting || newRating === 0 || newContent.length < 10} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publicando...</> : <><Send className="w-4 h-4 mr-2" />Publicar reseña</>}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Sé el primero en dejar una reseña</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  {review.user.avatar ? <img src={review.user.avatar} alt={review.user.name} className="w-full h-full rounded-full object-cover" /> : <User className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.user.name}</span>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('es-CL')}</span>
                  </div>
                  {renderStars(review.rating)}
                  <p className="mt-2 text-gray-700">{(review as any).comment || review.content}</p>
                  <button onClick={() => handleMarkHelpful(review.id)} className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" /><span>Útil ({review.helpful_count})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
