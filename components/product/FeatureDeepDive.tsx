'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useProduct } from '@/contexts/product-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import type { ProductImage } from '@/lib/pdp-product'

/**
 * FeatureVideo — a GIF-style looping video for a feature pillar.
 *
 * Guarantees "already playing, never blank, never glitchy":
 *  1. The poster image is rendered immediately (and as the <video> poster), so the
 *     slot is NEVER an empty/loading box — worst case a crisp still frame shows.
 *  2. An IntersectionObserver with a generous rootMargin starts LOADING the video
 *     well before it scrolls into view (preload ahead of arrival).
 *  3. We only call play() once the browser reports it can play through; the poster
 *     stays until the first real frame paints, so there is no pop-in.
 *  4. The <video> sits at z-[1] ABOVE the gradient placeholder (prevents the
 *     "brown overlay covering the video" bug we hit in the gallery).
 *  5. Muted + playsInline + loop = reliable mobile autoplay. Not clickable, not
 *     zoomable — purely decorative, unlike the main gallery.
 */
/**
 * FeatureVideo — a GIF-style looping clip that is GUARANTEED to play.
 *
 * Why the old approach failed: all 4 videos mounted and tried to autoplay at
 * once on page load. Browsers throttle concurrent media, so the losers fell back
 * to showing the NATIVE play-button overlay (which then fought our JS — "click
 * does nothing"). The fixes here, with NO loss of video quality:
 *
 *  1. LAZY: the <video> is only mounted once its slot scrolls near the viewport
 *     (IntersectionObserver). They never all load at once, so no throttle race.
 *  2. NO NATIVE UI EVER: controls is never set, plus disablePictureInPicture and
 *     controlsList — so the stuck play-button overlay can't appear.
 *  3. RELENTLESS PLAY: once mounted+visible we call play() on a short interval
 *     until it actually starts, then stop. If it ever pauses (tab backgrounded,
 *     OS interruption) we re-arm. So it self-heals to "always playing".
 *  4. Poster shows instantly underneath, fades out only once real playback
 *     starts — so there is never a blank/loading box and never a hard cut.
 *  5. z-[2] keeps the video above the gradient placeholder (no brown overlay).
 */
function FeatureVideo({ item }: { item: ProductImage }) {
  const slotRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)   // is the <video> in the DOM yet
  const [visible, setVisible] = useState(false)    // is the slot on/near screen
  const [isPlaying, setIsPlaying] = useState(false)

  // Mount the <video> only when the slot nears the viewport (lazy load).
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

  // Relentlessly ensure playback whenever the clip is mounted AND visible.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !mounted) return

    // Lock muted/inline at the property level so autoplay is always permitted,
    // and make sure no native controls can ever show.
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.controls = false

    let stopped = false
    let timer: ReturnType<typeof setInterval> | null = null

    const attempt = () => {
      if (stopped || !visible) return
      if (!v.paused && !v.ended && v.readyState >= 2) { setIsPlaying(true); return }
      const p = v.play()
      if (p && typeof p.then === 'function') {
        p.then(() => { setIsPlaying(true) }).catch(() => { /* will retry on next tick */ })
      }
    }

    // Try immediately, on every readiness milestone, and on a short interval
    // until it sticks. The interval clears itself once playing.
    attempt()
    const onReady = () => attempt()
    v.addEventListener('loadeddata', onReady)
    v.addEventListener('canplay', onReady)
    v.addEventListener('playing', () => setIsPlaying(true))
    v.addEventListener('pause', () => { if (!stopped && visible) attempt() })

    timer = setInterval(() => {
      if (stopped) return
      if (visible && (v.paused || v.ended)) attempt()
    }, 400)

    // Re-arm when the tab/window regains focus (browsers pause backgrounded media).
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
  }, [mounted, visible, item.src])

  return (
    <div ref={slotRef} className="relative aspect-[3/4] overflow-hidden rounded-[8px]">
      {/* Gradient placeholder — behind everything (z-0). */}
      <div className="absolute inset-0 z-0" style={{ background: item.placeholder }} />

      {/* Poster still — instant; fades out only once the video is truly playing. */}
      {item.poster && (
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          priority
          className={`object-cover z-[1] transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Video — lazily mounted, native UI fully disabled, never interactive. */}
      {mounted && item.src && (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          aria-label={item.alt}
          tabIndex={-1}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 z-[2] w-full h-full object-cover pointer-events-none"
          onPlaying={() => setIsPlaying(true)}
        />
      )}
    </div>
  )
}

export function FeatureDeepDive() {
  const { product } = useProduct()

  return (
    <Section id="features" tone="paper2" wash>
      <div className="flex flex-col gap-16 md:gap-24">
        {/* Header */}
        <div className="max-w-2xl">
          <Reveal variant="rise">
            <Eyebrow className="mb-4">Why It Costs What It Costs</Eyebrow>
          </Reveal>
          <Reveal variant="rise">
            <SectionHeading>
              Built to last a lifetime, not a lease
            </SectionHeading>
          </Reveal>
        </div>

        {/* Features */}
        {product.features.map((feature, i) => {
          const isEven = i % 2 === 0

          return (
            <div
              key={feature.num}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* Media */}
              <Reveal
                variant={isEven ? 'slideL' : 'slideR'}
                className={isEven ? 'min-w-0' : 'min-w-0 md:order-2'}
              >
                {feature.image.kind === 'video'
                  ? <FeatureVideo item={feature.image} />
                  : (
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[8px]">
                      <div className="absolute inset-0 z-0" style={{ background: feature.image.placeholder }} />
                      {feature.image.src && (
                        <Image
                          src={feature.image.src}
                          alt={feature.image.alt}
                          fill
                          className="object-cover z-[1]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  )
                }
              </Reveal>

              {/* Content */}
              <Reveal
                variant={isEven ? 'slideR' : 'slideL'}
                className={isEven ? 'min-w-0' : 'min-w-0 md:order-1'}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[3rem] md:text-[4rem] text-[var(--accent)]/20 leading-none">
                      {feature.num}
                    </span>
                    <span className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                      {feature.kicker}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.5rem] md:text-[1.75rem] text-[var(--ink)] leading-[1.2] tracking-[-0.01em]">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-[0.95rem] text-[var(--ink-soft)] leading-relaxed">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
    </Section>
  )
}