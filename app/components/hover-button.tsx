import React from 'react'
import { motion } from 'framer-motion'

interface HoverButtonProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function HoverButton({ children, href, className = '' }: HoverButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-8 py-4 rounded-full ${className}`}
      whileHover={{
        backgroundColor: '#ffffff',
        color: '#000000',
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.a>
  )
} 