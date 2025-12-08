"use client"

import { getExperienceFilters } from '@/lib/filters/filter-config'
import { useFilters } from '@/contexts/filter-context'
import { cn } from '@/lib/utils'
import { Eye } from 'lucide-react'

export function ExperienceFilter() {
  const { filters, toggleExperience } = useFilters()
  const experienceFilters = getExperienceFilters(filters.mainCategory)

  if (experienceFilters.length === 0) return null

  return (
    <div className="border-b border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3">
          {/* Icono indicador */}
          <div className="flex items-center text-gray-400 pr-2 border-r border-gray-300">
            <Eye className="w-4 h-4" />
          </div>

          {experienceFilters.map((experience) => {
            const isActive = filters.experiences.includes(experience.id)

            return (
              <button
                key={experience.id}
                onClick={() => toggleExperience(experience.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  "border hover:scale-105 active:scale-95",
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                )}
              >
                <span>{experience.icon}</span>
                <span>{experience.label}</span>
                {isActive && (
                  <span className="ml-1 text-xs">✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
