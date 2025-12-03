import * as React from "react"
import { cn } from "@/lib/utils"

// Base Card
export interface RutaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const RutaCard = React.forwardRef<HTMLDivElement, RutaCardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-gray-100 bg-white shadow-sm",
          interactive &&
            "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200",
          className,
        )}
        {...props}
      />
    )
  },
)
RutaCard.displayName = "RutaCard"

// Image Card with overlay
export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  aspectRatio?: "video" | "square" | "portrait"
  overlay?: React.ReactNode
  overlayPosition?: "top" | "bottom" | "full"
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ className, src, alt, aspectRatio = "video", overlay, overlayPosition = "bottom", children, ...props }, ref) => {
    const aspectClasses = {
      video: "aspect-video",
      square: "aspect-square",
      portrait: "aspect-[3/4]",
    }

    const overlayPositionClasses = {
      top: "top-0 left-0 right-0",
      bottom: "bottom-0 left-0 right-0",
      full: "inset-0",
    }

    return (
      <div
        ref={ref}
        className={cn("group relative overflow-hidden rounded-xl", aspectClasses[aspectRatio], className)}
        {...props}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {overlay && (
          <div
            className={cn(
              "absolute bg-gradient-to-t from-black/70 to-transparent p-4",
              overlayPositionClasses[overlayPosition],
            )}
          >
            {overlay}
          </div>
        )}
        {children}
      </div>
    )
  },
)
ImageCard.displayName = "ImageCard"

// Horizontal Card
export interface HorizontalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string
  imageAlt?: string
  imageWidth?: string
}

const HorizontalCard = React.forwardRef<HTMLDivElement, HorizontalCardProps>(
  ({ className, imageSrc, imageAlt = "", imageWidth = "w-1/3", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg",
          className,
        )}
        {...props}
      >
        {imageSrc && (
          <div className={cn("shrink-0 overflow-hidden", imageWidth)}>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              className="size-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </div>
    )
  },
)
HorizontalCard.displayName = "HorizontalCard"

// Card parts
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 pb-0", className)} {...props} />,
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 p-4 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { RutaCard, ImageCard, HorizontalCard, CardHeader, CardContent, CardFooter }
