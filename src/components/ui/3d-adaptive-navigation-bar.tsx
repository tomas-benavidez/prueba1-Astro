import React, { useState, useRef, useEffect } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  id: string
}

/**
 * 3D Adaptive Navigation Pill
 * Smart navigation with hover expansion
 */
export const PillBase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio')
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSectionRef = useRef('inicio')
  
  const navItems: NavItem[] = [
    { label: 'Inicio', id: 'inicio' },
    { label: 'Sobre mí', id: 'sobre-mi' },
    { label: 'Proyectos', id: 'proyectos' },
    { label: 'Contacto', id: 'contacto' },
  ]

  // Spring animations for smooth motion
  const pillWidth = useSpring(140, { stiffness: 220, damping: 25, mass: 1 })
  const pillShift = useSpring(0, { stiffness: 220, damping: 25, mass: 1 })

  // Handle hover expansion
  useEffect(() => {
    if (hovering) {
      setExpanded(true)
      pillWidth.set(480)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setExpanded(false)
        pillWidth.set(140)
      }, 600)
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [hovering, pillWidth])

  const handleMouseEnter = () => {
    setHovering(true)
  }

  const handleMouseLeave = () => {
    setHovering(false)
  }

  const handleSectionClick = (sectionId: string) => {
    setIsTransitioning(true)
    prevSectionRef.current = sectionId
    setActiveSection(sectionId)
    setHovering(false)

    // Smooth scroll to target section if present on page
    const targetEl = document.getElementById(sectionId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }

  const activeItem = navItems.find(item => item.id === activeSection)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'fixed', top: '1.25rem', left: 0, right: 0, zIndex: 100, pointerEvents: 'none' }}>
      <motion.nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-full"
        style={{
          pointerEvents: 'auto',
          width: pillWidth,
          height: '56px',
          background: `
            linear-gradient(135deg, 
              #fcfcfd 0%, 
              #f8f8fa 15%, 
              #f3f4f6 30%, 
              #eeeff2 45%, 
              #e9eaed 60%, 
              #e4e5e8 75%, 
              #dee0e3 90%, 
              #e2e3e6 100%
            )
          `,
          boxShadow: expanded
            ? `
              0 2px 4px rgba(0, 0, 0, 0.08),
              0 6px 12px rgba(0, 0, 0, 0.12),
              0 12px 24px rgba(0, 0, 0, 0.14),
              0 24px 48px rgba(0, 0, 0, 0.10),
              inset 0 2px 2px rgba(255, 255, 255, 0.8),
              inset 0 -3px 8px rgba(0, 0, 0, 0.12),
              inset 3px 3px 8px rgba(0, 0, 0, 0.10),
              inset -3px 3px 8px rgba(0, 0, 0, 0.09),
              inset 0 -1px 2px rgba(0, 0, 0, 0.08)
            `
            : isTransitioning
            ? `
              0 3px 6px rgba(0, 0, 0, 0.10),
              0 8px 16px rgba(0, 0, 0, 0.08),
              0 16px 32px rgba(0, 0, 0, 0.06),
              0 1px 2px rgba(0, 0, 0, 0.10),
              inset 0 2px 1px rgba(255, 255, 255, 0.85),
              inset 0 -2px 6px rgba(0, 0, 0, 0.08),
              inset 2px 2px 8px rgba(0, 0, 0, 0.06),
              inset -2px 2px 8px rgba(0, 0, 0, 0.05),
              inset 0 0 1px rgba(0, 0, 0, 0.12),
              inset 0 0 20px rgba(255, 255, 255, 0.15)
            `
            : `
              0 3px 6px rgba(0, 0, 0, 0.12),
              0 8px 16px rgba(0, 0, 0, 0.10),
              0 16px 32px rgba(0, 0, 0, 0.08),
              0 1px 2px rgba(0, 0, 0, 0.12),
              inset 0 2px 1px rgba(255, 255, 255, 0.7),
              inset 0 -2px 6px rgba(0, 0, 0, 0.10),
              inset 2px 2px 8px rgba(0, 0, 0, 0.08),
              inset -2px 2px 8px rgba(0, 0, 0, 0.07),
              inset 0 0 1px rgba(0, 0, 0, 0.15)
            `,
          x: pillShift,
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease-out',
        }}
      >
        {/* Top edge ridge */}
        <div 
          className="absolute inset-x-0 top-0 rounded-t-full pointer-events-none"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 5%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0.95) 95%, rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(0.3px)',
          }}
        />
        
        {/* Top hemisphere light catch */}
        <div 
          className="absolute inset-x-0 top-0 rounded-full pointer-events-none"
          style={{
            height: '55%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.10) 60%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
        
        {/* Directional light - top left */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.20) 20%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0) 65%)',
          }}
        />
        
        {/* Premium gloss reflection */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            left: expanded ? '18%' : '15%',
            top: '16%',
            width: expanded ? '140px' : '60px',
            height: '14px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.35) 40%, rgba(255, 255, 255, 0.10) 70%, rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(4px)',
            transform: 'rotate(-12deg)',
            transition: 'all 0.3s ease',
          }}
        />
        
        {expanded && (
          <div 
            className="absolute rounded-full pointer-events-none"
            style={{
              right: '22%',
              top: '20%',
              width: '80px',
              height: '10px',
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)',
              filter: 'blur(3px)',
              transform: 'rotate(8deg)',
            }}
          />
        )}
        
        {/* Bottom curvature shadow */}
        <div 
          className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
          style={{
            height: '50%',
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.08) 25%, rgba(0, 0, 0, 0.03) 50%, rgba(0, 0, 0, 0) 100%)',
          }}
        />

        {/* Inner diffuse glow */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(255, 255, 255, 0.22)',
            opacity: 0.7,
          }}
        />

        {/* Navigation items container */}
        <div 
          ref={containerRef}
          className="relative z-10 h-full flex items-center justify-center px-6"
          style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
          }}
        >
          {!expanded && (
            <div className="flex items-center relative">
              <AnimatePresence mode="wait">
                {activeItem && (
                  <motion.span
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{
                      duration: 0.35,
                      ease: [0.4, 0.0, 0.2, 1]
                    }}
                    style={{
                      fontSize: '15.5px',
                      fontWeight: 680,
                      color: '#1a1a1a',
                      letterSpacing: '0.45px',
                      whiteSpace: 'nowrap',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                  >
                    {activeItem.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}

          {expanded && (
            <div className="flex items-center justify-evenly w-full gap-2">
              {navItems.map((item, index) => {
                const isActive = item.id === activeSection
                
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.25,
                      ease: 'easeOut'
                    }}
                    onClick={() => handleSectionClick(item.id)}
                    className="relative cursor-pointer transition-all duration-200"
                    style={{
                      fontSize: isActive ? '15.5px' : '15px',
                      fontWeight: isActive ? 680 : 510,
                      color: isActive ? '#0f0f0f' : '#4a4a4a',
                      textDecoration: 'none',
                      letterSpacing: '0.45px',
                      background: 'transparent',
                      border: 'none',
                      padding: '8px 14px',
                      outline: 'none',
                      whiteSpace: 'nowrap',
                      transform: isActive ? 'translateY(-1.5px)' : 'translateY(0)',
                    }}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  )
}
