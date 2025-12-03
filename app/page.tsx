"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { RecommendationsSection } from "@/components/recommendations-section"
import { RutaBot } from "@/components/ruta-bot"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <HeroSection />
      <RecommendationsSection />
      <RutaBot />

      <div className="flex justify-center gap-4 py-8">
        <Link
          href="/map"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Explorar en Mapa
        </Link>
        <Link
          href="/builder"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Crear Ruta
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Mi Dashboard
        </Link>
      </div>
    </main>
  )
}
