# Store Variables — ALDER Store Template

These are the **shared, brand-level settings** that appear across the whole store (not page-specific copy). This doc tells you **what** each setting is and **which file** to edit. Everything below lives in plain config files under `lib/` — you edit the values, and every page updates automatically. No layout or code changes needed.

> Rule of thumb: **content lives in `lib/*-config.ts` and `lib/*-content.ts` files.** You change values there; the pages read from them.

---

## The config files at a glance

| File | Controls |
|---|---|
| `lib/home-content.ts` | Brand identity (name, colors, fonts), the entire homepage, and the site footer |
| `lib/policies-config.ts` | Brand legal/contact details + all policy values (shipping times, returns, warranty) — also feeds the FAQ |
| `lib/pdp-product.ts` | The product page: name, price, variants, gallery, features, specs, reviews, product FAQ |
| `lib/whop-plans.ts` | The price per size + the Whop plan id per size (the money mapping) |
| `lib/support-config.ts` | The Support page: FAQ groups/answers + contact form topics |
| `lib/about-config.ts` | The About / Our Story page |

---

## 1. Brand identity → `lib/home-content.ts` (the `brand` block)

This is the single most shared block — name, colors, and fonts used site-wide.

```ts
brand: {
  name: 'ALDER',              // shown in header, footer, emails, titles
  logoWordmark: 'ALDER',      // text logo
  palette: {
    paper:      '#f4f1ea',    // background
    paper2:     '#ebe6db',    // secondary background
    paper3:     '#e2dcd1',
    ink:        '#1c1a17',    // main text
    inkSoft:    '#3a352e',
    inkMute:    '#7a7168',
    accent:     '#6b4a2f',    // buttons, links, highlights (your brand color)
    accentDeep: '#4a3220',
    highlight:  '#c9a24b',
  },
  fonts: { display: 'Fraunces', sans: 'Outfit' },  // heading font + body font
}
```

- **Brand name** appears in the header, footer, page titles, the thank-you page, and emails.
- **Palette** drives the entire color scheme via CSS variables — change `accent` to re-color buttons/links across every page at once.
- **Fonts**: `display` is for headings, `sans` for body text.

---

## 2. Brand contact & legal details → `lib/policies-config.ts`

These feed the policy pages, the support page, and emails. This is your "who the business is" block.

```ts
brandName:          'ALDER',
legalEntity:        'ALDER Furniture Co.',          // legal company name (policies)
siteUrl:            'https://alder.com',
supportEmail:       'support@alder.com',            // shown site-wide + receives the contact form
contactAddress:     '123 Example St, Portland, OR 97201, USA',
governingLawRegion: 'State of Oregon, USA',          // for Terms
merchantOfRecord:   'Whop',                          // who processes payment
```

> **`supportEmail` is the single source** for the support address — it shows on the support page, the track-order "contact support" link, the thank-you page, and is the recipient of the contact form. Change it once here.

---

## 3. Shipping, returns & warranty → `lib/policies-config.ts`

These power the policy pages **and** the FAQ answers automatically (so they stay consistent).

```ts
trialDays:              30,                  // "30-night trial"
returnWindowDays:       30,                  // window to request a return
refundProcessingDays:   '5–10 business days',
whoPaysReturnShipping:  'merchant',          // 'merchant' or 'customer'
restockingFeePct:       0,                   // 0 = none
nonReturnable:          ['gift cards', 'final-sale items'],

shippingRegions:       ['United States'],    // where you ship
processingTime:        '1–2 business days',
deliveryEstimate:      '3–7 business days',
shippingCost:          'Free standard shipping on all orders',
carrier:               'major carriers (UPS, FedEx)',
tracking:              true,
internationalShipping: false,

warrantyYears:  5,
productType:    'standing desks',
```

Plus privacy-related toggles (used on the Privacy page):
```ts
dataCollected:        ['name', 'email address', 'shipping address', 'order details'],
analyticsTools:       ['Meta Pixel / Conversions API'],
cookiesUsed:          true,
ccpaApplies:          true,    // shows the California (CCPA) section if true
gdprApplies:          false,   // shows the EU (GDPR) section if true
lastUpdated:          '2026-01-01',  // "Last updated" date on each policy page
```

---

## 4. Price & the Whop money mapping → `lib/whop-plans.ts`

The most important consistency point in the whole store.

```ts
// The plan id charged for each size (from your env vars)
WHOP_PLANS = {
  sm: NEXT_PUBLIC_WHOP_PLAN_SM,
  md: NEXT_PUBLIC_WHOP_PLAN_MD,
  lg: NEXT_PUBLIC_WHOP_PLAN_LG,
}

// The price recorded for each size — MUST match the price set on the Whop plan above
VARIANT_PRICES = {
  sm: 799,
  md: 899,
  lg: 1049,
}
```

⚠️ **These two must agree with each other AND with the product page price.** The product page price comes from `lib/pdp-product.ts` (`basePrice` + each size's `priceDelta`). Whop charges the plan's configured price. `VARIANT_PRICES` is what gets recorded in your database and sent to Meta. If any of the three disagree, customers see one price and get charged another. Keep them in sync:
- Product page (`pdp-product.ts`): `basePrice 899` + size deltas `sm −100 / md 0 / lg +150` → 799 / 899 / 1049
- `VARIANT_PRICES`: 799 / 899 / 1049
- Whop plan prices (set in the Whop dashboard): 799 / 899 / 1049

---

## 5. Logo & favicon → `public/` folder

These are image files, not config:
- `public/favicon.png` — the little browser-tab icon
- `public/logo.png` — your logo
- `public/logo-inverse.png` — a light version for dark backgrounds

Replace these files with your own (keep the same filenames) to rebrand the logo/favicon.

---

## 6. Footer links → `lib/home-content.ts` (the `footer` block)

The footer's columns and links live here:
```ts
footer: {
  blurb: '...',
  columns: [ { title, links: [{ label, href }] } ],
  payments: ['Visa','Mastercard','Amex','Apple Pay','Google Pay'],  // payment-method badges (display only)
  ...
}
```

---

## Summary: "I want to change X" → edit this file

| I want to change… | Edit |
|---|---|
| Brand name / colors / fonts | `lib/home-content.ts` → `brand` |
| Support email (everywhere) | `lib/policies-config.ts` → `supportEmail` |
| Shipping times / return window / warranty | `lib/policies-config.ts` |
| Price | `lib/pdp-product.ts` (`basePrice` + size deltas) **and** `lib/whop-plans.ts` (`VARIANT_PRICES`) **and** the Whop plan prices |
| Product details / variants / gallery | `lib/pdp-product.ts` |
| Homepage content | `lib/home-content.ts` |
| About page | `lib/about-config.ts` |
| Support FAQ / contact topics | `lib/support-config.ts` |
| Logo / favicon | `public/logo.png`, `public/favicon.png` |
| Footer links | `lib/home-content.ts` → `footer` |

For a full fresh-project walkthrough, see `NEW_PROJECT_SETUP.md`. For the complete variable questionnaire, see `PROJECT_INTAKE.md`.
