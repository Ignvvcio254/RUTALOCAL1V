"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface SwipeBackGestureProps {
  children: React.ReactNode
}

export function SwipeBackGesture({ children }: SwipeBackGestureProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [0, 100], [0, 1])
  const scale = useTransform(x, [0, 100], [0.8, 1])

  useEffect(() => {
    // Verificar si hay historial para volver
    setCanGoBack(window.history.length > 1)
  }, [])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Si el swipe es mayor a 100px y hay historial, navegar atrás
    if (info.offset.x > 100 && canGoBack) {
      router.back()
    }
    // Resetear posición
    x.set(0)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Indicador visual de swipe */}
      <motion.div
        style={{ opacity }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <motion.div
          style={{ scale }}
          className="ml-4 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl border border-gray-200"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </motion.div>
      </motion.div>

      {/* Contenedor con gesture */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.2, right: 0 }}
        dragDirectionLock
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}
