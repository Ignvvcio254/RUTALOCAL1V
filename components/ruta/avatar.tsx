"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
}

export interface RutaAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "away" | "busy"
}

const RutaAvatar = React.forwardRef<HTMLDivElement, RutaAvatarProps>(
  ({ className, src, alt, fallback, size = "md", status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const initials = fallback
      ? fallback
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?"

    const statusColors = {
      online: "bg-emerald-500",
      offline: "bg-gray-400",
      away: "bg-amber-500",
      busy: "bg-red-500",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-medium text-white",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src || "/placeholder.svg"}
            alt={alt || "Avatar"}
            className="size-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
              statusColors[status],
              size === "xs" && "size-1.5",
              size === "sm" && "size-2",
              size === "md" && "size-2.5",
              size === "lg" && "size-3",
              size === "xl" && "size-4",
            )}
          />
        )}
      </div>
    )
  },
)
RutaAvatar.displayName = "RutaAvatar"

// Avatar Group / Stack
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string
    alt?: string
    fallback?: string
  }>
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    return (
      <div ref={ref} className={cn("flex items-center -space-x-2", className)} {...props}>
        {visibleAvatars.map((avatar, i) => (
          <RutaAvatar
            key={i}
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
            className="ring-2 ring-white"
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 ring-2 ring-white",
              sizeClasses[size],
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  },
)
AvatarGroup.displayName = "AvatarGroup"

export { RutaAvatar, AvatarGroup }
