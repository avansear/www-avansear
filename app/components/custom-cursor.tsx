'use client'

import { motion } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'

function ArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

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
    // Browser detection for specific optimizations
    const userAgent = navigator.userAgent.toLowerCase()
    const isFirefox = userAgent.indexOf('firefox') > -1
    const isSafari = userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1
    const isWebKit = userAgent.indexOf('webkit') > -1
    
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', updateMousePosition, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    // Browser-specific cursor hiding optimizations
    if (isFirefox) {
      document.body.style.cursor = 'none'
      document.documentElement.style.cursor = 'none'
    }
    
    if (isSafari || isWebKit) {
      // Safari sometimes needs additional cursor hiding
      document.body.style.cursor = 'none'
      document.documentElement.style.cursor = 'none'
      // Force Safari to respect cursor: none on all elements
      const style = document.createElement('style')
      style.textContent = `
        *, *::before, *::after {
          cursor: none !important;
          -webkit-cursor: none !important;
        }
      `
      document.head.appendChild(style)
      
      // Store reference for cleanup
      document.body.setAttribute('data-custom-cursor-style', 'true')
    }

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      
      // Cleanup browser-specific styles
      if (isFirefox) {
        document.body.style.cursor = ''
        document.documentElement.style.cursor = ''
      }
      
      if (isSafari || isWebKit) {
        document.body.style.cursor = ''
        document.documentElement.style.cursor = ''
        // Remove Safari-specific style injection
        const styleElements = document.querySelectorAll('style')
        styleElements.forEach(el => {
          if (el.textContent?.includes('-webkit-cursor: none')) {
            el.remove()
          }
        })
        document.body.removeAttribute('data-custom-cursor-style')
      }
    }
  }, [updateMousePosition, handleMouseOver])

  // Calculate position with offset for hover state
  const offsetX = isHovering ? 6 : 4
  const offsetY = isHovering ? 6 : 4

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{
        transform: `translate3d(${mousePosition.x - offsetX}px, ${mousePosition.y - offsetY}px, 0)`,
        willChange: 'transform, opacity'
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