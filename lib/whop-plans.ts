/**
 * lib/whop-plans.ts
 * Maps product variant IDs to Whop plan IDs.
 * Keys MUST match the sizeId values in lib/product.ts: 'sm' | 'md' | 'lg'
 * To adapt for a new brand: update env vars only — no code changes needed.
 *
 * Env vars required:
 *   NEXT_PUBLIC_WHOP_PLAN_SM   plan_xxx  (Compact 48" — $99.99)
 *   NEXT_PUBLIC_WHOP_PLAN_MD   plan_xxx  (Executive 60" — $139.99)
 *   NEXT_PUBLIC_WHOP_PLAN_LG   plan_xxx  (Director 72" — $189.99)
 *
 * DEMO MODE: When env vars are missing, returns mock plan IDs so the checkout
 * UI can be previewed without real Whop plans configured.
 */

export const WHOP_PLANS: Record<string, string> = {
  sm: process.env.NEXT_PUBLIC_WHOP_PLAN_SM ?? 'plan_demo_sm',
  md: process.env.NEXT_PUBLIC_WHOP_PLAN_MD ?? 'plan_demo_md',
  lg: process.env.NEXT_PUBLIC_WHOP_PLAN_LG ?? 'plan_demo_lg',
}

export function planForVariant(variantId: string): string {
  return WHOP_PLANS[variantId] ?? ''
}

/**
 * Server-side price lookup — canonical prices, never trust the client.
 * Add / modify entries here when product pricing changes.
 *
 * IMPORTANT: These prices MUST exactly match the prices configured on the
 * corresponding Whop plans (NEXT_PUBLIC_WHOP_PLAN_SM/MD/LG). Whop charges
 * its plan's configured price; Supabase order rows and Meta CAPI Purchase
 * events record the value from VARIANT_PRICES. A mismatch causes reported
 * revenue to differ from actual charged revenue.
 */
export const VARIANT_PRICES: Record<string, number> = {
  sm: 99.99,   // Compact   — must match Whop plan NEXT_PUBLIC_WHOP_PLAN_SM
  md: 139.99,  // Executive — must match Whop plan NEXT_PUBLIC_WHOP_PLAN_MD
  lg: 189.99,  // Director  — must match Whop plan NEXT_PUBLIC_WHOP_PLAN_LG
}

export function priceForVariant(variantId: string): number {
  return VARIANT_PRICES[variantId] ?? 0
}