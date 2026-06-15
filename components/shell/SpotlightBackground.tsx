'use client'

import { useState, useEffect, useRef } from 'react'

interface SpotlightBackgroundProps {
  /** Spotlight color - defaults to brand accent */
  color?: string
  /** Size when idle (larger) */
  idleSize?: number
  /** Size when moving (smaller, tighter) */
  movingSize?: number
  /** Opacity of the spotlight (0-1) */
  opacity?: number
}

/**
 * SpotlightBackground — Mouse Shadow (Flow) Skill
 *
 * A smooth glowing light that follows the cursor *within its container*.
 * Tracks mouse position relative to the bounding rect so the gradient
 * always lands exactly under the cursor regardless of scroll or nesting.
 * Use on dark sections for a premium interactive feel.
 */
export function SpotlightBackground({
  color = 'rgba(107, 74, 47, 0.8)',
  idleSize = 400,
  movingSize = 280,
  opacity = 0.45,
}: SpotlightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Start the glow centered so it's visible before the user moves the mouse
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsMoving(true)

      if (moveTimeout.current) clearTimeout(moveTimeout.current)
      moveTimeout.current = setTimeout(() => setIsMoving(false), 150)
    }

    // Listen on the container element itself so we only track moves inside it
    el.addEventListener('mousemove', handleMouseMove)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      if (moveTimeout.current) clearTimeout(moveTimeout.current)
    }
  }, [])

  const size = isMoving ? movingSize : idleSize

  // Default position: center of the container
  const x = pos?.x ?? '50%'
  const y = pos?.y ?? '40%'

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          transition: 'width 300ms ease-out, height 300ms ease-out',
        }}
      />
    </div>
  )
}
