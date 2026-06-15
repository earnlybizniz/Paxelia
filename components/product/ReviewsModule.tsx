'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { BadgeCheck, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { CountUp } from '@/components/shell/CountUp'
import { Eyebrow, SectionHeading, StarRating } from '@/components/shell/Typography'
import { RatingBars } from '@/components/product/RatingBars'
import { E } from '@/lib/motion'
import { ALL_REVIEWS, REVIEW_SUMMARY, type FullReview } from '@/lib/reviews-data'
import { relativeDate } from '@/lib/relative-date'

// All review images, flattened, for the gallery strip + lightbox.
const GALLERY_IMAGES = ALL_REVIEWS.flatMap((r) =>
  (r.images ?? []).map((img) => ({ ...img, author: r.author }))
)

// Featured reviews on the product page = the ones with photos (pinned).
const FEATURED = ALL_REVIEWS.filter((r) => r.images && r.images.length > 0).slice(0, 6)

export function ReviewsModule() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox((i) => (i === null ? i : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length))
  const next = () => setLightbox((i) => (i === null ? i : (i + 1) % GALLERY_IMAGES.length))

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <Section id="reviews" tone="paper2">
      <div className="flex flex-col gap-12">
        {/* Header: score + bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-3xl mx-auto w-full">
          <Reveal variant="rise" className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[4rem] md:text-[5rem] text-[var(--ink)] leading-none">
                <CountUp value={REVIEW_SUMMARY.score} dec={1} />
              </span>
              <span className="font-sans text-[1.25rem] text-[var(--ink-mute)]">/5</span>
            </div>
            <StarRating value={REVIEW_SUMMARY.score} size={22} />
            <p className="font-sans text-[0.875rem] text-[var(--ink-soft)]">
              Based on {REVIEW_SUMMARY.count.toLocaleString()} reviews
            </p>
          </Reveal>
          <Reveal variant="rise">
            <div className="w-full">
              <RatingBars />
            </div>
          </Reveal>
        </div>

        {/* Photo gallery strip — real customer photos, click to open lightbox */}
        {GALLERY_IMAGES.length > 0 && (
          <Reveal variant="fade">
            <div className="flex flex-col gap-3">
              <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.2em] text-[var(--accent)] text-center">
                From customer photos
              </p>
              <div
                className="flex gap-2.5 overflow-x-auto pb-2 w-full min-w-0"
                style={{ scrollbarWidth: 'none' }}
              >
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="relative flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-[6px] overflow-hidden bg-[var(--paper3)] cursor-pointer group"
                    aria-label={`View customer photo ${i + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="128px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Section title */}
        <div className="text-center">
          <Reveal variant="rise">
            <Eyebrow className="mb-3">What Owners Say</Eyebrow>
          </Reveal>
          <Reveal variant="rise">
            <SectionHeading className="!text-[clamp(1.75rem,3vw,2.5rem)]">
              Real reviews from real workspaces
            </SectionHeading>
          </Reveal>
        </div>

        {/* Featured review cards (the photo reviews) */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED.map((review, i) => (
            <Reveal key={i} variant="rise" delay={i * 0.1}>
              <ReviewCard review={review} onImageClick={(src) => {
                const idx = GALLERY_IMAGES.findIndex((g) => g.src === src)
                if (idx >= 0) setLightbox(idx)
              }} />
            </Reveal>
          ))}
        </div>

        {/* See all */}
        <Reveal variant="fade" className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 font-sans text-[0.9rem] font-medium text-[var(--accent)] hover:gap-3 transition-all"
          >
            See all {REVIEW_SUMMARY.count.toLocaleString()} reviews
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>

      {/* Lightbox */}
      {mounted && createPortal(
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ background: 'rgba(20, 18, 15, 0.92)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <button onClick={closeLightbox} className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Close">
                <X size={22} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Previous">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 md:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Next">
                <ChevronRight size={24} />
              </button>
              <motion.div
                className="relative w-[90vw] h-[80vh] max-w-[700px]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: E }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={GALLERY_IMAGES[lightbox].src}
                  alt={GALLERY_IMAGES[lightbox].alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </motion.div>
              <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 font-sans text-[0.8rem]">
                {lightbox + 1} of {GALLERY_IMAGES.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Section>
  )
}

function ReviewCard({ review, onImageClick }: { review: FullReview; onImageClick: (src: string) => void }) {
  const hasImages = review.images && review.images.length > 0
  return (
    <div className="flex flex-col gap-4 bg-[var(--paper)] p-6 rounded-[8px] h-full">
      {hasImages && (
        <div className={`grid gap-1.5 -mx-2 -mt-2 mb-2 ${review.images!.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {review.images!.map((img, j) => (
            <button
              key={j}
              onClick={() => onImageClick(img.src)}
              className={`relative overflow-hidden rounded-[6px] bg-[var(--paper3)] cursor-pointer ${review.images!.length > 1 ? 'aspect-square' : 'aspect-video'}`}
              aria-label="View photo"
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 33vw, 12vw" />
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <StarRating value={review.stars} size={16} />
        <span className="font-sans text-[0.72rem] text-[var(--ink-mute)]">{relativeDate(review.daysAgo)}</span>
      </div>
      <p className="font-sans text-[0.9rem] text-[var(--ink-soft)] leading-relaxed flex-1">
        &ldquo;{review.body}&rdquo;
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-[var(--ink)]/5">
        <div className="flex flex-col">
          <span className="font-sans text-[0.85rem] font-medium text-[var(--ink)]">{review.author}</span>
          <span className="font-sans text-[0.75rem] text-[var(--ink-mute)]">{review.config}</span>
        </div>
        {review.verified && (
          <span className="flex items-center gap-1 text-green-600">
            <BadgeCheck size={14} />
            <span className="font-sans text-[0.65rem]">Verified</span>
          </span>
        )}
      </div>
    </div>
  )
}