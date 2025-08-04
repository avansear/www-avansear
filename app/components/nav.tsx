'use client'

import { InternalHoverButton } from './hover-button'

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
              className="w-5 h-5 rounded-full bg-[#021F07] border-1 border-[#D75600] hover:border-[#D75600]/80 transition-colors"
              onClick={() => {
                document.documentElement.style.setProperty('--color-dark', '#021F07')
                document.documentElement.style.setProperty('--color-light', '#D75600')
                document.documentElement.style.setProperty('--color-accent', '#D75600BF')
              }}
            ></button>
            <button 
              className="w-5 h-5 rounded-full bg-[#1F0037] border-1 border-[#C60017] hover:border-[#C60017]/80 transition-colors"
              onClick={() => {
                document.documentElement.style.setProperty('--color-dark', '#1F0037')
                document.documentElement.style.setProperty('--color-light', '#C60017')
                document.documentElement.style.setProperty('--color-accent', '#C60017BF')
              }}
            ></button>
          </div>
        </nav>
      </div>
    </aside>
  )
}
