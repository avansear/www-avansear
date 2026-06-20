import Link from 'next/link'

const cls = 'inline-block px-2 rounded-full transition-all duration-300 ease-out hover:bg-[var(--color-light)] hover:text-[var(--color-dark)] hover:scale-105 active:scale-95'

interface HoverButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function HoverButton({ children, href, onClick, className = '' }: HoverButtonProps) {
  if (onClick) {
    return (
      <button onClick={onClick} className={`${cls} ${className}`}>
        {children}
      </button>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} ${className}`}>
      {children}
    </a>
  )
}

export function InternalHoverButton({ children, href = '', className = '' }: HoverButtonProps) {
  return (
    <Link href={href} className={`${cls} ${className}`}>
      {children}
    </Link>
  )
}
