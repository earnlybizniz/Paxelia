'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'

/**
 * ProductVideo — a 16:9 showcase video that sits directly below the Features
 * (MaterialsCraft) grid on the product page.
 *
 * It renders a polished placeholder RIGHT NOW with no video file required.
 * The frame is locked to an exact 16:9 box (aspect-[16/9]), so when you drop
 * in the real 1920×1080 video there is ZERO layout shift on any screen — the
 * box never resizes, the page never jumps, and it stays perfect on mobile
 * (full-width, true 16:9, no letterboxing, no distortion).
 *
 * ── TO GO LIVE ──────────────────────────────────────────────────────────
 * Put your files in /public and set the two constants below using a leading
 * slash. Both should be 16:9 (the video is 1920×1080; the poster ideally too):
 *
 *   const VIDEO_SRC  = '/videos/wylorise-pdp.mp4'                 ← now live
 *   const POSTER_SRC = '/images/product/wylorise-pdp-poster.jpg' ← now live
 *
 * Leaving either as null is fine:
 *   • no POSTER_SRC → a warm on-brand gradient fills the frame
 *   • no VIDEO_SRC  → the "Video coming soon" placeholder stays visible
 *
 * When VIDEO_SRC is set, the poster (or gradient) shows with a play button;
 * pressing it mounts the <video> with native controls and starts playback
 * (sound allowed, because the user initiated it — works on mobile).
 * ─────────────────────────────────────────────────────────────────────────
 */

const VIDEO_SRC: string | null = '/videos/wylorise-pdp.mp4'
const POSTER_SRC: string | null = '/images/product/wylorise-pdp-poster.jpg'

export function ProductVideo() {
  const [playing, setPlaying] = useState(false)

  return (
    <Section id="product-video" tone="paper" wash>
      <div className="flex flex-col items-center text-center">
        {/* Heading — edit the copy or delete these two Reveals if you only want the frame */}
        <Reveal variant="rise">
          <Eyebrow className="mb-4">In Motion</Eyebrow>
        </Reveal>
        <Reveal variant="rise">
          <h2
            className="font-display font-normal text-[var(--ink)] tracking-[-0.02em] max-w-2xl"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
          >
            See it in motion
          </h2>
        </Reveal>

        {/* 16:9 video frame */}
        <Reveal variant="rise" className="mt-10 w-full">
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[12px] bg-[var(--paper3)] ring-1 ring-[var(--accent)]/15 shadow-[0_24px_70px_-28px_rgba(28,26,23,0.45)]">
              {/* Warm on-brand placeholder fill — only shown when no poster is set */}
              {!POSTER_SRC && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #f0e7d6 0%, #c9a24b 100%)' }}
                />
              )}

              {/* Poster still — shown until the user presses play */}
              {POSTER_SRC && !playing && (
                <Image
                  src={POSTER_SRC}
                  alt="Product video preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              )}

              {/* Real video — mounted only after play is pressed */}
              {VIDEO_SRC && playing && (
                <video
                  src={VIDEO_SRC}
                  poster={POSTER_SRC ?? undefined}
                  autoPlay
                  controls
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Play affordance — hidden once playing */}
              {!playing && (
                <button
                  type="button"
                  onClick={() => { if (VIDEO_SRC) setPlaying(true) }}
                  aria-label={VIDEO_SRC ? 'Play video' : 'Video coming soon'}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{ cursor: VIDEO_SRC ? 'pointer' : 'default' }}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--paper)]/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 md:h-20 md:w-20">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-6 w-6 fill-[var(--ink)] md:h-7 md:w-7">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  {!VIDEO_SRC && (
                    <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--ink)]/65">
                      Video coming soon
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
