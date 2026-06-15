'use client'

/**
 * components/shell/ImageFrame.tsx
 * next/image slot with gradient placeholder, hover zoom, optional caption chip.
 * If src is empty, renders only the placeholder gradient (layout stays final).
 *
 * If slot.kind === 'video', renders a GIF-style looping video instead — lazily
 * mounted near the viewport, native controls fully disabled, relentless retry
 * until it plays, poster shown until playback starts. Same proven behavior as
 * the product page feature videos, so home + product look/behave identically.
 */
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import type { ImageSlot } from '@/lib/home-content'
import { cn } from '@/lib/utils'

interface ImageFrameProps {
  slot: ImageSlot
  caption?: string
  priority?: boolean
  className?: string
  sizes?: string
}

function FrameVideo({ slot }: { slot: ImageSlot }) {
  const slotRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Lazy-mount the <video> only when the slot nears the viewport.
  useEffect(() => {
    const el = slotRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setMounted(true); setVisible(true); return }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setMounted(true); setVisible(true) }
          else setVisible(false)
        }
      },
      { rootMargin: '600px 0px', threshold: 0.01 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Relentlessly ensure playback whenever mounted + visible.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !mounted) return
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.controls = false
    let stopped = false
    let timer: ReturnType<typeof setInterval> | null = null
    const attempt = () => {
      if (stopped || !visible) return
      if (!v.paused && !v.ended && v.readyState >= 2) { setIsPlaying(true); return }
      const p = v.play()
      if (p && typeof p.then === 'function') p.then(() => setIsPlaying(true)).catch(() => {})
    }
    attempt()
    const onReady = () => attempt()
    v.addEventListener('loadeddata', onReady)
    v.addEventListener('canplay', onReady)
    v.addEventListener('playing', () => setIsPlaying(true))
    v.addEventListener('pause', () => { if (!stopped && visible) attempt() })
    timer = setInterval(() => { if (!stopped && visible && (v.paused || v.ended)) attempt() }, 400)
    const onVis = () => { if (document.visibilityState === 'visible' && visible) attempt() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('focus', onVis)
    return () => {
      stopped = true
      if (timer) clearInterval(timer)
      v.removeEventListener('loadeddata', onReady)
      v.removeEventListener('canplay', onReady)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('focus', onVis)
    }
  }, [mounted, visible, slot.src])

  return (
    <div ref={slotRef} className="absolute inset-0">
      <div className="absolute inset-0 z-0" style={{ background: slot.placeholder }} />
      {slot.poster && (
        <Image
          src={slot.poster}
          alt={slot.alt}
          fill
          className={`object-cover z-[1] transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      {mounted && slot.src && (
        <video
          ref={videoRef}
          src={slot.src}
          poster={slot.poster}
          autoPlay loop muted playsInline preload="auto"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          aria-label={slot.alt}
          tabIndex={-1}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 z-[2] w-full h-full object-cover pointer-events-none"
          onPlaying={() => setIsPlaying(true)}
        />
      )}
    </div>
  )
}

export function ImageFrame({ slot, caption, priority = false, className, sizes = '(max-width:768px) 100vw, 50vw' }: ImageFrameProps) {
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()
  const isVideo = slot.kind === 'video'

  // Parse ratio "4/4.6" → CSS aspect-ratio
  const aspectStyle = { aspectRatio: slot.ratio.replace('/', ' / ') }

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-[4px]"
        style={aspectStyle}
      >
        {isVideo ? (
          <FrameVideo slot={slot} />
        ) : (
          <>
            {/* Gradient placeholder — always visible until image loads */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ background: slot.placeholder, opacity: slot.src ? 0 : 1 }}
              aria-hidden="true"
            />
            {/* Real image */}
            {slot.src && (
              <motion.div
                className="absolute inset-0"
                animate={hovered && !reduced ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  fill
                  sizes={sizes}
                  priority={priority}
                  className="object-cover"
                />
              </motion.div>
            )}
          </>
        )}

        {/* Hover: accent border draw */}
        {hovered && !reduced && (
          <motion.div
            className="absolute inset-0 rounded-[4px] pointer-events-none z-[3]"
            style={{ border: '1px solid var(--accent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Caption — thin bottom strip, slides up on hover */}
        {caption && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[var(--ink)]/60 backdrop-blur-sm px-3 py-2 pointer-events-none z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={hovered && !reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 8 }
            }
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[0.7rem] text-[var(--paper)]/90 leading-none tracking-wide truncate">{caption}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}