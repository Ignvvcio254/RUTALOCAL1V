import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text"
  animation?: "pulse" | "shimmer" | "none"
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangle", animation = "pulse", width, height, style, ...props }, ref) => {
    const variantClasses = {
      rectangle: "rounded-lg",
      circle: "rounded-full",
      text: "rounded h-4 w-full",
    }

    const animationClasses = {
      pulse: "animate-pulse",
      shimmer: "skeleton-shimmer",
      none: "",
    }

    return (
      <div
        ref={ref}
        className={cn("bg-gray-200", variantClasses[variant], animationClasses[animation], className)}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    )
  },
)
Skeleton.displayName = "Skeleton"

// Preset skeleton patterns
const SkeletonText = ({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-3/4" : "w-full"} />
    ))}
  </div>
)

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border border-gray-100 p-4 space-y-4", className)}>
    <Skeleton height={200} className="w-full" />
    <Skeleton height={20} className="w-3/4" />
    <SkeletonText lines={2} />
    <div className="flex items-center gap-2">
      <Skeleton variant="circle" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton height={12} className="w-1/2" />
        <Skeleton height={12} className="w-1/3" />
      </div>
    </div>
  </div>
)

const SkeletonAvatar = ({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) => <Skeleton variant="circle" width={size} height={size} className={className} />

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar }
