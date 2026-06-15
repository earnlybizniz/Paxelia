import Image from 'next/image'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'

/**
 * DescriptionSections — the long-form product story, told as alternating
 * image/text blocks. Replaces the old FeatureDeepDive section that sat below
 * the product video.
 *
 * Layout:
 *   • Desktop (md+): two columns, image and copy side by side, alternating
 *     side every block (block 1 image-left, block 2 image-right, …).
 *   • Mobile: a single column where, for every block, the COPY comes first and
 *     its image sits directly beneath it — copy 1 → image 1 → copy 2 → image 2 …
 *     (the copy is always first in the DOM; md:order only flips sides on desktop).
 *
 * Images are square 800×800 assets in /public/images/product/description/.
 * Block 1 is a transparent desk cutout (object-contain so it "floats"); every
 * other block is a photo that fills its square frame (object-cover).
 *
 * All copy lives in BLOCKS below — edit freely.
 */

type Block = {
  eyebrow: string
  heading: string
  body: string[]
  image: string
  imageAlt: string
  fit?: 'cover' | 'contain'
  cta?: { label: string; href: string }
}

const BLOCKS: Block[] = [
  {
    eyebrow: 'Award-winning design',
    heading: 'A desk worth showing off',
    body: [
      'Solid natural-bamboo top with a quiet dual-motor frame — the kind of restraint that earned International Design and SIT Furniture Design Awards.',
      'Built to look beautiful and perform flawlessly for years in any workspace.',
    ],
    image: '/images/product/description/01-design.png',
    imageAlt: 'The Wylorise Sovereign Q8 standing desk with a walnut top and black frame',
    fit: 'contain',
  },
  {
    eyebrow: 'Dual-motor · three-stage frame',
    heading: 'A workspace that moves with you',
    body: [
      'Twin motors with three-stage oval legs adjust from 22.8 to 49.2 inches—quiet enough to adjust mid-call, sturdy enough for multi-monitor setups without wobble.',
      'Four presets remember your exact heights, and anti-collision detection stops instantly when meeting obstacles.',
    ],
    image: '/images/product/description/02-flexibility.jpg',
    imageAlt: 'The dual-motor three-stage lifting frame of the Sovereign Q8',
  },
  {
    eyebrow: 'Integrated cable tray',
    heading: 'Cables, out of sight',
    body: [
      'Full-width tray runs the frame length so cables, adapters, and power strips glide smoothly as the desk rises and lowers—never dangling, never snagging.',
      'Clean desk appearance with all tangles hidden beneath.',
    ],
    image: '/images/product/description/03-cable-tray.jpg',
    imageAlt: 'The under-desk cable management tray running the width of the frame',
  },
  {
    eyebrow: 'Pull-out drawer',
    heading: 'Room for the small things',
    body: [
      'A 28.3 × 12.8-inch drawer sits flush under the top for pens, chargers, and clutter, then tucks completely away when not needed.',
    ],
    image: '/images/product/description/04-drawer.jpg',
    imageAlt: 'The built-in pull-out storage drawer, open and organized',
  },
  {
    eyebrow: 'Bamboo top · wireless charging',
    heading: 'A surface that gives back',
    body: [
      'Solid bamboo sealed with protective lacquer—twice as hard as ordinary wood, water and scratch-resistant, and sustainable since bamboo regrows in years.',
      'A 10W Qi pad is embedded in the surface; set your phone down and it charges—no cable required.',
    ],
    image: '/images/product/description/05-bamboo-charging.jpg',
    imageAlt: 'The natural bamboo desktop with a phone charging on the built-in wireless pad',
  },
  {
    eyebrow: 'Smart touch console',
    heading: 'Meets you at your level',
    body: [
      'Backlit console with digital height display, four memory presets, and USB-A/USB-C ports for instant charging.',
      'One tap returns to your exact sit or stand height—no reaching, no guesswork.',
    ],
    image: '/images/product/description/06-control-panel.jpg',
    imageAlt: 'The smart touch control console with height display, presets, and USB ports',
  },
  {
    eyebrow: 'Monitor-arm ready',
    heading: 'Clamp on with confidence',
    body: [
      'A solid wood block fixed beneath the top gives monitor-arm clamps a firm grip—no flexing or cracking the bamboo.',
      'Screens stay rock-solid where you place them, even as the desk moves.',
    ],
    image: '/images/product/description/07-monitor-arm.jpg',
    imageAlt: 'The solid wood block under the desktop that supports a monitor-arm clamp',
  },
  {
    eyebrow: 'Three-step setup',
    heading: 'Three steps, done',
    body: [
      'No cryptic diagrams or missing screws. Attach top, fit frame, set feet—and you&apos;re working. Every part is clearly labeled so assembly takes minutes.',
    ],
    image: '/images/product/description/08-assembly.jpg',
    imageAlt: 'The labeled components of the Sovereign Q8 laid out for assembly',
  },
]

export function DescriptionSections() {
  return (
    <Section id="features" tone="paper" wash>
      <div className="flex flex-col gap-20 md:gap-28">
        {BLOCKS.map((b, i) => {
          const imageLeft = i % 2 === 0
          return (
            <div key={i} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              {/* COPY — always first in the DOM → on mobile it stacks above the image */}
              <Reveal
                variant="rise"
                className={`flex flex-col gap-5 ${imageLeft ? 'md:order-2' : 'md:order-1'}`}
              >
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <h2
                  className="font-display font-normal leading-[1.1] tracking-[-0.02em] text-[var(--ink)]"
                  style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
                >
                  {b.heading}
                </h2>
                <div className="flex flex-col gap-3">
                  {b.body.map((p, j) => (
                    <p
                      key={j}
                      className="max-w-[46ch] font-sans text-[0.98rem] leading-relaxed text-[var(--ink-soft)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {b.cta && (
                  <div className="pt-1">
                    <a
                      href={b.cta.href}
                      className="inline-flex items-center rounded-full border border-[var(--ink)]/25 px-6 py-2.5 font-sans text-[0.85rem] font-medium text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                    >
                      {b.cta.label}
                    </a>
                  </div>
                )}
              </Reveal>

              {/* IMAGE */}
              <Reveal variant="rise" className={imageLeft ? 'md:order-1' : 'md:order-2'}>
                <div className="relative aspect-square w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={b.image}
                    alt={b.imageAlt}
                    fill
                    className={b.fit === 'contain' ? 'object-contain p-6 md:p-10' : 'object-cover'}
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
