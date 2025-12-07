"use client"

import { RouteBuilderContainer } from "@/components/route-builder/route-builder-container"
import { BottomNav } from "@/components/bottom-nav"

export default function RouteBuilderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20 lg:pb-0">
      <RouteBuilderContainer />

      {/* Bottom Navigation (solo mobile) */}
      <BottomNav />
    </main>
  )
}
