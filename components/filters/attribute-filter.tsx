"use client"

import { attributeFiltersArray } from '@/lib/filters/filter-config'
import { useFilters } from '@/contexts/filter-context'
import { cn } from '@/lib/utils'

export function AttributeFilter() {
  const { filters, toggleAttribute } = useFilters()

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          {attributeFiltersArray.map((attribute) => {
            const isActive = filters.attributes.includes(attribute.id)

            return (
              <button
                key={attribute.id}
                onClick={() => toggleAttribute(attribute.id)}
                title={attribute.description}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                  "border hover:scale-105 active:scale-95",
                  isActive
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                )}
              >
                <span>{attribute.icon}</span>
                <span>{attribute.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
