"use client"

import { useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { MetricsRow } from "./metrics-row"
import { ChartsSection } from "./charts-section"
import { ActivityFeed } from "./activity-feed"
import { AiRecommendations } from "./ai-recommendations"
import { QuickActionsSidebar } from "./quick-actions-sidebar"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function DashboardContainer() {
  const [dateRange, setDateRange] = useState("7d")
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 1024px)")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${isMobile ? "w-full" : "w-[80%]"}`}>
          <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
            <MetricsRow />
            <ChartsSection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed />
              <AiRecommendations />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-[20%] min-w-[240px]">
            <QuickActionsSidebar />
          </div>
        )}

        {/* Mobile Bottom Sheet Trigger */}
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg z-50"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
              <QuickActionsSidebar isMobile onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}
