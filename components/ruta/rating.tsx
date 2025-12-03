"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewCount?: number
  className?: string
}

const sizeClasses = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-6",
}

const RatingDisplay = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: RatingDisplayProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={cn("fill-amber-400 text-amber-400", sizeClasses[size])} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn("text-gray-200", sizeClasses[size])} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn("fill-amber-400 text-amber-400", sizeClasses[size])} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn("text-gray-200", sizeClasses[size])} />
        ))}
      </div>
      {showValue && (
        <span
          className={cn(
            "font-medium text-gray-700",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span
          className={cn(
            "text-gray-400",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          ({reviewCount})
        </span>
      )}
    </div>
  )
}

// Interactive Rating
export interface InteractiveRatingProps {
  value: number
  onChange: (value: number) => void
  maxRating?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const InteractiveRating = ({ value, onChange, maxRating = 5, size = "md", className }: InteractiveRatingProps) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const displayValue = hoverValue ?? value

  return (
    <div className={cn("flex items-center", className)} onMouseLeave={() => setHoverValue(null)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= displayValue

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            aria-label={`Rate ${starValue} out of ${maxRating}`}
          >
            <Star
              className={cn(
                "transition-colors",
                sizeClasses[size],
                isFilled ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { RatingDisplay, InteractiveRating }
