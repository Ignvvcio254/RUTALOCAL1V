"use client"

import { Navbar } from "@/components/navbar"
import { HeroSectionV2 } from "@/components/hero-section-v2"
import { NavigationCards } from "@/components/navigation-cards"
import { RecommendationsSection } from "@/components/recommendations-section"
import { RutaBot } from "@/components/ruta-bot"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <HeroSectionV2 />
      <NavigationCards />
      <RecommendationsSection />
      <div id="rutabot-container">
        <RutaBot />
      </div>
    </main>
  )
}
