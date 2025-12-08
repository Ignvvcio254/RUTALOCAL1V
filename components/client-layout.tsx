"use client"

import { SwipeBackGesture } from "./swipe-back-gesture"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SwipeBackGesture>
      {children}
    </SwipeBackGesture>
  )
}
