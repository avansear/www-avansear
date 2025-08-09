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
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get current theme from HTML data attribute (already set by blocking script)
    const htmlElement = document.querySelector('html')
    const theme = htmlElement?.getAttribute('data-theme') || ''
    setCurrentTheme(theme)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownOpen && !(event.target as Element).closest('.theme-dropdown')) {
        setThemeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [themeDropdownOpen])

  const handleThemeChange = (theme: string) => {
    changeTheme(theme)
    setCurrentTheme(theme)
    setThemeDropdownOpen(false) // Close dropdown after selection
  }

  const toggleThemeDropdown = () => {
    setThemeDropdownOpen(!themeDropdownOpen)
  }

  // Theme configurations
  const themes = [
    { 
      id: '', 
      name: 'Default', 
      bgColor: '#0F0F0E', 
      borderColor: '#DBD2D2' 
    },
    { 
      id: 'theme1', 
      name: 'Theme 1', 
      bgColor: '#130021', 
      borderColor: '#C60017' 
    },
    { 
      id: 'theme2', 
      name: 'Theme 2', 
      bgColor: '#FFC15E', 
      borderColor: '#1F0303' 
    },
    { 
      id: 'theme3', 
      name: 'Theme 3', 
      bgColor: '#021F07', 
      borderColor: '#D75600' 
    }
  ]

  const activeTheme = themes.find(theme => theme.id === currentTheme) || themes[0]

  if (!mounted) {
    return (
      <aside className="-ml-[8px] mb-10 sm:mb-16 tracking-tight">
        <div className="lg:sticky lg:top-20">
          <nav
            className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
            id="nav"
          >
            <div className="flex flex-row items-center space-x-0">
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <InternalHoverButton key={path} href={path}>
                    {name}
                  </InternalHoverButton>
                )
              })}
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
            </div>
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <aside className="-ml-[8px] mb-10 sm:mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <InternalHoverButton key={path} href={path}>
                  {name}
                </InternalHoverButton>
              )
            })}
          </div>
          {/* Desktop: Show all themes */}
          <div className="hidden sm:flex flex-row items-center space-x-1.5">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`w-5 h-5 rounded-full border border-2 transition-colors hover:opacity-80`}
                style={{
                  backgroundColor: theme.bgColor,
                  borderColor: theme.borderColor,
                }}
                onClick={() => handleThemeChange(theme.id)}
                title={theme.name}
              ></button>
            ))}
          </div>

          {/* Mobile: Show dropdown */}
          <div className="sm:hidden relative theme-dropdown flex items-center">
            <button
              className={`w-5 h-5 rounded-full border border-2 transition-colors hover:opacity-80`}
              style={{
                backgroundColor: activeTheme.bgColor,
                borderColor: activeTheme.borderColor,
              }}
              onClick={toggleThemeDropdown}
              title={`Current: ${activeTheme.name}`}
            ></button>

            {/* Dropdown */}
            {themeDropdownOpen && (
              <div className="absolute top-8 right-0 rounded-lg z-50">
                <div className="flex flex-col space-y-2">
                  {themes
                    .filter(theme => theme.id !== currentTheme) // Hide current theme
                    .map((theme) => (
                      <button
                        key={theme.id}
                        className={`w-5 h-5 rounded-full border border-2 transition-colors hover:opacity-80`}
                        style={{
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                        }}
                        onClick={() => handleThemeChange(theme.id)}
                        title={theme.name}
                      ></button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}
