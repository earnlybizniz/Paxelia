'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { BadgeCheck, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { StarRating } from '@/components/shell/Typography'
import { E } from '@/lib/motion'
import { ALL_REVIEWS, REVIEW_SUMMARY, type FullReview } from '@/lib/reviews-data'
import { relativeDate } from '@/lib/relative-date'

const GALLERY_IMAGES = ALL_REVIEWS.flatMap((r) =>
  (r.images ?? []).map((img) => ({ ...img, author: r.author }))
)

const PAGE_SIZE = 24

export function ReviewsPageClient() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const close = () => setLightbox(null)
  const prev = () => setLightbox((i) => (i === null ? i : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length))
  const next = () => setLightbox((i) => (i === null ? i : (i + 1) % GALLERY_IMAGES.length))

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const openBySrc = (src: string) => {
    const idx = GALLERY_IMAGES.findIndex((g) => g.src === src)
    if (idx >= 0) setLightbox(idx)
  }

  const shown = ALL_REVIEWS.slice(0, visible)

  return (
    <div className="mx-auto w-full max-w-[900px] px-5 md:px-8 py-12 md:py-20">
      {/* Back link */}
      <Link href="/product" className="inline-flex items-center gap-2 font-sans text-[0.85rem] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors mb-8">
        <ArrowLeft size={16} /> Back to the desk
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-12">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[3.5rem] md:text-[4.5rem] text-[var(--ink)] leading-none">{REVIEW_SUMMARY.score}</span>
          <span className="font-sans text-[1.1rem] text-[var(--ink-mute)]">/5</span>
        </div>
        <StarRating value={REVIEW_SUMMARY.score} size={22} />
        <p className="font-sans text-[0.9rem] text-[var(--ink-soft)]">
          Based on {REVIEW_SUMMARY.count.toLocaleString()} verified reviews
        </p>
      </div>

      {/* Photo gallery on top */}
      {GALLERY_IMAGES.length > 0 && (
        <div className="mb-14">
          <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.2em] text-[var(--accent)] mb-4">
            Customer photos
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="relative aspect-square rounded-[6px] overflow-hidden bg-[var(--paper3)] cursor-pointer group"
                aria-label={`View customer photo ${i + 1}`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 33vw, 18vw" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="flex flex-col divide-y divide-[var(--ink)]/8">
        {shown.map((review, i) => (
          <ReviewRow key={i} review={review} onImageClick={openBySrc} />
        ))}
      </div>

      {/* Load more */}
      {visible < ALL_REVIEWS.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="font-sans text-[0.9rem] font-medium text-[var(--accent)] border border-[var(--accent)]/30 rounded-full px-6 py-3 hover:bg-[var(--accent)]/5 transition-colors"
          >
            Show more reviews ({ALL_REVIEWS.length - visible} left)
          </button>
        </div>
      )}

      {/* Lightbox */}
      {mounted && createPortal(
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ background: 'rgba(20, 18, 15, 0.92)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
            >
              <button onClick={close} className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Close"><X size={22} /></button>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Previous"><ChevronLeft size={24} /></button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 md:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Next"><ChevronRight size={24} /></button>
              <motion.div
                className="relative w-[90vw] h-[80vh] max-w-[700px]"
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: E }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={GALLERY_IMAGES[lightbox].src} alt={GALLERY_IMAGES[lightbox].alt} fill className="object-contain" sizes="90vw" />
              </motion.div>
              <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 font-sans text-[0.8rem]">{lightbox + 1} of {GALLERY_IMAGES.length}</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

function ReviewRow({ review, onImageClick }: { review: FullReview; onImageClick: (src: string) => void }) {
  const hasImages = review.images && review.images.length > 0
  return (
    <div className="flex flex-col gap-3 py-7">
      <div className="flex items-center justify-between">
        <StarRating value={review.stars} size={16} />
        <span className="font-sans text-[0.72rem] text-[var(--ink-mute)]">{relativeDate(review.daysAgo)}</span>
      </div>
      <p className="font-sans text-[0.95rem] text-[var(--ink-soft)] leading-relaxed">
        &ldquo;{review.body}&rdquo;
      </p>
      {hasImages && (
        <div className="flex gap-2 flex-wrap">
          {review.images!.map((img, j) => (
            <button
              key={j}
              onClick={() => onImageClick(img.src)}
              className="relative w-20 h-20 rounded-[6px] overflow-hidden bg-[var(--paper3)] cursor-pointer"
              aria-label="View photo"
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="font-sans text-[0.85rem] font-medium text-[var(--ink)]">{review.author}</span>
        {review.config && <span className="font-sans text-[0.75rem] text-[var(--ink-mute)]">· {review.config}</span>}
        {review.verified && (
          <span className="flex items-center gap-1 text-green-600 ml-auto">
            <BadgeCheck size={14} />
            <span className="font-sans text-[0.65rem]">Verified</span>
          </span>
        )}
      </div>
    </div>
  )
}