/**
 * lib/policies-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all four policy pages (Refund · Shipping ·
 * Privacy · Terms).  When adapting this template for a new brand, edit ONLY
 * this file — every page will reflect the updated values automatically.
 *
 * NOTE: These are professional template policies, not lawyer-reviewed legal
 * documents.  Before launch, have the Privacy Policy and Terms of Service
 * reviewed by qualified counsel for the jurisdictions you sell in.
 *
 * ── REUSE QUESTIONNAIRE ──────────────────────────────────────────────────────
 * When adapting for a new store, answer these questions and paste the answers
 * into the fields below:
 *
 *  1.  Brand name + legal entity name?
 *  2.  Site URL, support email, business mailing address?
 *  3.  Who is your payment processor / merchant of record?
 *      (e.g. Whop, Shopify Payments, Stripe)
 *  4.  Trial period length?  Return window length?  Refund processing time?
 *  5.  Who pays return shipping — you or the customer?  Any restocking fee %?
 *  6.  Any non-returnable items?
 *  7.  Where do you ship?  Processing time?  Delivery estimate?  Shipping cost?
 *      Which carriers?  Do you provide tracking?  Ship internationally?
 *  8.  What customer data do you collect?  What analytics / tracking tools?
 *      Do you use cookies?
 *  9.  Do you have California (CCPA) customers?  EU (GDPR) customers?
 * 10.  Governing law jurisdiction (state / country)?  Warranty length?
 *      Product type?
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const POLICY_CONFIG = {
  // ── Brand / contact ─────────────────────────────────────────────────────────
  brandName:          'Snapsticker',
  legalEntity:        'Snapsticker LLC',
  siteUrl:            'https://snapsticker.store',
  supportEmail:       'contact@snapsticker.store',
  contactAddress:     '30 N Gould St, Suite #318, Sheridan, WY 82801, US',
  governingLawRegion: 'State of Wyoming, USA',
  lastUpdated:        '2026-06-16',             // ISO date — shown on each page

  // ── Merchant of Record ───────────────────────────────────────────────────────
  merchantOfRecord:   'Whop',
  paymentProcessors:  ['Whop'],

  // ── Refund / returns ─────────────────────────────────────────────────────────
  trialDays:              30,
  returnWindowDays:       30,
  refundProcessingDays:   '5–15 business days',
  whoPaysReturnShipping:  'merchant' as 'merchant' | 'customer',
  restockingFeePct:       0,                    // 0 = no restocking fee
  nonReturnable:          ['final-sale items'],

  // ── Shipping ─────────────────────────────────────────────────────────────────
  shippingRegions:       ['the 48 contiguous United States'],
  processingTime:        '2 business days',
  deliveryEstimate:      '10–14 business days',
  shippingCost:          'Free standard shipping on all orders within the 48 contiguous US states',
  carrier:               'FedEx',
  tracking:              true,
  internationalShipping: false,

  // ── Privacy ──────────────────────────────────────────────────────────────────
  dataCollected:         ['name', 'email address', 'shipping address', 'order details'],
  analyticsTools:        ['Meta Pixel / Conversions API'],
  cookiesUsed:           true,
  dataRetentionPeriod:   'as long as needed to fulfill orders and meet applicable legal obligations',
  ccpaApplies:           true,
  gdprApplies:           false,

  // ── Company / product ────────────────────────────────────────────────────────
  productType:    'dual-level standing desks',
  warrantyYears:  10,
} as const

export type PolicyConfig = typeof POLICY_CONFIG
