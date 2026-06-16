'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Section } from '@/components/shell/Section'
import { Eyebrow } from '@/components/shell/Typography'

/**
 * DescriptionSections — the long-form Snapsticker Apex story, told as alternating
 * media/text blocks that go from broad (the dual-level concept) to specific
 * (drawers, holders, ports, lighting…) as you scroll.
 *
 * Each block's media can be a photo OR a looping muted video (for gifs we convert
 * to mp4). Until an asset is added (`src: ''`) a clean placeholder tile renders so
 * there's never a broken image and zero layout shift when the real asset drops in.
 *
 * Asset locations:
 *   • photos → /public/images/product/description/<name>.webp   (square 1200×1200)
 *   • videos → /public/videos/description/<name>.mp4            (square, muted loop)
 */

type Media = {
  kind: 'image' | 'video'
  src: string // '' until the asset is added
  alt: string
  poster?: string
  fit?: 'cover' | 'contain'
  placeholder: string // gradient shown before the asset is set
}

type Block = {
  eyebrow: string
  heading: string
  body: string[]
  media: Media
}

const BLOCKS: Block[] = [
  {
    eyebrow: 'Three-tier workspace',
    heading: 'Two desks in one footprint',
    body: [
      'An upper monitor shelf, a full work surface, and a hidden pegboard workbench — stacked into one frame, so a setup that normally sprawls saves up to 50% of the space.',
      'Sit two monitors up top or clamp on a monitor arm, work below, and keep tools on the panel behind. Everything in reach, nothing in the way.',
    ],
    media: {
      kind: 'image',
      src: '',
      alt: 'The Snapsticker Apex shown as three labelled tiers — monitor shelf, work surface, and hidden pegboard',
      placeholder: 'linear-gradient(135deg, #efe7da 0%, #a9743f 100%)',
    },
  },
  {
    eyebrow: 'Electric dual-motor lift',
    heading: 'Sit, stand, present — one tap',
    body: [
      'Glide from 30 to 55.9 inches on a quiet dual-motor lift. Three memory presets snap straight to your sitting, standing, and presentation heights.',
      'Switching positions through the day eases back and neck strain and keeps your focus up — no thinking, no workout.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'The Snapsticker Apex rising through its sitting, presentation, and standing presets',
      placeholder: 'linear-gradient(135deg, #ece4d6 0%, #6f4a26 100%)',
    },
  },
  {
    eyebrow: 'Hidden pegboard + drawers',
    heading: 'A place for every last thing',
    body: [
      'A magnetic pegboard hides behind the upper deck — move hooks, holders, and tools around in seconds, no screws or drilling.',
      'Smooth-gliding drawers keep parts, cables, and documents out of sight: three on the Compact, up to six on the larger sizes.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'Drawers gliding open and accessories rearranging on the magnetic pegboard',
      placeholder: 'linear-gradient(135deg, #e5e2dc 0%, #1a1a1a 100%)',
    },
  },
  {
    eyebrow: 'Snap-on accessories',
    heading: 'Drinks and snacks, off your desktop',
    body: [
      'Clip cup and snack holders onto the side rail exactly where you want them — deep or shallow, fixed or movable. Your surface stays clear and nothing gets knocked into your keyboard.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'A cup holder and snack tray snapping onto the side rail of the Snapsticker Apex',
      placeholder: 'linear-gradient(135deg, #f0e7d6 0%, #8a5a2b 100%)',
    },
  },
  {
    eyebrow: 'Built-in power',
    heading: 'Charge everything, hide every cable',
    body: [
      'Dust-proof AC outlets sit flush in the surface, a fast USB-C port handles your laptop, and a 3-in-1 wireless pad tops up your phone, earbuds, and watch at once.',
      'Power lives on the desk — not in a tangle on the floor.',
    ],
    media: {
      kind: 'image',
      src: '',
      alt: 'Flush AC outlets, USB-C port, and a 3-in-1 wireless charging pad built into the desktop',
      placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #2a2a2a 100%)',
    },
  },
  {
    eyebrow: 'Task + ambient lighting',
    heading: 'Light for work, light for play',
    body: [
      'A 10W task light under the upper deck throws clean, shadow-free 5000K light over detailed work. Behind it, a 10W RGBW strip sets the mood — white, warm, single colour, or dynamic, and it can sync to music or motion.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'The Snapsticker Apex lighting shifting from white task light to coloured RGB ambience',
      placeholder: 'linear-gradient(135deg, #efe7da 0%, #5a3d18 100%)',
    },
  },
  {
    eyebrow: 'Foldable PC stand',
    heading: 'Your tower, up off the floor',
    body: [
      'A built-in stand holds your PC tower at the side — off the floor and out of the dust — then folds away when you don’t need it.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'The side panel folding out into a stand and a PC tower sliding into place',
      placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #1a1a1a 100%)',
    },
  },
  {
    eyebrow: 'Lockable casters',
    heading: 'Roll it anywhere, then lock it down',
    body: [
      'Wheel the whole desk where you want it and step on the one-touch brake. All four casters lock solid — it won’t drift with two monitors and a full load on top.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'A foot pressing the one-step brake on the Snapsticker Apex caster',
      placeholder: 'linear-gradient(135deg, #efe7da 0%, #6f4a26 100%)',
    },
  },
  {
    eyebrow: 'Built to last',
    heading: 'Heavy-duty, and quiet about it',
    body: [
      'A steel-and-aluminium frame carries up to 50 kg (110 lb) on twin synchronised motors, with rounded anti-collision corners for safety.',
      'Those motors run under 40 dB — quiet enough to raise the desk mid-call or mid-stream without anyone hearing it.',
    ],
    media: {
      kind: 'video',
      src: '',
      alt: 'The Snapsticker Apex lifting smoothly with a heavy load on top',
      placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #2a2a2a 100%)',
    },
  },
]

function BlockMedia({ media, priority }: { media: Media; priority?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v || media.kind !== 'video' || !media.src) return
    v.muted = true
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [media.src, media.kind])

  // No asset yet → clean placeholder tile (faint label, zero layout shift).
  if (!media.src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: media.placeholder }}>
        <span className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-[var(--paper)]/45">
          {media.kind === 'video' ? 'Video' : 'Photo'}
        </span>
      </div>
    )
  }

  if (media.kind === 'video') {
    return (
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={media.alt}
        className={`absolute inset-0 w-full h-full ${media.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      />
    )
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes="(max-width: 768px) 100vw, 600px"
      priority={priority}
      className={media.fit === 'contain' ? 'object-contain p-6 md:p-10' : 'object-cover'}
    />
  )
}

export function DescriptionSections() {
  return (
    <Section id="features" tone="paper" wash>
      <div className="flex flex-col gap-20 md:gap-28">
        {BLOCKS.map((b, i) => {
          const mediaLeft = i % 2 === 0
          return (
            <div key={i} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              {/* COPY — always first in the DOM so it stacks above the media on mobile */}
              <div className={`flex flex-col gap-5 ${mediaLeft ? 'md:order-2' : 'md:order-1'}`}>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <h2
                  className="font-display font-semibold leading-[1.14] tracking-[-0.01em] text-[var(--ink)]"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
                >
                  {b.heading}
                </h2>
                <div className="flex flex-col gap-3">
                  {b.body.map((p, j) => (
                    <p key={j} className="max-w-[48ch] font-sans text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* MEDIA */}
              <div className={mediaLeft ? 'md:order-1' : 'md:order-2'}>
                <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-[var(--paper2)]">
                  <BlockMedia media={b.media} priority={i === 0} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
