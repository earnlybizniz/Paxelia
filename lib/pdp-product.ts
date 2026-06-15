/**
 * PDP Product Configuration — Single Source of Truth
 * Editing this reskins the product page for any single-desk brand.
 */

// Review score/count come from ONE place (lib/reviews-data.ts) so the Buy Box
// header, social-proof bar, and the reviews section can never show different
// numbers again.
import { REVIEW_SUMMARY } from './reviews-data'

// ============================================================
// TYPES
// ============================================================
export type VariantOption = {
  id: string
  label: string
  sub?: string // e.g. "60 × 30 in" for size cards
  swatch?: string // CSS color for finish swatches
  image?: string // gallery image to swap to when selected
  priceDelta: number
  compareDelta?: number // optional: delta applied to compareAt for this option (size axis only)
  tagline?: string      // optional: short framing line shown on size cards (upsell reason)
  specs?: { label: string; value: string }[] // optional: per-size spec overrides (merged over product.specs)
  default?: boolean
  soldOut?: boolean
}

export type VariantAxis = {
  key: string
  label: string
  type: 'card' | 'swatch'
  help?: string // e.g. "Which size fits me?" link text
  options: VariantOption[]
}

export type ProductImage = {
  src: string
  alt: string
  placeholder: string // gradient placeholder
  ratio?: string // e.g. '1/1', '4/3'
  /** 'video' renders an autoplay/loop/muted <video> instead of an <Image>. Omit/`'image'` for stills. */
  kind?: 'image' | 'video'
  /** Optional poster frame (still shown before/while the video loads). */
  poster?: string
  /** When true, this image is NOT shown as a browsable thumbnail — it only
   *  appears in the main viewer when its matching variant (size/frame) is
   *  selected. Keep these LAST in the gallery array (they sit after the
   *  browsable product photos). */
  variantOnly?: boolean
}

export type TrustItem = {
  icon: string
  title: string
  sub: string
}

export type Feature = {
  num: string
  kicker: string
  title: string
  body: string
  image: ProductImage
}

export type ReviewItem = {
  stars: number
  body: string
  author: string
  config: string
  photo?: ProductImage
  verified: boolean
}

export type MaterialItem = {
  icon: string // icon image path (or lucide name in other templates)
  title: string
  detail: string
}

export type DurabilityStat = {
  stat: string
  label: string
}

export type Product = {
  slug: string
  name: string
  brand: string
  eyebrow: string
  basePrice: number
  compareAt?: number
  currency: string
  rating: number
  reviewCount: number
  soldThisMonth?: number
  viewingNow?: number
  badges: string[]
  axes: VariantAxis[]
  gallery: ProductImage[]
  galleryByFinish?: { [finishId: string]: ProductImage[] }
  highlights: string[]
  description: string[]          // "Full story" paragraphs
  materials: MaterialItem[]      // Materials & craft grid
  durability: DurabilityStat[]   // Built-to-last stats
  lifestyle: ProductImage[]      // "In your space" strip
  trust: TrustItem[]
  specs: { label: string; value: string }[]
  inBox: string[]
  features: Feature[]
  dimensions: {
    width: string
    depth: string
    heightRange: string
    capacity: string
    weight: string
  }
  reviews: {
    score: number
    count: number
    dist: number[]
    items: ReviewItem[]
  }
  faq: { q: string; a: string }[]
  shipEta: string
}

// ============================================================
// WYLORISE PRODUCT
// NOTE: export const name kept as ALDER_PRODUCT — it is imported by the
// webhook (money path) and several components. Only its CONTENTS change.
// ============================================================
export const ALDER_PRODUCT: Product = {
  slug: 'wylorise-sovereign-q8',
  name: 'The Sovereign Q8',
  brand: 'Wylorise',
  eyebrow: "Everything you need in a standing desk. Nothing you don't.",
  basePrice: 139.99,      // The Pro (md) = default
  compareAt: 699.99,      // Pro was-price; per-size overrides via compareDelta below
  currency: 'USD',
  // ── Rating + count derive from REVIEW_SUMMARY (lib/reviews-data.ts) ──
  rating: REVIEW_SUMMARY.score,
  reviewCount: REVIEW_SUMMARY.count,
  soldThisMonth: 140,     // PLACEHOLDER
  viewingNow: 22,         // PLACEHOLDER
  badges: ['Award-Winning Design', 'Wireless Charging Built In', '15-Year Frame Warranty'],

  axes: [
    {
      key: 'size',
      label: 'Size',
      type: 'card',
      help: 'Which size fits me?',
      options: [
        // ids MUST stay sm/md/lg — these keys flow into whop-plans.ts + cart + checkout.
        // price    = basePrice + priceDelta   → 99.99 / 139.99 / 189.99
        // compareAt = compareAt + compareDelta → 499.99 / 699.99 / 899.99
        {
          id: 'sm', label: 'Standard', sub: '55 × 28 in', image: '/images/product/gallery/size-standard.png',
          tagline: 'Single-monitor setups & tighter rooms',
          priceDelta: -40, compareDelta: -200,                 // 99.99 (was 499.99)
          specs: [
            { label: 'Desktop Size', value: '55" W × 28" D' },
            { label: 'Height Range', value: '23.6" – 48.8"' },
            { label: 'Best For', value: 'Laptop or single monitor' },
          ],
        },
        {
          id: 'md', label: 'Pro', sub: '63 × 30 in', image: '/images/product/gallery/size-pro.png',
          tagline: 'Room for dual monitors — the popular pick',
          priceDelta: 0, compareDelta: 0, default: true,       // 139.99 (was 699.99)
          specs: [
            { label: 'Desktop Size', value: '63" W × 30" D' },
            { label: 'Height Range', value: '22.8" – 49.2"' },
            { label: 'Best For', value: 'Dual-monitor setups' },
          ],
        },
        {
          id: 'lg', label: 'Executive', sub: '72 × 30 in', image: '/images/product/gallery/size-executive.png',
          tagline: 'Widest top — triple-monitor & executive setups',
          priceDelta: 50, compareDelta: 200,                   // 189.99 (was 899.99)
          specs: [
            { label: 'Desktop Size', value: '72" W × 30" D' },
            { label: 'Height Range', value: '22.8" – 49.2"' },
            { label: 'Best For', value: 'Triple-monitor / executive' },
          ],
        },
      ],
    },
    {
      key: 'finish',
      label: 'Frame color',
      type: 'swatch',
      options: [
        // ids MUST stay white / mocha — these flow into the cart finishId
        // ('white' | 'mocha'), the cart drawer, checkout summary, and order
        // emails. priceDelta + compareDelta are 0 on BOTH: the frame colour
        // never changes the price or the Whop plan (plans are size-only).
        { id: 'white', label: 'White', swatch: '#e6e3dc', image: '/images/product/gallery/frame-white.png', priceDelta: 0, compareDelta: 0, default: true },
        { id: 'mocha', label: 'Black', swatch: '#1b1a17', image: '/images/product/gallery/frame-black.png', priceDelta: 0, compareDelta: 0 },
      ],
    },
  ],

  // Frame colours AND sizes share ONE flat gallery (no galleryByFinish). Each
  // frame/size option's `image` points at a gallery entry; selecting it jumps
  // the gallery to that image (see setOption in contexts/product-context.tsx).
  // gallery[0] is the default hero + the cart/email fallback image.
  gallery: [
    // ── Browsable product photos (these are the gallery thumbnails) ──�����──────
    { src: '/images/product/gallery/pdp-02.jpg', alt: 'The Wylorise Sovereign Q8 with a natural bamboo top and white frame, styled with a monitor in a warm home office', placeholder: 'linear-gradient(135deg, #efe6d3 0%, #c19a52 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-03.jpg', alt: 'The Sovereign Q8 in a bright, sunlit room with a laptop, desk lamp, and coffee', placeholder: 'linear-gradient(135deg, #f4efe3 0%, #cda158 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-04.jpg', alt: 'The Sovereign Q8 paired with an ergonomic chair in a modern home office', placeholder: 'linear-gradient(135deg, #ece4d6 0%, #b98f4e 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-05.jpg', alt: 'Overhead view of the natural bamboo desktop with the built-in wireless charging spot', placeholder: 'linear-gradient(135deg, #efe6d3 0%, #cda158 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-06.jpg', alt: 'Overhead view of the desk in use with a laptop, coffee, and a phone charging on the surface', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #a06d28 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-07.jpg', alt: 'The Sovereign Q8 used as a vanity table in a bright bedroom', placeholder: 'linear-gradient(135deg, #f0e7d6 0%, #c9a24b 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/pdp-08.jpg', alt: 'The Sovereign Q8 at sitting height in a sunlit office with an ergonomic chair', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #b07a2e 100%)', ratio: '1/1' },

    // ── Variant shots (NOT browsable) — surfaced only when their size/frame is
    //    selected. setOption() in product-context jumps the viewer here by src;
    //    Gallery hides any image flagged variantOnly from the thumbnail strip.
    //    Keep these LAST so the browsable photos stay contiguous at the front. ──
    { src: '/images/product/gallery/frame-white.png', alt: 'The Wylorise Sovereign Q8 with the white frame and a natural bamboo top — full studio view', placeholder: 'linear-gradient(135deg, #f3ecdd 0%, #cda158 100%)', ratio: '1/1', variantOnly: true },
    { src: '/images/product/gallery/frame-black.png', alt: 'The Wylorise Sovereign Q8 with the black frame and a natural bamboo top — full studio view', placeholder: 'linear-gradient(135deg, #e5e2dc 0%, #1b1a17 100%)', ratio: '1/1', variantOnly: true },
    { src: '/images/product/gallery/size-standard.png', alt: 'Size guide — The Standard: 55 by 28 inch top, 23.6 to 48.8 inch height range', placeholder: 'linear-gradient(135deg, #ffffff 0%, #f0e7d6 100%)', ratio: '1/1', variantOnly: true },
    { src: '/images/product/gallery/size-pro.png', alt: 'Size guide — The Pro: 63 by 30 inch top, 22.8 to 49.2 inch height range', placeholder: 'linear-gradient(135deg, #ffffff 0%, #f0e7d6 100%)', ratio: '1/1', variantOnly: true },
    { src: '/images/product/gallery/size-executive.png', alt: 'Size guide — The Executive: 72 by 30 inch top, 22.8 to 49.2 inch height range', placeholder: 'linear-gradient(135deg, #ffffff 0%, #f0e7d6 100%)', ratio: '1/1', variantOnly: true },
  ],

  highlights: [
    'Natural bamboo top with a protective lacquer — about twice as hard as traditional wood, and naturally water- and scratch-resistant',
    'Dual-motor, three-stage oval legs raise and lower smoothly and hold steady up to a full 220 lb',
    'Built-in 10W wireless charging pad plus USB-A and USB-C ports, right on the front touch console',
    'Four programmable height presets and anti-collision detection — your perfect heights at one tap, safely',
    "Award-winning design at factory-direct pricing — everything you need, nothing you don't, at the price it should have been",
  ],

  description: [
    "Most standing desks are priced like a luxury — laminate tops, hollow frames, and a short list of features stretched across a long price tag. The Wylorise Sovereign Q8 takes the opposite approach: a real natural-bamboo surface and the features people actually use, sold factory-direct so you pay for the desk and not the markup.",
    "The top is genuine bamboo, sealed with a protective lacquer that makes it roughly twice as hard as traditional wood and naturally resistant to water and scratches. Bamboo is a fast-renewing grass, so the surface is as sustainable as it is warm to look at. Set into the front edge is a touch console with a built-in wireless charging pad and both USB-A and USB-C ports, so your phone and peripherals stay powered without a tangle of cables.",
    "Underneath, a dual-motor three-stage frame raises and lowers quietly and holds steady up to 220 pounds, with four programmable presets and anti-collision detection built in. A pull-out drawer keeps small things close, an under-desk tray hides your cables, and a solid wood block is fixed beneath the top so a clamp-style monitor arm has something firm to grip. It is an award-winning design at an honest, factory-direct price — everything you need, nothing you don't.",
  ],

  materials: [
    { icon: '/images/product/icons/icon-dual-motor.png', title: 'Dual Motor', detail: 'Two motors and a three-stage frame raise and lower quietly and hold rock-steady.' },
    { icon: '/images/product/icons/icon-wireless-charging.png', title: 'Wireless Charging', detail: 'A 10W Qi pad sits in the top — set your phone down and it charges.' },
    { icon: '/images/product/icons/icon-cable-tray.png', title: 'Cable Management Tray', detail: 'An under-desk tray keeps your power strip and cables out of sight.' },
    { icon: '/images/product/icons/icon-drawer.png', title: 'Embedded Drawer', detail: 'A built-in drawer, 28.3 × 12.8 × 1.97 in, for pens, notes, and a charger.' },
    { icon: '/images/product/icons/icon-usb.png', title: 'USB Ports', detail: 'USB-A and USB-C on the front console — charge devices without an outlet.' },
    { icon: '/images/product/icons/icon-height-range.png', title: 'Height Range', detail: '22.8″–49.2″ of sit-to-stand travel with the bamboo top on.' },
    { icon: '/images/product/icons/icon-desktop.png', title: 'Applicable Desktop', detail: 'A natural lacquered bamboo top — about twice as hard as ordinary wood.' },
    { icon: '/images/product/icons/icon-load-capacity.png', title: 'Load Capacity', detail: 'Holds a full 220 lb — multiple monitors and the rest of your setup.' },
  ],

  durability: [
    { stat: '220 lb', label: 'Rated lift capacity' },
    { stat: '22.8–49.2"', label: 'Sit-to-stand range' },
    { stat: '4 presets', label: 'Programmable heights' },
    { stat: '15 years', label: 'Warranty — frame & motor' },
  ],

  lifestyle: [
    { src: '/images/product/gallery/07.png', alt: 'The Wylorise Sovereign Q8 as a bedroom vanity, styled beneath a round mirror', placeholder: 'linear-gradient(135deg, #f0e7d6 0%, #c9a24b 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/08.png', alt: 'The Wylorise Sovereign Q8 in a bright home office with an ergonomic chair by the window', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #b07a2e 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/02.png', alt: 'The Wylorise Sovereign Q8 styled head-on against a warm plaster wall', placeholder: 'linear-gradient(135deg, #efe6d3 0%, #c19a52 100%)', ratio: '1/1' },
  ],

  trust: [
    { icon: 'RotateCcw', title: '30-Day Returns', sub: 'Risk-free in your space' },
    { icon: 'Truck', title: 'Free Shipping', sub: 'On all US orders' },
    { icon: 'Shield', title: '15-Year Frame Warranty', sub: 'Frame, motor & electronics' },
    { icon: 'Lock', title: 'Secure Checkout', sub: 'Encrypted payment' },
  ],

  specs: [
    { label: 'Desktop Material', value: 'Natural bamboo with protective lacquer' },
    { label: 'Frame Material', value: 'Steel, three-stage oval legs' },
    { label: 'Frame Color', value: 'White' },
    { label: 'Height Range', value: '22.8" – 49.2"' },
    { label: 'Lift Capacity', value: '220 lb' },
    { label: 'Motor', value: 'Dual motor, 3-stage' },
    { label: 'Height Presets', value: '4 programmable + anti-collision' },
    { label: 'Charging', value: '10W wireless pad · USB-A + USB-C' },
    { label: 'Storage', value: 'Pull-out drawer (28.3 × 12.8 × 1.97 in) + under-desk cable tray' },
    { label: 'Monitor Arm Ready', value: 'Solid wood block under the top for a clamp mount' },
    { label: 'Assembly', value: 'Required — instructions & hardware included' },
    { label: 'Warranty', value: '15-year frame & motor · 5-year bamboo top' },
    { label: 'Care', value: 'Wipe clean with a soft, damp cloth' },
  ],

  inBox: [
    'Natural bamboo desktop',
    'Dual-motor adjustable steel frame (3-stage oval legs)',
    'Front touch console with wireless charging + USB ports',
    'Pull-out storage drawer',
    'Under-desk cable management tray',
    'Solid wood mounting block for a monitor-arm clamp',
    'Power adapter and cabling',
    'Assembly hardware, tools, and illustrated instructions',
  ],

  features: [
    {
      num: '01',
      kicker: 'BAMBOO TOP - WIRELESS CHARGING',
      title: 'A surface that gives back',
      body: 'Solid bamboo sealed with protective lacquer—roughly twice as hard as ordinary wood, naturally water and scratch-resistant. A 10W Qi charging pad is built into the front edge, so your phone charges with no cables required.',
      image: { src: '/images/product/features/surface.png', alt: 'Close-up of the natural bamboo desktop surface and grain', placeholder: 'linear-gradient(135deg, #efe6d3 0%, #cda158 100%)', ratio: '3/4' },
    },
    {
      num: '02',
      kicker: 'MONITOR ARM READY',
      title: 'Clamp on with confidence',
      body: 'A solid wood block is fixed beneath the top so monitor-arm clamps have something firm to grip—no flexing the bamboo, no crushing over time. Your screens stay exactly where you set them, even when the desk moves.',
      image: { src: '/images/product/features/charging.png', alt: 'The front touch console with the built-in wireless charging pad', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #8d6022 100%)', ratio: '3/4' },
    },
    {
      num: '03',
      kicker: 'INTEGRATED CABLE TRAY',
      title: 'Cables, out of sight',
      body: 'A full-width tray runs beneath the top, so your power strip and cables hide as the desk rises and lowers—never dangling, never snagging. What you see is the desk. What you don&apos;t is the tangle.',
      image: { src: '/images/product/features/storage.png', alt: 'The pull-out storage drawer open under the desktop', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #b07a2e 100%)', ratio: '3/4' },
    },
    {
      num: '04',
      kicker: 'SMART TOUCH CONSOLE',
      title: 'Meets you at your level',
      body: 'A backlit touch console with a digital height readout, four programmable presets, USB-A and USB-C ports, and anti-collision detection. One tap returns you to your exact sit or stand height—no reaching, no guesswork.',
      image: { src: '/images/product/features/cable.png', alt: 'The under-desk cable management tray', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #a06d28 100%)', ratio: '3/4' },
    },
  ],

  dimensions: {
    width: '55" / 63" / 72"',
    depth: '28" / 30" / 30"',
    heightRange: '22.8" – 49.2"',
    capacity: '220 lb',
    weight: 'Varies by size',
  },

  // ── reviews summary — derived from REVIEW_SUMMARY (single source of truth) ──
  reviews: {
    score: REVIEW_SUMMARY.score,
    count: REVIEW_SUMMARY.count,
    dist: REVIEW_SUMMARY.dist,
    items: [
      {
        stars: 5,
        body: "The bamboo top looks fantastic on video calls, and I still can't believe the price — it feels like a desk that should cost three times as much.",
        author: 'Marcus T.',
        config: 'The Pro',
        verified: true,
        photo: { src: '', alt: 'Customer workspace with the Wylorise Sovereign Q8', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #b07a2e 100%)', ratio: '16/9' },
      },
      {
        stars: 5,
        body: 'Smooth, quiet, and rock-steady even with two monitors and a laptop on it. Charging my phone right on the desk is the little thing I did not know I needed.',
        author: 'Priya S.',
        config: 'The Standard',
        verified: true,
      },
      {
        stars: 5,
        body: 'I was nervous ordering a desk like this online, but it arrived perfectly and went together easily. The four height presets and the hidden cable tray are my favorite parts.',
        author: 'James K.',
        config: 'The Executive',
        verified: true,
        photo: { src: '', alt: 'The Wylorise Sovereign Q8 in a home office', placeholder: 'linear-gradient(135deg, #efe6d3 0%, #8d6022 100%)', ratio: '16/9' },
      },
    ],
  },

  faq: [
    { q: 'Is the top real bamboo?', a: 'Yes — every top is natural bamboo sealed with a protective lacquer, not laminate or a printed pattern. Because it is real bamboo, the grain varies slightly from desk to desk, so yours is one of a kind.' },
    { q: 'How much weight can it hold?', a: 'The dual-motor, three-stage frame is rated to 220 lb, so it comfortably supports multiple monitors, a laptop, and the rest of your setup while moving between sitting and standing.' },
    { q: 'Can I mount a monitor arm?', a: "Yes. A solid wood block is fixed beneath the desktop so a clamp-style monitor arm has something firm to grip — there's no flexing or cracking the bamboo." },
    { q: 'Does it charge my devices?', a: 'A 10W wireless pad sits on the front touch console, alongside USB-A and USB-C ports, so you can charge a phone and plug in peripherals without reaching for a wall outlet.' },
    { q: 'Does it require assembly?', a: 'Some assembly is required. It ships in two boxes with all the hardware, tools, and illustrated instructions, and most people set it up without any special tools.' },
    { q: "What's the warranty?", a: 'The frame, motor, and electronics are covered for 15 years, and the bamboo top is covered for 5 years.' },
  ],

  shipEta: 'Ships in 1–2 business days',
}
/**
 * getVariantHeroImage — the canonical image for a chosen colour/finish variant.
 *
 * Convention (data-driven, NOT hardcoded): the hero image for a variant is the
 * FIRST image in that finish's gallery (galleryByFinish[finishId][0]). This is
 * the image shown wherever a single representative image is needed — the cart
 * drawer, the checkout order summary, and the confirmation/shipping emails.
 *
 * Falls back to the first image of the default `gallery` if the finish has no
 * dedicated set, and returns undefined if there are no images at all. Any future
 * single-product store using this template gets correct per-variant imagery for
 * free, simply by ordering each finish's gallery with the hero shot first.
 */
export function getVariantHeroImage(product: Product, finishId?: string): ProductImage | undefined {
  const byFinish = finishId ? product.galleryByFinish?.[finishId] : undefined
  if (byFinish && byFinish.length > 0) return byFinish[0]
  // No per-finish gallery set: fall back to the selected finish option's own
  // image (its frame-colour photo) so the cart drawer, checkout summary, and
  // order emails show the frame colour the customer actually chose.
  if (finishId) {
    const finishAxis = product.axes.find(a => a.key === 'finish')
    const opt = finishAxis?.options.find(o => o.id === finishId)
    if (opt?.image) {
      const match = product.gallery.find(img => img.src === opt.image)
      if (match) return match
    }
  }
  if (product.gallery && product.gallery.length > 0) return product.gallery[0]
  return undefined
}

/** Convenience: just the src string (or undefined) for the variant hero image. */
export function getVariantHeroImageSrc(product: Product, finishId?: string): string | undefined {
  return getVariantHeroImage(product, finishId)?.src
}

// ============================================================
// CANONICAL VARIANT LOOKUPS — THE SINGLE SOURCE OF TRUTH
// Every size/finish label, dimension, and the product name shown ANYWHERE in
// the funnel (cart drawer, checkout order summary, confirmation/shipping
// emails, thank-you page) comes from these helpers. They read the live
// ALDER_PRODUCT axes BY KEY — never by array position — so reordering axes can
// never break a label again, and there is exactly ONE place to edit a name,
// size, or dimension. Do not hardcode size/finish labels anywhere else.
// ============================================================
const SIZE_AXIS_KEY = 'size'
const FINISH_AXIS_KEY = 'finish'

/** Find an axis by its key (non-positional). */
export function getAxisByKey(key: string, product: Product = ALDER_PRODUCT): VariantAxis | undefined {
  return product.axes.find(a => a.key === key)
}

/** The size option for a size id ('sm' | 'md' | 'lg'), or undefined. */
export function getSizeOption(sizeId?: string | null): VariantOption | undefined {
  if (!sizeId) return undefined
  return getAxisByKey(SIZE_AXIS_KEY)?.options.find(o => o.id === sizeId)
}

/** The finish option for a finish id ('white' | 'mocha'), or undefined. */
export function getFinishOption(finishId?: string | null): VariantOption | undefined {
  if (!finishId) return undefined
  return getAxisByKey(FINISH_AXIS_KEY)?.options.find(o => o.id === finishId)
}

/** Size label, e.g. 'Standard'. Falls back to the raw id if unknown. */
export function sizeLabel(sizeId?: string | null): string {
  return getSizeOption(sizeId)?.label ?? (sizeId ?? '')
}

/** Size dimensions, e.g. '55 × 28 in'. '' if unknown. */
export function sizeDimensions(sizeId?: string | null): string {
  return getSizeOption(sizeId)?.sub ?? ''
}

/** Finish label, e.g. 'White'. Falls back to the raw id if unknown. */
export function finishLabel(finishId?: string | null): string {
  return getFinishOption(finishId)?.label ?? (finishId ?? '')
}

/** Finish swatch colour (for thumbnail fallbacks), or undefined. */
export function finishSwatch(finishId?: string | null): string | undefined {
  return getFinishOption(finishId)?.swatch
}

/** Canonical one-line variant subtitle, e.g. 'Standard · White'. */
export function variantSubtitle(sizeId?: string | null, finishId?: string | null): string {
  return [sizeLabel(sizeId), finishLabel(finishId)].filter(Boolean).join(' · ')
}

/** The product + brand names — the ONLY place either string is defined. */
export const PRODUCT_NAME = ALDER_PRODUCT.name
export const PRODUCT_BRAND = ALDER_PRODUCT.brand
