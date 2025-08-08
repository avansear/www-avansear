'use client'

import { InternalHoverButton } from './hover-button'
import { changeTheme, getStoredTheme, applyStoredTheme } from '../../utils/helper'
import { useState, useEffect } from 'react'

const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  '/projects': {
    name: 'projects',
  },
  '/musix': {
    name: 'musix',
  },
}

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Load and apply stored theme from cookies
    const storedTheme = getStoredTheme()
    
    if (storedTheme) {
      // Apply the stored theme immediately
      applyStoredTheme()
      setCurrentTheme(storedTheme)
    } else {
      // No stored theme, get current theme from HTML data attribute (fallback)
      const htmlElement = document.querySelector('html')
      const theme = htmlElement?.getAttribute('data-theme') || ''
      setCurrentTheme(theme)
    }
  }, [])

  const handleThemeChange = (theme: string) => {
    changeTheme(theme)
    setCurrentTheme(theme)
  }

  if (!mounted) {
    return (
      <aside className="-ml-[8px] mb-16 tracking-tight">
        <div className="lg:sticky lg:top-20">
          <nav
            className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
            id="nav"
          >
            <div className="flex flex-row space-x-0">
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <InternalHoverButton key={path} href={path} className="m-1">
                    {name}
                  </InternalHoverButton>
                )
              })}
            </div>
            <div className="flex flex-row space-x-2">
              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
            </div>
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <InternalHoverButton key={path} href={path} className="m-1">
                  {name}
                </InternalHoverButton>
              )
            })}
          </div>
          <div className="flex flex-row space-x-2">
            <button
              className={`w-5 h-5 rounded-full border border-2 transition-colors ${
                currentTheme === ''
                  ? 'bg-[#0F0F0E] border-[#DBD2D2] hover:border-[#DBD2D2]/80'
                  : 'bg-[#0F0F0E] border-[#DBD2D2] hover:border-[#DBD2D2]/80'
              }`}
              onClick={() => handleThemeChange('')}
              title="Default Theme"
            ></button>
            <button
              className={`w-5 h-5 rounded-full border border-2 transition-colors ${
                currentTheme === 'theme1'
                  ? 'bg-[#130021] border-[#C60017] hover:border-[#C60017]/80'
                  : 'bg-[#130021] border-[#C60017] hover:border-[#C60017]/80'
              }`}
              onClick={() => handleThemeChange('theme1')}
              title="Theme 1"
            ></button>
            <button
              className={`w-5 h-5 rounded-full border border-2 transition-colors ${
                currentTheme === 'theme2'
                  ? 'bg-[#FFC15E] border-[#1F0303] hover:border-[#1F0303]/80'
                  : 'bg-[#FFC15E] border-[#1F0303] hover:border-[#1F0303]/80'
              }`}
              onClick={() => handleThemeChange('theme2')}
              title="Theme 2"
            ></button>
            <button
              className={`w-5 h-5 rounded-full border border-2 transition-colors ${
                currentTheme === 'theme3'
                  ? 'bg-[#021F07] border-[#D75600] hover:border-[#D75600]/80'
                  : 'bg-[#021F07] border-[#D75600] hover:border-[#D75600]/80'
              }`}
              onClick={() => handleThemeChange('theme3')}
              title="Theme 3"
            ></button>
          </div>
        </nav>
      </div>
    </aside>
  )
}
