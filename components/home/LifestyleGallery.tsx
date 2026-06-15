'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { ImageFrame } from '@/components/shell/ImageFrame'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { scaleReveal, E } from '@/lib/motion'

export function LifestyleGallery() {
  const { gallery } = useHome()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <Section id="gallery" tone="paper2" wash style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
      <Reveal variant="rise" className="flex flex-col gap-3 mb-10">
        <Eyebrow>{gallery.eyebrow}</Eyebrow>
        <SectionHeading className="max-w-[22ch]">{gallery.heading}</SectionHeading>
      </Reveal>

      {/* Desktop: 1 tall left + 2×2 grid right — using flex for precise control */}
      <div className="hidden md:flex gap-3" style={{ height: '560px' }}>
        {/* Left tall image */}
        <motion.div
          variants={scaleReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4px] cursor-pointer flex-1 h-full"
          onClick={() => setLightbox(0)}
          role="button"
          tabIndex={0}
          aria-label={`View: ${gallery.images[0]?.alt}`}
          onKeyDown={e => e.key === 'Enter' && setLightbox(0)}
        >
          {/* Override ImageFrame's aspect ratio by wrapping in absolute fill */}
          <div className="absolute inset-0">
            <ImageFrame slot={gallery.images[0]} caption={gallery.images[0]?.alt} className="!h-full !w-full [&>div]:!aspect-auto [&>div]:h-full" />
          </div>
        </motion.div>

        {/* Right 2×2 grid */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 h-full">
          {gallery.images.slice(1, 5).map((img, i) => (
            <motion.div
              key={i + 1}
              variants={scaleReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.08 }}
              className="relative overflow-hidden rounded-[4px] cursor-pointer"
              onClick={() => setLightbox(i + 1)}
              role="button"
              tabIndex={0}
              aria-label={`View: ${img.alt}`}
              onKeyDown={e => e.key === 'Enter' && setLightbox(i + 1)}
            >
              {/* Override ImageFrame's aspect ratio by wrapping in absolute fill */}
              <div className="absolute inset-0">
                <ImageFrame slot={img} caption={img.alt} className="!h-full !w-full [&>div]:!aspect-auto [&>div]:h-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: full-width tall hero, then 2×2 grid */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Hero image — full width, taller aspect */}
        <motion.div
          variants={scaleReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4px] cursor-pointer w-full"
          style={{ height: '260px' }}
          onClick={() => setLightbox(0)}
          role="button"
          tabIndex={0}
          aria-label={`View: ${gallery.images[0]?.alt}`}
          onKeyDown={e => e.key === 'Enter' && setLightbox(0)}
        >
          <div className="absolute inset-0">
            <ImageFrame slot={gallery.images[0]} caption={gallery.images[0]?.alt} className="!h-full !w-full [&>div]:!aspect-auto [&>div]:h-full" />
          </div>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-3" style={{ height: '280px' }}>
          {gallery.images.slice(1, 5).map((img, i) => (
            <motion.div
              key={i + 1}
              variants={scaleReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.07 }}
              className="relative overflow-hidden rounded-[4px] cursor-pointer h-full"
              onClick={() => setLightbox(i + 1)}
              role="button"
              tabIndex={0}
              aria-label={`View: ${img.alt}`}
              onKeyDown={e => e.key === 'Enter' && setLightbox(i + 1)}
            >
              <div className="absolute inset-0">
                <ImageFrame slot={img} caption={img.alt} className="!h-full !w-full [&>div]:!aspect-auto [&>div]:h-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-label="Image preview"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: E }}
              onClick={e => e.stopPropagation()}
            >
              <ImageFrame slot={gallery.images[lightbox]} sizes="90vw" />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 bg-[var(--ink)]/70 text-[var(--paper)] rounded-full p-2 hover:bg-[var(--ink)] transition-colors"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
