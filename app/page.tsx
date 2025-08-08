'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export default function Page() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section>
      <div 
        className="p-4 -m-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.h1 
          className="mb-8 text-2xl font-semibold tracking-tighter"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>i'm avan</span>
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            sear (vishruth siddi)
          </motion.span>
        </motion.h1>
      </div>
      
      <p className="mb-4">
        {`high functioning insomniac. 20 y/o weirdo who does things based on instincts and intuition.`}
      </p>
    </section>
  )
}