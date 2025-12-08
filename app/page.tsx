"use client"

import { NavbarHome } from "@/components/navbar-home"
import { MainCategoryFilter } from "@/components/filters/main-category-filter"
import { ExperienceFilter } from "@/components/filters/experience-filter"
import { AttributeFilter } from "@/components/filters/attribute-filter"
import { BusinessFeed } from "@/components/business-feed"
import { RutaBot } from "@/components/ruta-bot"
import { BottomNav } from "@/components/bottom-nav"
import { FilterProvider } from "@/contexts/filter-context"

export default function Home() {
  return (
    <FilterProvider>
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        {/* Navbar Sticky */}
        <NavbarHome />

        {/* Filtros Sticky */}
        <div className="sticky top-16 z-40 bg-white shadow-sm">
          <MainCategoryFilter />
          <ExperienceFilter />
          <AttributeFilter />
        </div>

        {/* Feed de Negocios */}
        <BusinessFeed />

        {/* RutaBot Flotante (solo desktop) */}
        <div id="rutabot-container">
          <RutaBot />
        </div>

        {/* Bottom Navigation (solo mobile) */}
        <BottomNav />
      </main>
    </FilterProvider>
  )
}
