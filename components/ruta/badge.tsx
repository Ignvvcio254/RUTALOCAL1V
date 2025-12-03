import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const rutaBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1 font-medium transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 border border-gray-200",
        success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-100 text-amber-800 border border-amber-200",
        error: "bg-red-100 text-red-800 border border-red-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200",
        purple: "bg-purple-100 text-purple-800 border border-purple-200",
        indigo: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px] [&_svg]:size-2.5",
        md: "px-2 py-0.5 text-xs [&_svg]:size-3",
        lg: "px-2.5 py-1 text-sm [&_svg]:size-3.5",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
    },
  },
)

export interface RutaBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof rutaBadgeVariants> {
  icon?: React.ReactNode
}

const RutaBadge = React.forwardRef<HTMLSpanElement, RutaBadgeProps>(
  ({ className, variant, size, shape, icon, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(rutaBadgeVariants({ variant, size, shape, className }))} {...props}>
        {icon}
        {children}
      </span>
    )
  },
)
RutaBadge.displayName = "RutaBadge"

// Preset badges for common use cases
const VerificadoBadge = () => (
  <RutaBadge variant="success" size="sm" shape="pill">
    Verificado
  </RutaBadge>
)

const NuevoBadge = () => (
  <RutaBadge variant="info" size="sm" shape="pill">
    Nuevo
  </RutaBadge>
)

const PopularBadge = () => (
  <RutaBadge variant="purple" size="sm" shape="pill">
    Popular
  </RutaBadge>
)

const CerradoBadge = () => (
  <RutaBadge variant="error" size="sm" shape="pill">
    Cerrado
  </RutaBadge>
)

const AbiertoBadge = () => (
  <RutaBadge variant="success" size="sm" shape="pill">
    Abierto
  </RutaBadge>
)

export { RutaBadge, rutaBadgeVariants, VerificadoBadge, NuevoBadge, PopularBadge, CerradoBadge, AbiertoBadge }
