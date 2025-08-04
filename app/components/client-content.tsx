'use client'

import { useEffect, useState } from 'react'

interface ClientContentProps {
  content: string
  className?: string
}

export function ClientContent({ content, className = '' }: ClientContentProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={className} />
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
} 