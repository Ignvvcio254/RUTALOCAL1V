"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RutaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  rounded?: "default" | "full"
}

const RutaInput = React.forwardRef<HTMLInputElement, RutaInputProps>(
  ({ className, type, leftIcon, rightIcon, error, rounded = "default", ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 [&_svg]:size-5">{leftIcon}</div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full border bg-white px-4 py-2 text-base shadow-sm transition-all duration-200 outline-none",
              "placeholder:text-gray-400",
              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              rounded === "default" ? "rounded-lg" : "rounded-full",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200",
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 [&_svg]:size-5">{rightIcon}</div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)
RutaInput.displayName = "RutaInput"

// Search Input with clear button
export interface SearchInputProps extends Omit<RutaInputProps, "rightIcon"> {
  onClear?: () => void
  searchIcon?: React.ReactNode
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, searchIcon, className, ...props }, ref) => {
    return (
      <RutaInput
        ref={ref}
        type="search"
        value={value}
        leftIcon={searchIcon}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full p-0.5 hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null
        }
        className={className}
        {...props}
      />
    )
  },
)
SearchInput.displayName = "SearchInput"

// Textarea with character counter
export interface RutaTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  maxLength?: number
  showCount?: boolean
}

const RutaTextarea = React.forwardRef<HTMLTextAreaElement, RutaTextareaProps>(
  ({ className, error, maxLength, showCount = false, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0

    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none resize-none",
            "placeholder:text-gray-400",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200",
            className,
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {showCount && maxLength && (
            <p className={cn("text-sm ml-auto", charCount >= maxLength ? "text-red-500" : "text-gray-400")}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  },
)
RutaTextarea.displayName = "RutaTextarea"

// Floating Label Input
export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || "floating-input-id" // Use a static ID instead of React.useId

    return (
      <div className="relative w-full">
        <input
          id={inputId}
          className={cn(
            "peer flex h-14 w-full rounded-lg border bg-white px-4 pt-5 pb-2 text-base shadow-sm transition-all duration-200 outline-none",
            "placeholder-transparent",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200",
            className,
          )}
          placeholder={label}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-4 text-gray-400 transition-all duration-200 pointer-events-none",
            "peer-placeholder-shown:text-base peer-placeholder-shown:top-4",
            "peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs",
            error && "peer-focus:text-red-500",
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)
FloatingInput.displayName = "FloatingInput"

export { RutaInput, SearchInput, RutaTextarea, FloatingInput }
