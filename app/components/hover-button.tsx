import React from 'react'

interface HoverButtonProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function HoverButton({ children, href, className = '' }: HoverButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-2 py-2 rounded-full transition-all duration-300 ease-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </a>
  )
} 