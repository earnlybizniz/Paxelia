/**
 * PRODUCT CONFIGURATION - SINGLE SOURCE OF TRUTH
 * 
 * This file defines all product data, variants, and pricing.
 * Update this file to change the product across the entire store.
 */

// ============================================================
// BRAND PLACEHOLDERS - Replace these for each new project
// ============================================================
export const brand = {
  name: 'Wylorise',
  tagline: "Everything you need in a standing desk. Nothing you don't.",
  productName: 'The Sovereign Q8',
  email: 'support@wylorise.store',
  phone: '',
  address: '11 S Kansas Ave, Guernsey, WY 82214, US',
  social: {
    instagram: '#',
    twitter: '#',
    facebook: '#',
    pinterest: '#',
  },
}

// ============================================================
// SIZE OPTIONS
// ============================================================
export const sizes = [
  { id: 'sm', label: 'The Standard',  sublabel: '55 × 28 in', widthRange: '55" × 28"', stock: 'in_stock' as const },
  { id: 'md', label: 'The Pro',       sublabel: '63 × 30 in', widthRange: '63" × 30"', stock: 'in_stock' as const },
  { id: 'lg', label: 'The Executive', sublabel: '72 × 30 in', widthRange: '72" × 30"', stock: 'low_stock' as const, lowStockCount: 4 },
] as const

// ============================================================
// FINISH OPTIONS (Wood types / colors)
// ============================================================
export const finishes = [
  { id: 'white', label: 'White Frame', hex: '#F2EFE9', image: '/images/product/gallery/01.png' },
  { id: 'mocha', label: 'Black Frame', hex: '#1C1C1C', image: '/images/product/gallery/01.png' },
] as const

// ============================================================
// FRAME OPTIONS
// ============================================================
export const frames = [
  { id: 'black', label: 'Matte Black', hex: '#1A1A1A' },
  { id: 'white', label: 'Cloud White', hex: '#F5F5F5' },
] as const

// ============================================================
// PRICE MATRIX
// Grid of [size][finish] -> { base, msrp }
// ============================================================
export const priceMatrix: Record<string, Record<string, { base: number; msrp: number }>> = {
  sm: {
    white: { base: 99.99, msrp: 499.99 },
    mocha: { base: 99.99, msrp: 499.99 },
  },
  md: {
    white: { base: 139.99, msrp: 699.99 },
    mocha: { base: 139.99, msrp: 699.99 },
  },
  lg: {
    white: { base: 189.99, msrp: 899.99 },
    mocha: { base: 189.99, msrp: 899.99 },
  },
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export function getPrice(sizeId: string, finishId: string) {
  return priceMatrix[sizeId]?.[finishId] ?? { base: 0, msrp: 0 }
}

export function getDiscountPercent(base: number, msrp: number) {
  if (msrp <= 0) return 0
  return Math.round(((msrp - base) / msrp) * 100)
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents)
}

// ============================================================
// SHIPPING
// ============================================================
export const shipping = {
  freeThreshold: 0, // Free shipping on all orders
  standardDays: { min: 5, max: 7 },
  expeditedDays: { min: 2, max: 3 },
  expeditedCost: 149,
}

// ============================================================
// PRODUCT FEATURES
// ============================================================
export const features = [
  {
    id: 'surface',
    title: 'Natural Bamboo Surface',
    subtitle: 'About twice as hard as wood',
    description: 'A real bamboo top sealed with a protective lacquer — naturally water- and scratch-resistant, warm to the touch, and renewable.',
    image: '/images/product/features/surface.png',
  },
  {
    id: 'lift',
    title: 'Dual-Motor 3-Stage Lift',
    subtitle: 'Smooth, quiet, rated to 220 lb',
    description: 'Two motors and three-stage oval legs raise and lower steadily under a full load, from 22.8 to 49.2 inches.',
    image: '/images/product/features/lift.png',
  },
  {
    id: 'charging',
    title: 'Wireless Charging + USB',
    subtitle: 'Built into the touch console',
    description: 'A 10W Qi pad plus USB-A and USB-C ports sit on the front console, so devices charge without reaching for an outlet.',
    image: '/images/product/features/charging.png',
  },
  {
    id: 'memory',
    title: 'Smart Memory Presets',
    subtitle: '4 programmable heights',
    description: 'Save your perfect sitting and standing positions for one-touch recall, with anti-collision detection standard.',
    image: '/images/product/features/memory.png',
  },
]

// ============================================================
// SPECIFICATIONS
// ============================================================
export const specifications = {
  heightRange: '22.8" – 49.2"',
  liftSpeed: '1.5" per second',
  liftCapacity: '220 lbs',
  motorNoise: '< 50dB',
  warranty: '15-year frame & motor · 5-year bamboo top',
  certifications: ['IDA Design Award', 'SIT Furniture Design Award'],
}

// ============================================================
// TYPES
// ============================================================
export type SizeId = typeof sizes[number]['id']
export type FinishId = typeof finishes[number]['id']
export type FrameId = typeof frames[number]['id']

export interface ProductSelection {
  sizeId: SizeId
  finishId: FinishId
  frameId: FrameId
  quantity: number
}

export interface CartItem extends ProductSelection {
  id: string
  price: number
  msrp: number
}
