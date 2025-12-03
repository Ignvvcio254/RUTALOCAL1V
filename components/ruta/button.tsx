"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const rutaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 shadow-md hover:shadow-lg focus-visible:ring-indigo-500",
        secondary:
          "border-2 border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-500",
        ghost: "text-gray-700 bg-transparent hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
        success:
          "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-md focus-visible:ring-emerald-500",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md [&_svg]:size-3.5",
        md: "h-10 px-4 text-sm rounded-lg [&_svg]:size-4",
        lg: "h-12 px-6 text-base rounded-lg [&_svg]:size-5",
        xl: "h-14 px-8 text-lg rounded-xl [&_svg]:size-6",
        icon: "size-10 rounded-lg [&_svg]:size-5",
        "icon-sm": "size-8 rounded-md [&_svg]:size-4",
        "icon-lg": "size-12 rounded-lg [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface RutaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rutaButtonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const RutaButton = React.forwardRef<HTMLButtonElement, RutaButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, leftIcon, rightIcon, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(rutaButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </Comp>
    )
  },
)
RutaButton.displayName = "RutaButton"

export { RutaButton, rutaButtonVariants }
