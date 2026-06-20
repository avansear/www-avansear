'use client'

import { HoverButton } from './hover-button'
import { ArrowIcon } from './arrow-icon'
import { useState } from 'react'

export default function Footer() {
  const [emailCopied, setEmailCopied] = useState(false)
  const email = 'me@avansear.com'

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const links = [
    { href: 'https://www.instagram.com/avansear/', label: 'instagram' },
    { href: 'https://unsplash.com/@avansear', label: 'unsplash' },
    { href: 'https://github.com/avansear/', label: 'github' },
    { href: 'https://linkedin.com/in/avansear', label: 'linkedin' },
  ]

  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-[var(--color-light)]/80 md:flex-row md:space-x-2 md:space-y-0 dark:text-[var(--color-light)]/80">
        {links.map(({ href, label }) => (
          <li key={label}>
            <HoverButton href={href}>
              <div className="flex items-center">
                <ArrowIcon />
                <p className="ml-2 h-7">{label}</p>
              </div>
            </HoverButton>
          </li>
        ))}
        <li>
          <HoverButton onClick={handleEmailClick}>
            <div className="flex items-center">
              <ArrowIcon />
              <p className="ml-2 h-7">{emailCopied ? 'email copied' : 'email'}</p>
            </div>
          </HoverButton>
        </li>
      </ul>
    </footer>
  )
}
