/**
 * lib/support-config.ts
 *
 * To adapt Support for a new brand:
 * 1. Most FAQ answers auto-update from policies-config (trial, shipping,
 *    warranty, etc.) — no edits needed here.
 * 2. EDIT the 'product' group questions for the new product's specs.
 * 3. Optionally adjust group labels / add questions.
 * 4. Support email comes from policies-config.supportEmail (single source).
 * 5. Set RESEND_API_KEY + SUPPORT_FROM_EMAIL (verified domain) in env.
 * DO NOT add subscription/recurring/rebilling content anywhere customer-facing.
 */

import { POLICY_CONFIG as P } from '@/lib/policies-config'

export const SUPPORT_CONFIG = {
  eyebrow:  'Support',
  headline: 'How can we help?',
  sub:      `Most answers are below. Still stuck? Email us at ${P.supportEmail} and we reply within 1 business day.`,

  groups: [
    {
      id:    'orders',
      label: 'Orders & Payment',
      faqs: [
        {
          q: 'How do I place an order?',
          a: `Choose your size on the product page, add to cart, and check out. Payment is a secure one-time charge — no accounts or subscriptions to manage.`,
        },
        {
          q: 'What payment methods do you accept?',
          a: `All major credit and debit cards, processed securely at checkout. Every transaction is encrypted end to end.`,
        },
        {
          q: 'Is my payment information safe?',
          a: `Yes. Checkout runs over an encrypted, PCI-compliant connection, and your full card details are never stored on our servers.`,
        },
        {
          q: 'Will I get an order confirmation?',
          a: `Yes — a confirmation email lands in your inbox right after checkout with your order details and a reference number. If you don't see it, check spam, then email ${P.supportEmail}.`,
        },
        {
          q: 'Can I change or cancel my order?',
          a: `If your order hasn't shipped yet, email ${P.supportEmail} with your order number as soon as you can and we'll do our best to update or cancel it.`,
        },
        {
          q: 'Can I change my shipping address after ordering?',
          a: `If it hasn't shipped, yes — send the corrected address to ${P.supportEmail} with your order number and we'll update it before dispatch.`,
        },
        {
          q: 'Do you charge sales tax?',
          a: `Any applicable taxes are calculated and shown at checkout before you confirm, based on your shipping destination.`,
        },
        {
          q: 'Is it a one-time payment?',
          a: `Yes. Your desk is a single one-time purchase — there are no recurring charges, memberships, or hidden fees.`,
        },
      ],
    },
    {
      id:    'shipping',
      label: 'Shipping & Delivery',
      faqs: [
        {
          q: 'Where do you ship?',
          a: `We currently ship to ${P.shippingRegions.join(', ')}. We do not ship internationally at this time.`,
        },
        {
          q: 'How much does shipping cost?',
          a: P.shippingCost + '.',
        },
        {
          q: 'How long until my order arrives?',
          a: `Orders are processed in ${P.processingTime} and typically arrive within ${P.deliveryEstimate} once dispatched.`,
        },
        {
          q: 'How do I track my order?',
          a: `As soon as your order ships, we email you a tracking number. Enter it on our Track Order page anytime to see live carrier updates.`,
        },
        {
          q: 'Do you provide tracking?',
          a: `Yes — every order ships with tracking so you can follow it from our facility to your door.`,
        },
        {
          q: 'Who delivers the desk?',
          a: `Orders are shipped via ${P.carrier}, in two boxes. The bamboo top and frame are packed with protective bracing designed for safe transit.`,
        },
        {
          q: 'What if my package is delayed?',
          a: `Occasionally a carrier runs behind. If your tracking stalls, email ${P.supportEmail} with your order number and we'll chase it down with the carrier right away.`,
        },
        {
          q: 'What if my order arrives damaged?',
          a: `Your desk is well protected in transit, but if anything arrives damaged, email ${P.supportEmail} with photos and your order number and we'll arrange a replacement or full refund immediately — at no cost to you.`,
        },
      ],
    },
    {
      id:    'returns',
      label: 'Returns & Refunds',
      faqs: [
        {
          q: 'What is your return policy?',
          a: `Every order comes with a ${P.trialDays}-day trial. If the desk isn't right for your space, contact us within ${P.returnWindowDays} days of delivery to start a return. See our Refund Policy for full details.`,
        },
        {
          q: 'How do I start a return?',
          a: `Email ${P.supportEmail} with your order number and we'll send return instructions within 1 business day.`,
        },
        {
          q: 'Who pays for return shipping?',
          a: P.whoPaysReturnShipping === 'merchant'
            ? `We do. Return shipping is on us for all eligible returns within the return window — there's no cost to you.`
            : `Return shipping is the customer's responsibility unless the item arrived damaged or defective.`,
        },
        {
          q: 'Is there a restocking fee?',
          a: P.restockingFeePct === 0
            ? `No. We never charge a restocking fee.`
            : `A restocking fee of ${P.restockingFeePct}% applies to returns.`,
        },
        {
          q: 'When will I get my refund?',
          a: `Refunds are issued to your original payment method within ${P.refundProcessingDays} after we receive and inspect the return.`,
        },
        {
          q: 'Are there any non-returnable items?',
          a: `Only ${P.nonReturnable.join(' and ')} are non-returnable. Everything else is covered by the standard return window.`,
        },
        {
          q: 'Can I exchange for a different size?',
          a: `Absolutely. Email ${P.supportEmail} with your order number and the size you'd prefer, and we'll walk you through the easiest way to swap.`,
        },
      ],
    },
    {
      id:    'product',
      label: 'Product & Specs',
      // Free-text per project — update this group for each new brand/product.
      faqs: [
        {
          q: 'Is the top really bamboo?',
          a: `Yes — every top is real natural bamboo sealed with a protective lacquer, not laminate or a printed pattern. The grain varies slightly from desk to desk, so yours is one of a kind.`,
        },
        {
          q: 'What sizes are available?',
          a: `Three: The Standard (55 × 28 in), The Pro (63 × 30 in), and The Executive (72 × 30 in). They share the same feature set — only the footprint and height range change slightly.`,
        },
        {
          q: 'What color does it come in?',
          a: `It comes in one clean colorway: a white frame paired with a natural light-bamboo top.`,
        },
        {
          q: 'How much weight can it hold?',
          a: `The dual-motor lift is rated to 220 lb, so it comfortably supports multiple monitors, a laptop, and the rest of your setup while moving smoothly between sitting and standing.`,
        },
        {
          q: 'What is the height range?',
          a: `The desk adjusts from 22.8" to 49.2" (The Standard ranges 23.6"–48.8"), comfortable for most people whether seated or standing.`,
        },
        {
          q: 'How does the height adjustment work?',
          a: `A front touch console with an LED readout, up/down buttons, and four memory presets raises and lowers the desk electrically. Set your sit and stand heights once, then switch with a single touch.`,
        },
        {
          q: 'Does it have storage?',
          a: `Yes — a flush pull-out drawer in the front for pens, notes, and small items, plus an under-desk cable tray that keeps your power strip and cords off the floor.`,
        },
        {
          q: 'Is assembly required?',
          a: `Some assembly is required, and clear illustrated instructions plus the needed hardware are included. Most people set it up without any special tools.`,
        },
        {
          q: 'What is the desk made of?',
          a: `A natural bamboo top, lacquer-sealed, over a three-stage steel dual-motor frame. The front console has a wireless charging pad plus USB-A and USB-C, and there's a solid wood block under the top for mounting a monitor arm.`,
        },
      ],
    },
    {
      id:    'warranty',
      label: 'Warranty & Care',
      faqs: [
        {
          q: 'What does the warranty cover?',
          a: `Every desk is backed by a ${P.warrantyYears}-year warranty on the frame, motor, and electronics, plus a 5-year warranty on the bamboo top, against defects in materials and workmanship.`,
        },
        {
          q: 'How do I care for the bamboo top?',
          a: `Wipe clean with a soft, damp cloth. Wipe up spills promptly, and avoid soaking the surface or using harsh abrasives, as you would with any quality wood.`,
        },
        {
          q: 'Will the bamboo scratch or stain?',
          a: `The lacquer seal makes the bamboo naturally resistant to scratches and water. As with any wood surface, wiping up spills promptly and avoiding abrasive cleaners keeps it looking its best for years.`,
        },
        {
          q: 'How do I make a warranty claim?',
          a: `Email ${P.supportEmail} with your order number and a short description (photos help) and we'll take care of it promptly.`,
        },
        {
          q: 'Is the natural grain variation covered or a defect?',
          a: `The grain and slight color variation are natural features of real bamboo, not defects — they're part of what makes each top one of a kind. The warranty covers structural and mechanical defects.`,
        },
        {
          q: 'Can I replace a part instead of the whole desk?',
          a: `Where possible, yes. Many components are designed to be serviced individually — contact us and we'll help sort out the right part.`,
        },
      ],
    },
    {
      id:    'about',
      label: 'Pricing & Wylorise',
      faqs: [
        {
          q: 'How is a desk like this so affordable?',
          a: `We sell factory-direct and skip the showroom, distributor, and retail markups that normally sit on top of a desk like this. The materials and engineering are the same — we simply removed the middlemen and passed the savings to you.`,
        },
        {
          q: 'If it\'s this cheap, is the quality lower?',
          a: `No. The savings come from how we sell, not what we sell. It's a real bamboo top, a 220 lb-rated dual-motor lift, built-in wireless charging, and a 15-year frame warranty — the low price reflects an honest, direct supply chain, not cut corners.`,
        },
        {
          q: 'Why is the "compare-at" price so much higher?',
          a: `That reflects what comparable bamboo standing desks with these features typically sell for through traditional showrooms and retailers, where markups stack up at every step. Our price is what the same desk costs when you buy it direct.`,
        },
        {
          q: 'Who is Wylorise?',
          a: `Wylorise is a Wyoming company built on one idea: real materials shouldn't carry showroom markups. We sell one product extremely well — a natural bamboo standing desk — direct to you.`,
        },
        {
          q: 'Where are you based?',
          a: `We're a Wyoming-based company. You can reach our team anytime at ${P.supportEmail}.`,
        },
        {
          q: 'How do I contact a real person?',
          a: `Email ${P.supportEmail} and a member of our team will get back to you within 1 business day. The contact form below reaches the same inbox.`,
        },
      ],
    },
  ],

  contactTopics: [
    'Order question',
    'Shipping & tracking',
    'Returns & refunds',
    'Product question',
    'Warranty',
    'Something else',
  ],
} as const

export type SupportGroup = (typeof SUPPORT_CONFIG.groups)[number]