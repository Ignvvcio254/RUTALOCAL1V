"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { NavbarHome } from "@/components/navbar-home"
import { MainCategoryFilter } from "@/components/filters/main-category-filter"
import { ExperienceFilter } from "@/components/filters/experience-filter"
import { AttributeFilter } from "@/components/filters/attribute-filter"
import { BusinessFeed } from "@/components/business-feed"
import { BottomNav } from "@/components/bottom-nav"
import { FilterProvider } from "@/contexts/filter-context"

export default function Home() {
  const router = useRouter()

  // Handler para capturar tokens de Supabase OAuth en el hash
  useEffect(() => {
    const hash = window.location.hash

    if (hash && hash.includes('access_token')) {
      console.log('🔍 [Home] Detectados tokens de Supabase en hash URL')
      console.log('🔀 [Home] Redirigiendo a /auth/callback...')

      // Extraer tokens del hash y pasarlos al callback
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')

      if (accessToken) {
        console.log('✅ [Home] Access token encontrado, redirigiendo...')
        // Redirigir al callback con el hash completo
        router.replace(`/auth/callback${hash}`)
      }
    }
  }, [router])

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

        {/* Bottom Navigation (solo mobile) */}
        <BottomNav />
      </main>
    </FilterProvider>
  )
}
