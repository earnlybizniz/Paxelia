'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useProduct } from '@/contexts/product-context'
import type { ProductImage } from '@/lib/pdp-product'
import { cn } from '@/lib/utils'
import { E } from '@/lib/motion'

/**
 * Renders a gallery item as an autoplay/loop/muted <video> when kind==='video',
 * otherwise a next/image. Used for the large viewer (object-cover or -contain).
 */
function GalleryMedia({ item, className, sizes, priority }: { item: ProductImage; className: string; sizes: string; priority?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mobile browsers sometimes ignore the declarative autoPlay attribute, so we
  // also call .play() explicitly once the element can play. Wrapped in catch so
  // a blocked promise never throws.
  useEffect(() => {
    const v = videoRef.current
    if (!v || item.kind !== 'video') return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    tryPlay()
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [item.src, item.kind])

  if (!item.src) return null
  if (item.kind === 'video') {
    // z-[1] keeps the video ABOVE the gradient placeholder sibling (which is
    // absolute inset-0). Without an explicit stack the placeholder painted over
    // the video, hiding it behind a solid colour.
    return (
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={item.alt}
        className={`absolute inset-0 z-[1] w-full h-full ${className}`}
      />
    )
  }
  return <Image src={item.src} alt={item.alt} fill className={`z-[1] ${className}`} sizes={sizes} priority={priority} />
}

/** Small thumbnail renderer — videos show their poster frame (no autoplay in the strip). */
function ThumbMedia({ item, sizes }: { item: ProductImage; sizes: string }) {
  if (!item.src) return null
  const thumbSrc = item.kind === 'video' ? item.poster : item.src
  if (!thumbSrc) {
    // video with no poster — show first frame via a muted, non-autoplay video element
    return <video src={item.src} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" aria-label={item.alt} />
  }
  return <Image src={thumbSrc} alt={item.alt} fill className="object-cover" sizes={sizes} />
}

export function Gallery() {
  const { product, gallery, activeImage, activeIndex, setActiveIndex } = useProduct()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const thumbStripRef = useRef<HTMLDivElement>(null)
  const badge = product.badges[0]

  // Browsable photos = everything NOT flagged variantOnly. Because the
  // variantOnly shots are kept LAST in the gallery, the browsable photos are the
  // contiguous block [0 .. browsableCount-1]; the variant shots sit after them.
  const browsableCount = gallery.filter(g => !g.variantOnly).length
  const total = browsableCount
  // True when the main viewer is showing a variant shot (because a size/frame
  // was selected). These are reached only by selection, never by browsing.
  const onVariant = activeIndex >= browsableCount
  // Step through the browsable photos only; from a variant view, snap back into
  // the product photos.
  const goRel = (dir: number) => {
    if (onVariant) { setActiveIndex(dir > 0 ? 0 : browsableCount - 1); return }
    setActiveIndex((activeIndex + dir + browsableCount) % browsableCount)
  }

  // For portal rendering (SSR safety)
  useEffect(() => { setMounted(true) }, [])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // Whenever activeIndex changes, scroll the corresponding thumb into view
  useEffect(() => {
    const strip = thumbStripRef.current
    if (!strip) return
    const thumb = strip.children[activeIndex] as HTMLElement | undefined
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }, [activeIndex])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goRel(1)
      if (e.key === 'ArrowLeft') goRel(-1)
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, activeIndex, browsableCount, setActiveIndex])

  // Mobile swipe + tap. We track both axes so a vertical drag scrolls the page
  // normally, a horizontal drag changes image, and a near-stationary touch = tap (zoom).
  // touchHandled prevents the synthetic click (which fires after touchend) from
  // double-triggering zoom; it's reset shortly after so desktop clicks still work.
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchMoved = useRef(false)
  const touchHandled = useRef(false)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchMoved.current = false
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) touchMoved.current = true
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchHandled.current = true
    // reset the guard after the synthetic click would have fired
    setTimeout(() => { touchHandled.current = false }, 400)

    // Horizontal swipe (more horizontal than vertical) → change image
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goRel(1)
      else goRel(-1)
      return
    }
    // Near-stationary tap → open zoom
    if (!touchMoved.current && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      setLightboxOpen(true)
    }
  }

  // Lightbox version: swipe left/right changes image, but a tap does NOT toggle
  // zoom (we're already zoomed). Vertical drags are ignored so the gesture feels
  // like the normal gallery swipe.
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goRel(1)
      else goRel(-1)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 min-w-0 w-full">
        {/* Main Image — no entrance animation; paints immediately */}
        <div
          className="relative aspect-square overflow-hidden rounded-none md:rounded-[8px] bg-[var(--paper2)] cursor-zoom-in select-none -mx-5 md:mx-0"
          style={{ touchAction: 'pan-y' }}
          onClick={() => { if (!touchHandled.current) setLightboxOpen(true) }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Badge pill */}
          {badge && (
            <div className="absolute top-4 left-4 z-10 bg-[var(--accent)] text-[var(--paper)] px-3 py-1 rounded-full font-sans text-[0.7rem] font-medium">
              {badge}
            </div>
          )}

          {/* Image swap is instant — all photos are stacked + preloaded below */}

          {/* Image stack — INSTANT switch (no reload, no crossfade) */}
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: activeImage.placeholder }} />
            {gallery.map((img, i) => {
              const isActive = i === activeIndex
              // Videos mount only when active so several don't autoplay at once.
              if (img.kind === 'video' && !isActive) return null
              return (
                <div
                  key={i}
                  className={isActive ? 'absolute inset-0 z-[1]' : 'absolute inset-0 opacity-0 pointer-events-none'}
                >
                  <GalleryMedia
                    item={img}
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              )
            })}
          </div>

          {/* Desktop prev/next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goRel(-1) }}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-[var(--paper)]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--paper)] shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} className="text-[var(--ink)]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goRel(1) }}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-[var(--paper)]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--paper)] shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight size={16} className="text-[var(--ink)]" />
              </button>
            </>
          )}

          {/* Image count indicator */}
          <div className="absolute bottom-4 left-4 z-10 font-sans text-[0.7rem] text-[var(--paper)]/80 bg-[var(--ink)]/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {onVariant ? 'Your selection' : `${activeIndex + 1} / ${total}`}
          </div>
        </div>

        {/* Thumbnail strip — clean horizontal scroll (no edge fades). min-w-0 + w-full
            keep the row at the column width so it scrolls instead of widening the hero. */}
        <div
          ref={thumbStripRef}
          className="flex gap-1.5 overflow-x-auto scroll-smooth w-full min-w-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {gallery.map((img, i) => img.variantOnly ? null : (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-14 h-14 overflow-hidden rounded-[5px] transition-all duration-200',
                i === activeIndex
                  ? 'ring-2 ring-inset ring-[var(--ink)]'
                  : 'opacity-50 hover:opacity-100 ring-1 ring-inset ring-[var(--ink)]/10'
              )}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              aria-pressed={i === activeIndex}
            >
              <div className="absolute inset-0" style={{ background: img.placeholder }} />
              <ThumbMedia item={img} sizes="56px" />
              {img.kind === 'video' && (
                <span className="absolute bottom-1 right-1 z-10 flex items-center justify-center w-4 h-4 rounded-full bg-black/55">
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </span>
              )}
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox — rendered via portal to escape stacking contexts */}
      {mounted && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              className="fixed inset-0 flex flex-col items-center justify-center"
              style={{ backgroundColor: 'rgba(20, 18, 15, 0.92)', zIndex: 9999 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
            >
              {/* Close button */}
              <button
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close lightbox"
              >
                <X size={28} strokeWidth={1.5} />
              </button>

              {/* Prev / Next arrows */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={(e) => { e.stopPropagation(); goRel(-1) }}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={(e) => { e.stopPropagation(); goRel(1) }}
                aria-label="Next image"
              >
                <ChevronRight size={20} className="text-white" />
              </button>

              {/* Main image — no placeholder behind it. object-contain shows the
                  whole image; the empty space around it should be the clean
                  lightbox backdrop, not a coloured placeholder bar.
                  Touch handlers added so swiping left/right changes the image on
                  mobile (same gesture as the normal gallery), in addition to the
                  arrows. */}
              <motion.div
                className="relative w-[90vw] h-[70vh] max-w-[900px]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: E }}
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
                style={{ touchAction: 'pan-y' }}
              >
                <GalleryMedia item={activeImage} className="object-contain rounded-[6px] w-full h-full" sizes="90vw" />
              </motion.div>

              {/* Lightbox thumb strip */}
              <div
                className="flex gap-2 mt-4 overflow-x-auto max-w-[90vw] px-2 py-2"
                style={{ scrollbarWidth: 'none' }}
                onClick={e => e.stopPropagation()}
              >
                {gallery.map((img, i) => img.variantOnly ? null : (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                    className={cn(
                      'relative flex-shrink-0 w-14 h-14 overflow-hidden rounded-[4px] transition-all duration-200',
                      i === activeIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : 'opacity-40 hover:opacity-70'
                    )}
                  >
                    <div className="absolute inset-0" style={{ background: img.placeholder }} />
                    <ThumbMedia item={img} sizes="56px" />
                    {img.kind === 'video' && (
                      <span className="absolute bottom-0.5 right-0.5 z-10 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black/55">
                        <svg viewBox="0 0 24 24" width="8" height="8" fill="white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Counter */}
              <p className="mt-3 font-sans text-[0.75rem] text-white/50">
                {onVariant ? 'Your selection' : `${activeIndex + 1} of ${total}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
