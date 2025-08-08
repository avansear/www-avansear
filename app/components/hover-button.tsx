import Link from 'next/link'

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
      className={`inline-block px-2 rounded-full transition-all duration-300 ease-out hover:bg-[var(--color-light)] hover:text-[var(--color-dark)] hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </a>
  )
}

export function InternalHoverButton({ children, href, className = '' }: HoverButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block px-2 rounded-full transition-all duration-300 ease-out hover:bg-[var(--color-light)] hover:text-[var(--color-dark)] hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </Link>
  )
} 