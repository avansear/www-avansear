'use client'

import { motion } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'
import { useCursor } from './cursor-context'
import { ArrowIcon } from './arrow-icon'

export function CustomCursor() {
  const { isCursorEnabled, isCursorAllowed } = useCursor()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    setIsHovering(target.closest('a, button, [role="button"], input, select, textarea') !== null)
  }, [])

  const checkScreenSize = useCallback(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize, { passive: true })

    if (isCursorAllowed && isDesktop && isCursorEnabled) {
      const handleMouseEnter = () => setIsVisible(true)
      const handleMouseLeave = () => setIsVisible(false)
      document.addEventListener('mousemove', updateMousePosition, { passive: true })
      document.addEventListener('mouseenter', handleMouseEnter)
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('mouseover', handleMouseOver, { passive: true })
      return () => {
        window.removeEventListener('resize', checkScreenSize)
        document.removeEventListener('mousemove', updateMousePosition)
        document.removeEventListener('mouseenter', handleMouseEnter)
        document.removeEventListener('mouseleave', handleMouseLeave)
        document.removeEventListener('mouseover', handleMouseOver)
      }
    }

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [updateMousePosition, handleMouseOver, checkScreenSize, isDesktop, isCursorEnabled, isCursorAllowed])

  const offsetX = isHovering ? 6 : 4
  const offsetY = isHovering ? 6 : 4

  if (!isCursorAllowed || !isMounted || !isDesktop || !isCursorEnabled) {
    return null
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[70]"
      style={{ willChange: 'transform, opacity' }}
      initial={{ x: mousePosition.x - offsetX, y: mousePosition.y - offsetY, opacity: 0 }}
      animate={{
        x: mousePosition.x - offsetX,
        y: mousePosition.y - offsetY,
        opacity: isVisible ? 1 : 0,
        scale: isHovering ? 1 : [1, 1.6, 0.9],
      }}
      transition={{
        x: { type: 'tween', duration: 0 },
        y: { type: 'tween', duration: 0 },
        opacity: { duration: 0.15 },
        scale: isHovering
          ? { type: 'spring', stiffness: 300, damping: 25, mass: 0.3 }
          : { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {isHovering ? (
        <div className="relative flex items-center justify-center">
          <div className="absolute w-6 h-6 bg-[var(--color-dark)] rounded-full blur-sm opacity-60" />
          <div className="relative text-[var(--color-light)] z-10">
            <ArrowIcon />
          </div>
        </div>
      ) : (
        <div className="w-2 h-2 bg-[var(--color-light)] rounded-full" />
      )}
    </motion.div>
  )
}
