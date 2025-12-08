"use client"

import { mainCategoriesArray, type MainCategoryId } from '@/lib/filters/filter-config'
import { useFilters } from '@/contexts/filter-context'
import { cn } from '@/lib/utils'

export function MainCategoryFilter() {
  const { filters, setMainCategory } = useFilters()

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          {mainCategoriesArray.map((category) => {
            const isActive = filters.mainCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => setMainCategory(category.id as MainCategoryId)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  "border-2 hover:scale-105 active:scale-95",
                  isActive
                    ? "border-current shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: `${category.color}15`,
                        color: category.color,
                        borderColor: category.color,
                      }
                    : undefined
                }
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
                {isActive && (
                  <span className="ml-1 text-xs opacity-75">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
