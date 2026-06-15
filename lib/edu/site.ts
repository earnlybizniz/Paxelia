/**
 * lib/edu/site.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the EDU tenant (Omnirise — the Meta ads
 * membership). Brand, navigation, pricing plans, and footer config live here.
 *
 * This file is intentionally independent from the retail tenant. Nothing here
 * imports from or references retail/store code.
 */

export const eduBrand = {
  name: 'Omnirise',
  wordmark: 'Omnirise',
  tagline: 'Run Meta ads with intention.',
  supportEmail: 'support@omnirise.store',
  // Honest, required disclaimer — shown in the footer and final CTA.
  disclaimer:
    'Omnirise is educational only and provides no income or results guarantees. Omnirise is independent and is not affiliated with, endorsed by, or sponsored by Meta, Facebook, or Instagram.',
} as const

/** Primary navigation — clean paths (middleware handles tenant rewriting). */
export const eduNav: { label: string; href: string }[] = [
  { label: 'Field guide', href: '/field-guide' },
  { label: 'Community', href: '/community' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

export type EduPlan = {
  id: '30' | '60' | '90'
  days: number
  name: string
  price: string
  perDay: string
  note?: string
  badge?: string
  href: string
  highlight?: boolean
}

/**
 * The 30/60/90 plans. All three include the exact same full membership; the
 * only difference is billing length. Auto-renews. No free trial.
 */
export const eduPlans: EduPlan[] = [
  {
    id: '30',
    days: 30,
    name: '30 Days',
    price: '$99.99',
    perDay: '~$3.33/day',
    href: '/checkout?plan=30',
  },
  {
    id: '60',
    days: 60,
    name: '60 Days',
    price: '$139.99',
    perDay: '~$2.33/day',
    note: '~30% less per day',
    href: '/checkout?plan=60',
  },
  {
    id: '90',
    days: 90,
    name: '90 Days',
    price: '$189.99',
    perDay: '~$2.11/day',
    badge: 'Best value',
    href: '/checkout?plan=90',
    highlight: true,
  },
]

/** Everything included in the one membership (shown once near pricing). */
export const eduIncluded: string[] = [
  'Full field guide',
  'Entire community',
  'Daily breakdowns & alerts',
  'Weekly live call + replays',
  'Skill badge',
]

/** Footer link clusters. */
export const eduFooter = {
  membership: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Field guide', href: '/field-guide' },
    { label: 'Community', href: '/community' },
    { label: 'Manage membership', href: '/manage-membership' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  policies: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Refund policy', href: '/refund' },
  ],
} as const
