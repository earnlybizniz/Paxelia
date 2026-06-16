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
// SNAPSTICKER PRODUCT
// NOTE: export const name kept as ALDER_PRODUCT — it is imported by the
// webhook (money path) and several components. Only its CONTENTS change.
// ============================================================
export const ALDER_PRODUCT: Product = {
  slug: 'snapsticker-apex',
  name: 'Snapsticker Apex',
  brand: 'Snapsticker',
  eyebrow: 'One desk that rises, transforms, and powers your whole workspace.',
  basePrice: 139.99,      // Pro (md) = default
  compareAt: 699.99,      // Pro was-price; per-size overrides via compareDelta below
  currency: 'USD',
  // ── Rating + count derive from REVIEW_SUMMARY (lib/reviews-data.ts) ──
  rating: REVIEW_SUMMARY.score,
  reviewCount: REVIEW_SUMMARY.count,
  soldThisMonth: 140,     // PLACEHOLDER
  viewingNow: 22,         // PLACEHOLDER
  badges: ['Dual-Level Workspace', 'Electric Sit-Stand · Dual Motor', '10-Year Warranty'],

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
          id: 'sm', label: 'Compact', sub: '120 × 60 cm · 47 × 24 in',
          tagline: 'Single-monitor setups & tighter rooms',
          priceDelta: -40, compareDelta: -200,                 // 99.99 (was 499.99)
          specs: [
            { label: 'Dimensions (W×D×H)', value: '120 × 60 × 82 cm · 47 × 24 × 32 in' },
            { label: 'Height Range', value: '30–55.9″ (76–142 cm), electric' },
            { label: 'Best For', value: 'Laptop or single monitor' },
          ],
        },
        {
          id: 'md', label: 'Pro', sub: '140 × 68 cm · 55 × 27 in',
          tagline: 'Room for dual monitors — the popular pick',
          priceDelta: 0, compareDelta: 0, default: true,       // 139.99 (was 699.99)
          specs: [
            { label: 'Dimensions (W×D×H)', value: '140 × 68 × 82 cm · 55 × 27 × 32 in' },
            { label: 'Height Range', value: '30–55.9″ (76–142 cm), electric' },
            { label: 'Best For', value: 'Dual-monitor setups' },
          ],
        },
        {
          id: 'lg', label: 'Studio', sub: '160 × 75 cm · 63 × 30 in',
          tagline: 'Widest top — triple-monitor & creative setups',
          priceDelta: 50, compareDelta: 200,                   // 189.99 (was 899.99)
          specs: [
            { label: 'Dimensions (W×D×H)', value: '160 × 75 × 82 cm · 63 × 30 × 32 in' },
            { label: 'Height Range', value: '30–55.9″ (76–142 cm), electric' },
            { label: 'Best For', value: 'Triple-monitor / creative' },
          ],
        },
      ],
    },
    {
      key: 'finish',
      label: 'Finish',
      type: 'swatch',
      options: [
        // The Snapsticker Apex ships in ONE colorway — a warm wood top with a black frame.
        // It is kept as a single-option axis (the internal id 'white' is retained as the key
        // so the cart, checkout, Whop metadata, and order emails stay byte-for-byte unchanged).
        // The VariantSelector hides single-option axes, so NO colour picker is shown — the
        // customer just sees the size selector. The label below is what appears in the cart
        // summary and order emails ("Finish: Oak & Black").
        { id: 'white', label: 'Oak & Black', swatch: '#a9743f', priceDelta: 0, compareDelta: 0, default: true },
      ],
    },
  ],

  // One flat gallery of optimized 1200x1200 WebP product photos (all browsable —
  // no variant-only entries). gallery[0] is the default hero and the cart/email
  // fallback image.
  gallery: [
    { src: '/images/product/gallery/gallery-01.webp', alt: 'Snapsticker Apex dual-level electric standing desk — front view with dual monitors on the upper shelf and accessories on the magnetic pegboard', placeholder: 'linear-gradient(135deg, #efe7da 0%, #a9743f 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-02.webp', alt: 'Snapsticker Apex raised to standing height — three-quarter view showing the upper shelf, main desk, side drawers and laptop tray', placeholder: 'linear-gradient(135deg, #ece4d6 0%, #6f4a26 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-03.webp', alt: 'Snapsticker Apex with the upper monitor shelf raised high above the main work surface', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #8a5a2b 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-04.webp', alt: 'Snapsticker Apex shown bare — the dual-level frame, black magnetic pegboard, side drawers and pull-out tray', placeholder: 'linear-gradient(135deg, #e5e2dc 0%, #1a1a1a 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-05.webp', alt: 'Snapsticker Apex rear three-quarter view with the RGB ambient light glowing behind the upper deck', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #2a2a2a 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-06.webp', alt: 'Top-down view of the Snapsticker Apex wood worktop with the smart touch panel and built-in outlets at the edge', placeholder: 'linear-gradient(135deg, #f0e7d6 0%, #a9743f 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-07.webp', alt: 'Snapsticker Apex feature map — dual AC outlets, wireless charging pad, modular pegboard, smart touch panel, hook rack, silent drawer and PC case stand labelled', placeholder: 'linear-gradient(135deg, #f6f5f3 0%, #d8c19a 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-08.webp', alt: 'Snapsticker Apex annotated overview with monitors — pegboard, monitor stand, ambient light strip, snack and cup holder, outlets and storage labelled', placeholder: 'linear-gradient(135deg, #f6f5f3 0%, #cdb083 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-09.webp', alt: 'Snapsticker Apex in a sunlit home office, raised to standing height while in use', placeholder: 'linear-gradient(135deg, #efe7da 0%, #6f4a26 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/gallery-10.webp', alt: 'Snapsticker Apex in a home workspace with dual monitors and a pegboard of accessories, used at standing height', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #8a5a2b 100%)', ratio: '1/1' },
  ],

  highlights: [
    'Dual-level workspace — a main desk plus an integrated monitor shelf and workbench, so a clamp, a screen, and your tools all have a home (up to ~50% space saved)',
    'Electric dual-motor sit-stand lift with a 30–55.9″ (76–142 cm) range — move between sitting, standing, and presentation modes at the push of a button',
    'Magnetic pegboard, modular drawer, and side accessories let you reconfigure storage around how you actually work',
    'Built-in power — a desktop outlet plus an external power strip — so charging happens on the desk, not in a tangle underneath it',
    'High-brightness task light and RGB ambient light, a heavy-duty steel-and-aluminum frame rated to 50 kg (110 lb), and lockable 60 mm casters to roll it anywhere',
  ],

  description: [
    "Most desks make you choose: a standing desk, or a desk with storage, or a desk with a monitor riser. The Snapsticker Apex is all three at once. A dual-level design stacks a main work surface and an integrated upper shelf, so your monitor, your tools, and your work each get their own level — reclaiming up to half the footprint a separate riser and storage cart would eat.",
    "Underneath, an electric dual-motor lift raises and lowers the whole desk smoothly across a 30–55.9″ range, so you can sit, stand, or pop up to a quick presentation height with one button. The steel-and-aluminum frame holds steady up to 50 kg (110 lb), and lockable 60 mm casters mean you can roll the entire setup to a new spot and lock it back down.",
    "Then there's everything built in: a magnetic pegboard and a modular drawer to organize your way, a desktop power outlet plus an external power strip so cables stay off the floor, and both a high-brightness task light and an RGB ambient light for late sessions. It's a complete, transformable workspace — sold factory-direct, at an honest price.",
  ],

  materials: [
    { icon: '/images/product/icons/icon-dual-motor.png', title: 'Dual-Motor Lift', detail: 'Two motors raise and lower the whole desk smoothly and quietly across a 30–55.9″ range.' },
    { icon: '/images/product/icons/icon-wireless-charging.png', title: 'Built-In Power', detail: 'A desktop outlet plus an external power strip keep charging on the desk, not under it.' },
    { icon: '/images/product/icons/icon-cable-tray.png', title: 'Magnetic Pegboard', detail: 'A magnetic pegboard panel holds accessories and tools right where you reach for them.' },
    { icon: '/images/product/icons/icon-drawer.png', title: 'Modular Drawer', detail: 'An adjustable drawer and side accessories let you organize storage your way.' },
    { icon: '/images/product/icons/icon-usb.png', title: 'USB & Outlet', detail: 'Power and data on the desktop — charge a phone and plug in peripherals without an outlet hunt.' },
    { icon: '/images/product/icons/icon-height-range.png', title: 'Height Range', detail: '30–55.9″ (76–142 cm) of electric sit-to-stand travel at the push of a button.' },
    { icon: '/images/product/icons/icon-desktop.png', title: 'Wood Worktop', detail: 'A warm woodgrain top on a black frame — a clean, single colorway built to look right anywhere.' },
    { icon: '/images/product/icons/icon-load-capacity.png', title: 'Load Capacity', detail: 'A steel-and-aluminum frame rated to a full 50 kg (110 lb) of monitors and gear.' },
  ],

  durability: [
    { stat: '50 kg', label: 'Rated load (110 lb)' },
    { stat: '30–55.9″', label: 'Electric height range' },
    { stat: 'Dual motor', label: 'Smooth, quiet lift' },
    { stat: '10 years', label: 'Warranty — frame, motors & electronics' },
  ],

  lifestyle: [
    { src: '/images/product/gallery/07.png', alt: 'The Snapsticker Apex in a bright home office, raised to standing height', placeholder: 'linear-gradient(135deg, #f0e7d6 0%, #a9743f 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/08.png', alt: 'The Snapsticker Apex with the pegboard and task light in a creative studio', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #2a2a2a 100%)', ratio: '1/1' },
    { src: '/images/product/gallery/02.png', alt: 'The Snapsticker Apex styled head-on with a monitor on the upper shelf', placeholder: 'linear-gradient(135deg, #efe7da 0%, #6f4a26 100%)', ratio: '1/1' },
  ],

  trust: [
    { icon: 'RotateCcw', title: '30-Day Returns', sub: 'Risk-free in your space' },
    { icon: 'Truck', title: 'Free Shipping', sub: 'On all US orders' },
    { icon: 'Shield', title: '10-Year Warranty', sub: 'Frame, motors & electronics' },
    { icon: 'Lock', title: 'Secure Checkout', sub: 'Encrypted payment' },
  ],

  specs: [
    { label: 'Workspace', value: 'Dual-level — main desk + integrated monitor shelf / workbench' },
    { label: 'Worktop', value: 'Warm woodgrain surface' },
    { label: 'Frame', value: 'Heavy-duty steel & aluminum' },
    { label: 'Finish', value: 'Oak & Black (wood top, black frame)' },
    { label: 'Height Range', value: '30–55.9″ (76–142 cm), electric' },
    { label: 'Lift', value: 'Dual motor, push-button height control' },
    { label: 'Load Capacity', value: '50 kg (110 lb)' },
    { label: 'Storage', value: 'Magnetic pegboard + modular drawer + side accessories' },
    { label: 'Power', value: 'Desktop outlet + external power strip' },
    { label: 'Lighting', value: 'High-brightness task light + RGB ambient light' },
    { label: 'Mobility', value: 'Lockable 60 mm casters' },
    { label: 'Assembly', value: 'Required — instructions, hardware & tools included' },
    { label: 'Warranty', value: '10-year frame, motors & electronics' },
    { label: 'Care', value: 'Wipe clean with a soft, damp cloth' },
  ],

  inBox: [
    'Dual-level desktop (main work surface + integrated upper shelf)',
    'Heavy-duty steel & aluminum frame with dual lift motors',
    'Magnetic pegboard panel',
    'Modular storage drawer',
    'Built-in desktop power outlet + external power strip',
    'High-brightness task light + RGB ambient light strip',
    'Four lockable 60 mm casters',
    'Push-button height control handset',
    'Power adapter and cabling',
    'Assembly hardware, tools, and illustrated instructions',
  ],

  features: [
    {
      num: '01',
      kicker: 'DUAL-LEVEL · ELECTRIC SIT-STAND',
      title: 'A desk that works on two levels',
      body: 'A main work surface and an integrated upper shelf stack into one footprint — your monitor sits up top, your keyboard and tools below. An electric dual-motor lift raises the whole thing from 30 to 55.9 inches at the push of a button, so sitting, standing, and presentation modes are one tap away.',
      image: { src: '/images/product/features/surface.png', alt: 'The Snapsticker Apex dual-level desktop raised to standing height', placeholder: 'linear-gradient(135deg, #efe7da 0%, #a9743f 100%)', ratio: '3/4' },
    },
    {
      num: '02',
      kicker: 'BUILT-IN POWER · TASK + RGB LIGHT',
      title: 'Power and light, already on the desk',
      body: 'A desktop outlet and an external power strip keep everything charged without a tangle underneath, while a high-brightness task light handles focused work and an RGB ambient light sets the mood for gaming or late sessions. Power and lighting live in the desk, not in a mess around it.',
      image: { src: '/images/product/features/charging.png', alt: 'The built-in desktop power outlet and lighting on the Snapsticker Apex', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #2a2a2a 100%)', ratio: '3/4' },
    },
    {
      num: '03',
      kicker: 'MAGNETIC PEGBOARD · MODULAR STORAGE',
      title: 'Storage that adapts to you',
      body: 'A magnetic pegboard panel and a modular drawer let you arrange accessories, tools, and small things exactly how you work — then rearrange them when your setup changes. Side accessories clip on where you need them, so the desk grows with you instead of boxing you in.',
      image: { src: '/images/product/features/storage.png', alt: 'The magnetic pegboard and modular drawer on the Snapsticker Apex', placeholder: 'linear-gradient(135deg, #e8dcc2 0%, #6f4a26 100%)', ratio: '3/4' },
    },
    {
      num: '04',
      kicker: 'STEEL + ALUMINUM · 50 KG · CASTERS',
      title: 'Sturdy, quiet, and ready to roll',
      body: 'A heavy-duty steel-and-aluminum frame holds rock-steady up to a full 50 kg (110 lb) of monitors and gear, with an ultra-quiet dual-motor lift. Lockable 60 mm casters let you roll the entire workspace to a new spot and lock it firmly back in place.',
      image: { src: '/images/product/features/cable.png', alt: 'The steel-and-aluminum frame and lockable casters of the Snapsticker Apex', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #1a1a1a 100%)', ratio: '3/4' },
    },
  ],

  dimensions: {
    width: '120 / 140 / 160 cm (47 / 55 / 63 in)',
    depth: '60 / 68 / 75 cm (24 / 27 / 30 in)',
    heightRange: '30–55.9″ (76–142 cm), electric',
    capacity: '50 kg (110 lb)',
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
        body: "The dual-level top is the whole reason I bought it — monitor up top, keyboard below, and my tiny room finally feels organized. Going from sitting to standing is one button. Can't believe the price.",
        author: 'Marcus T.',
        config: 'Pro',
        verified: true,
        photo: { src: '', alt: 'Customer workspace with the Snapsticker Apex', placeholder: 'linear-gradient(135deg, #efe7da 0%, #6f4a26 100%)', ratio: '16/9' },
      },
      {
        stars: 5,
        body: 'Lift is smooth and genuinely quiet, and the magnetic pegboard is addictive — I keep rearranging it. The built-in power strip cleaned up the cable mess under my old desk completely.',
        author: 'Priya S.',
        config: 'Compact',
        verified: true,
      },
      {
        stars: 5,
        body: 'Rolled it into the corner of my studio on the casters, locked it, and it does not budge with two monitors on it. The task light plus the RGB strip is perfect for evening work. Easily my best desk.',
        author: 'James K.',
        config: 'Studio',
        verified: true,
        photo: { src: '', alt: 'The Snapsticker Apex in a home studio', placeholder: 'linear-gradient(135deg, #e6d9bd 0%, #1a1a1a 100%)', ratio: '16/9' },
      },
    ],
  },

  faq: [
    { q: 'What makes it "dual-level"?', a: 'The Apex has two work surfaces in one footprint — a main desktop plus an integrated upper shelf for your monitor and accessories. It replaces a separate monitor riser and storage cart, saving you up to about half the space.' },
    { q: 'How does the height adjustment work?', a: 'An electric dual-motor lift raises and lowers the whole desk across a 30–55.9″ (76–142 cm) range at the push of a button, so you can switch between sitting, standing, and a quick presentation height in seconds.' },
    { q: 'How much weight can it hold?', a: 'The heavy-duty steel-and-aluminum frame is rated to 50 kg (110 lb), so it comfortably supports multiple monitors, your computer, and the rest of your setup while it moves.' },
    { q: 'Can I move it around?', a: 'Yes. It rides on four lockable 60 mm casters, so you can roll the entire workspace to a new spot and lock it firmly in place when you get there.' },
    { q: 'What is built into the desk?', a: 'A magnetic pegboard and a modular drawer for storage, a desktop power outlet plus an external power strip, and both a high-brightness task light and an RGB ambient light.' },
    { q: 'Does it require assembly?', a: 'Some assembly is required. It ships with all the hardware, tools, and illustrated instructions, and most people set it up without any special tools.' },
    { q: "What's the warranty?", a: 'The Apex is backed by a 10-year warranty covering the frame, the lift motors, and the electronics against defects in materials and workmanship.' },
  ],

  shipEta: 'Ships in 2 business days',
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

/** The finish option for a finish id ('white'), or undefined. */
export function getFinishOption(finishId?: string | null): VariantOption | undefined {
  if (!finishId) return undefined
  return getAxisByKey(FINISH_AXIS_KEY)?.options.find(o => o.id === finishId)
}

/** Size label, e.g. 'Pro'. Falls back to the raw id if unknown. */
export function sizeLabel(sizeId?: string | null): string {
  return getSizeOption(sizeId)?.label ?? (sizeId ?? '')
}

/** Size dimensions, e.g. '140 × 68 cm · 55 × 27 in'. '' if unknown. */
export function sizeDimensions(sizeId?: string | null): string {
  return getSizeOption(sizeId)?.sub ?? ''
}

/** Finish label, e.g. 'Oak & Black'. Falls back to the raw id if unknown. */
export function finishLabel(finishId?: string | null): string {
  return getFinishOption(finishId)?.label ?? (finishId ?? '')
}

/** Finish swatch colour (for thumbnail fallbacks), or undefined. */
export function finishSwatch(finishId?: string | null): string | undefined {
  return getFinishOption(finishId)?.swatch
}

/** Canonical one-line variant subtitle, e.g. 'Pro · Oak & Black'. */
export function variantSubtitle(sizeId?: string | null, finishId?: string | null): string {
  return [sizeLabel(sizeId), finishLabel(finishId)].filter(Boolean).join(' · ')
}

/** The product + brand names — the ONLY place either string is defined. */
export const PRODUCT_NAME = ALDER_PRODUCT.name
export const PRODUCT_BRAND = ALDER_PRODUCT.brand
