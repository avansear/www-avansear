'use client'

import { motion } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isClickable = target.closest('a, button, [role="button"], input, select, textarea') !== null
    setIsHovering(isClickable)
  }, [])

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', updateMousePosition, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [updateMousePosition, handleMouseOver])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform"
      style={{
        x: mousePosition.x - (isHovering ? 6 : 4),
        y: mousePosition.y - (isHovering ? 6 : 4),
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isHovering ? 1 : [1, 1.6, 0.9],
      }}
      transition={{
        opacity: { duration: 0.15 },
        scale: isHovering 
          ? { 
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.3
            }
          : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
      }}
    >
      {isHovering ? (
        <ArrowUpRight 
          className="text-[var(--color-light)]" 
          size={12}
        />
      ) : (
        <div className="w-2 h-2 bg-[var(--color-light)] rounded-full" />
      )}
    </motion.div>
  )
}
