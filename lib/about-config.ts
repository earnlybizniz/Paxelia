/**
 * lib/about-config.ts
 * Single source of truth for all About page copy and image slots.
 * A new brand = fill in the answers below — no component edits needed.
 *
 * ─── REUSE QUESTIONNAIRE ────────────────────────────────────────────────────
 * To adapt the About page to a new brand, answer:
 * 1. One-line brand conviction / hero headline? (the emotional hook)
 * 2. Your mission — what do you stand for, in 2–3 sentences?
 * 3. Three core values (title + one line each)?
 * 4. How is your product made? Key materials + process (2–3 sentences)?
 * 5. Three craft/material proof points (label + one line)?
 * 6. Sustainability/sourcing approach? Three points (stat + label)?
 * 7. Closing line + CTA (usually → product page)?
 * 8. Image slots: hero (wide lifestyle), craft close-up, process/workshop shot.
 * Fill answers into ABOUT_CONFIG → page reflects the new brand instantly.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const ABOUT_CONFIG = {

  // ── Hero / opening conviction ─────────────────────────────────────────────
  eyebrow: 'Our Story',
  heroHeadline: "Real materials shouldn't carry showroom markups.",
  heroSub: 'Wylorise builds one thing — a natural bamboo standing desk — and sells it factory-direct, so the price reflects the materials, not the middlemen.',
  heroImage: '/images/product/gallery/07.png', // wide lifestyle shot

  // ── Mission / values ──────────────────────────────────────────────────────
  missionEyebrow: 'What we stand for',
  missionHeadline: 'We cut out the showroom, not the materials.',
  missionBody: 'Wylorise is a Wyoming company built on one idea: the same factory-made desks get sold under premium labels at three and four times the price, just for the privilege of a showroom floor. So we went direct to the source. By skipping the distributors and retail middlemen, we keep real natural bamboo and real dual-motor lift engineering, and pass the savings on to you.',
  values: [
    {
      title: 'Honest Pricing',
      body: 'Factory-direct, with no showroom markup. You pay for the desk — not the markups stacked on top of it.',
    },
    {
      title: 'Real Materials',
      body: 'Real natural bamboo and a genuine dual-motor lift. What you see is exactly what holds your work up every day.',
    },
    {
      title: 'Built to Last',
      body: 'A lacquer-sealed bamboo top and serviceable parts, backed by a 15-year frame warranty. A desk worth keeping, not replacing.',
    },
  ],

  // ── Craft & materials ─────────────────────────────────────────────────────
  craftEyebrow: "How it's made",
  craftHeadline: 'Natural bamboo, engineered to lift.',
  craftBody: 'Each top is real natural bamboo, sealed with a protective lacquer that makes it about twice as hard as ordinary wood and resistant to water and scratches. Beneath it sits a three-stage, dual-motor lift rated to 220 lb, with a wireless charging pad and USB ports on the front console, a pull-out drawer, and an under-desk cable tray. Real material, real engineering — finished to look right from every angle.',
  craftPoints: [
    {
      label: 'Natural bamboo top',
      body: 'Real lacquer-sealed bamboo, about twice as hard as ordinary wood — never laminate or printed film.',
    },
    {
      label: 'Dual-motor lift testing',
      body: 'A three-stage, dual-motor lift rated to 220 lb, engineered for smooth, stable sit-to-stand motion under a full setup.',
    },
    {
      label: 'Built-in charging & storage',
      body: 'A 10W wireless pad and USB-A/USB-C on the console, a pull-out drawer, and a cable tray — clutter handled, by design.',
    },
  ],
  craftImage: '/images/product/gallery/04.png', // close-up of bamboo grain
  processImage: '/images/product/gallery/05.png', // drawer / console detail

  // ── Sustainability / sourcing ─────────────────────────────────────────────
  sustainabilityEyebrow: 'Where it comes from',
  sustainabilityHeadline: 'Built once, to stay out of landfills.',
  sustainabilityBody: "Bamboo is one of the fastest-renewing materials on earth — it regrows in years, not decades — and a lacquer-sealed top over a serviceable frame is built to last. The most sustainable desk is the one you never have to replace, so we build something durable enough that you won't, with replaceable parts that turn a worn component into a swap, not a new desk.",
  sustainabilityPoints: [
    { stat: 'Bamboo', label: 'A fast-renewing, sustainable material' },
    { stat: 'Built to last', label: 'Lacquer-sealed top, serviceable frame' },
    { stat: 'Repairable', label: 'Serviceable parts, not a throwaway desk' },
  ],

  // ── Closing CTA ───────────────────────────────────────────────────────────
  closeHeadline: 'A real bamboo desk, at an honest price.',
  closeBody: "See the desk that does everything you need — and nothing you don't — without the showroom markup.",
  closeCtaLabel: 'Explore the desk',
  closeCtaHref: '/product',

} as const