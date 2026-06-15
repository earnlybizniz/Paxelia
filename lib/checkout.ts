/**
 * lib/checkout.ts
 * Server-side checkout helpers: input validation + canonical total computation.
 * Totals are always recomputed here — never trust client-sent prices.
 */
import { priceForVariant } from '@/lib/whop-plans'

export interface ContactFields {
  email: string
}

export interface AddressFields {
  firstName: string
  lastName:  string
  line1:     string
  line2?:    string
  city:      string
  state:     string
  postalCode: string
  country:   string
}

export interface CheckoutInput {
  variantId:    string
  email:        string
  address:      AddressFields
  billingSame:  boolean
}

export interface CheckoutTotals {
  variantId: string
  subtotal:  number
  shipping:  number
  total:     number
  currency:  string
}

/** Returns an error string or null if valid. */
export function validateCheckoutInput(input: Partial<CheckoutInput>): string | null {
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return 'Valid email required'
  }
  if (!input.variantId || !priceForVariant(input.variantId)) {
    return 'Invalid product variant'
  }
  const addr = input.address
  if (!addr) return 'Shipping address required'
  if (!addr.lastName?.trim())   return 'Last name required'
  if (!addr.line1?.trim())      return 'Address line 1 required'
  if (!addr.city?.trim())       return 'City required'
  if (!addr.state?.trim())      return 'State required'
  if (!addr.postalCode?.trim()) return 'ZIP code required'
  return null
}

/** Canonical total — called server-side only. */
export function computeTotals(variantId: string): CheckoutTotals {
  const subtotal = priceForVariant(variantId)
  const shipping = 0 // free shipping always
  return {
    variantId,
    subtotal,
    shipping,
    total:    subtotal + shipping,
    currency: 'usd',
  }
}
