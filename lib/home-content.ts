/**
 * lib/home-content.ts
 * THE SINGLE SOURCE OF TRUTH for the homepage.
 * Every string, color, image, and stat lives here.
 * To re-skin for a new brand: replace this object. No layout edits needed.
 */

export type ImageSlot = {
  src: string
  alt: string
  ratio: string          // e.g. "4/4.6" → used as aspect-ratio CSS
  placeholder: string    // CSS gradient shown until real image loads
  kind?: 'image' | 'video' // 'video' renders an autoplay/loop/muted <video>
  poster?: string        // optional poster frame for videos
}

export type HomeContent = {
  brand: {
    name: string
    logoWordmark: string
    palette: {
      paper: string
      paper2: string
      paper3: string
      ink: string
      inkSoft: string
      inkMute: string
      accent: string
      accentDeep: string
      highlight: string
    }
    fonts: { display: string; sans: string }
  }

  announcement: string[]

  hero: {
    eyebrow: string
    headline: string   // *asterisks* → accent italic
    sub: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    image: ImageSlot
    badge?: string
    priceFloat?: { price: string }
    stats: { value: number; dec?: number; suffix?: string; label: string }[]
  }

  marquee: { items: string[] }

  problemSolution: {
    eyebrow: string
    heading: string
    bad: { title: string; points: string[] }
    good: { title: string; points: string[] }
  }

  features: {
    eyebrow: string
    heading: string
    rows: {
      num: string
      kicker: string
      title: string
      body: string
      specs: { value: string; label: string }[]
      image: ImageSlot
    }[]
  }

  variantTeaser: {
    eyebrow: string
    heading: string
    sizes: { label: string; sub: string; price: string }[]
    finishes: { label: string; swatch: string }[]
    priceFrom: string
    cta: { label: string; href: string }
  }

  gallery: { eyebrow: string; heading: string; images: ImageSlot[] }

  comparison: {
    eyebrow: string
    heading: string
    columns: string[]
    rows: { feature: string; cells: (string | boolean)[] }[]
  }

  reviews: {
    eyebrow: string
    heading: string
    score: number
    count: number
    items: { stars: number; body: string; author: string; config: string }[]
  }

  story?: {
    eyebrow: string
    heading: string
    body: string[]
    image: ImageSlot
  }

  guarantee: {
    items: { icon: string; title: string; body: string }[]
  }

  faq: {
    eyebrow: string
    heading: string
    items: { q: string; a: string }[]
  }

  finalCta: {
    eyebrow: string
    headline: string
    sub: string
    cta: { label: string; href: string }
    priceLine: string
  }

  footer: {
    blurb: string
    columns: { title: string; links: { label: string; href: string }[] }[]
    newsletter: { heading: string; sub: string }
    payments: string[]
    legal: string
  }
}

// ─── WYLORISE content ────────────────────────────────────────────────────────

export const HOME: HomeContent = {
  brand: {
    name: 'Wylorise',
    logoWordmark: 'Wylorise',
    palette: {
      // White / shades-of-white surfaces (3 stepped near-whites keep sections distinct).
      paper:      '#ffffff',   // main background — pure white
      paper2:     '#f7f6f3',   // cards / alt sections — warm off-white
      paper3:     '#e8e6e0',   // borders / deepest neutral — warm light grey
      ink:        '#1b1a17',   // primary text — near-black
      inkSoft:    '#45413b',   // secondary text
      inkMute:    '#8c867c',   // muted / labels
      // Honey-amber accent (warm bamboo): buttons + links, bamboo-honey highlight.
      accent:     '#b07a2e',   // honey amber — buttons, links
      accentDeep: '#8d6022',   // amber hover / deeper
      highlight:  '#cda158',   // bamboo honey — headline italics, stars, accents
    },
    fonts: { display: 'Space Grotesk', sans: 'Outfit' },
  },

  announcement: [
    'Factory-direct pricing — no showroom markup',
    'Award-winning bamboo, priced honestly',
    'Free shipping on every US order',
  ],

  hero: {
    eyebrow: 'Factory-direct · Natural bamboo',
    headline: "Everything you need in a standing desk. *Nothing you don't.*",
    sub: 'Real natural bamboo, a dual-motor lift rated to 220 lb, built-in wireless charging, and a 15-year frame warranty — sold factory-direct, for a fraction of showroom pricing.',
    primaryCta: { label: 'Shop the Desk', href: '/product' },
    secondaryCta: { label: 'See how it works', href: '/product#features' },
    image: {
      src: '/images/product/gallery/07.png',
      alt: 'The Wylorise Sovereign Q8 bamboo standing desk with a white frame in a sunlit modern home office',
      ratio: '1/1',
      placeholder: 'linear-gradient(135deg, #f3ecdd 0%, #d8c19a 45%, #b07a2e 100%)',
    },
    badge: 'Up to 80% off showroom pricing',
    priceFloat: { price: 'From $99.99' },
    stats: [
      { value: 220, suffix: ' lb', label: 'Lift capacity' },
      { value: 4.9, dec: 1, label: 'Average rating' },
      { value: 15, suffix: '-yr', label: 'Frame warranty' },
    ],
  },

  marquee: {
    items: [
      'Natural bamboo top',
      'Dual-motor · 220 lb',
      'Wireless charging built in',
      'Factory-direct pricing',
      'Free US shipping',
      'Up to 80% off showroom pricing',
      '15-year frame warranty',
      '30-day returns',
    ],
  },

  problemSolution: {
    eyebrow: 'Why it matters',
    heading: 'A great standing desk should not cost a fortune',
    bad: {
      title: 'Standing desks today',
      points: [
        'Laminate or MDF tops that look like office furniture',
        'Premium desks priced at $500 and up for the same features',
        'Cables everywhere and no built-in storage',
        'Charging bricks and adapters cluttering the surface',
        'A wired keypad bolted to the edge of the top',
      ],
    },
    good: {
      title: 'The Wylorise Sovereign Q8',
      points: [
        'Real natural bamboo — tougher than wood, water- and scratch-resistant',
        'Factory-direct price, not a showroom markup',
        'Dual-motor lift rated to a full 220 lb, with four presets',
        'Wireless charging plus USB-A and USB-C built into the console',
        'A pull-out drawer, a cable tray, and a monitor-arm mount',
      ],
    },
  },

  features: {
    eyebrow: 'Engineered details',
    heading: 'Everything you need, down to the detail',
    rows: [
      {
        num: '01',
        kicker: 'The surface',
        title: 'Real bamboo, built to take a beating',
        body: 'Each top is natural bamboo sealed with a protective lacquer — real material, never laminate or printed film. It runs about twice as hard as ordinary wood, shrugs off water and scratches, and warms up the whole room. As a fast-renewing grass, it is sustainable too.',
        specs: [
          { value: 'Bamboo', label: 'Natural top' },
          { value: '2× harder', label: 'Than wood' },
          { value: 'Sealed', label: 'Water-resistant' },
        ],
        image: {
          src: '/images/product/features/surface.png',
          alt: 'Close-up of the natural bamboo desktop on the Wylorise Sovereign Q8',
          ratio: '3/4',
          placeholder: 'linear-gradient(160deg, #f3ecdd 0%, #d8c096 50%, #8d6022 100%)',
        },
      },
      {
        num: '02',
        kicker: 'The lift system',
        title: 'Dual-motor lift, rated to 220 lb',
        body: 'A motor in each oval leg moves the desk smoothly and quietly between sitting and standing all day, and holds rock-steady under monitors, a laptop, and everything else you pile on. Four memory presets and anti-collision detection come standard.',
        specs: [
          { value: '220 lb', label: 'Lift capacity' },
          { value: '22.8–49.2"', label: 'Height range' },
          { value: 'Dual', label: 'Motor system' },
        ],
        image: {
          src: '/images/product/features/lift.png',
          alt: 'The Wylorise Sovereign Q8 raised to standing height',
          ratio: '3/4',
          placeholder: 'linear-gradient(160deg, #e8dcc2 0%, #b07a2e 55%, #5a3d18 100%)',
        },
      },
      {
        num: '03',
        kicker: 'Power & charging',
        title: 'Charging built into the desk',
        body: 'Set your phone on the wireless pad in the corner and it charges — no cable needed. The front touch console adds USB-A and USB-C for everything else, plus an LED height readout and one-touch presets, so power lives in the desk instead of in a knot underneath it.',
        specs: [
          { value: '10W', label: 'Wireless pad' },
          { value: 'USB-A + C', label: 'On the console' },
          { value: '4 presets', label: 'One-touch' },
        ],
        image: {
          src: '/images/product/features/charging.png',
          alt: 'The wireless charging pad and touch console on the Wylorise Sovereign Q8',
          ratio: '3/4',
          placeholder: 'linear-gradient(160deg, #efe6d3 0%, #c9a24b 50%, #8d6022 100%)',
        },
      },
      {
        num: '04',
        kicker: 'Storage & cables',
        title: 'A place for the mess',
        body: 'A flush pull-out drawer keeps pens, notes, and a charger within reach but off the surface. An under-desk tray hides your power strip and cables, and a solid wood block beneath the top gives a clamp-style monitor arm something firm to grip.',
        specs: [
          { value: 'Drawer', label: 'Pull-out' },
          { value: 'Cable tray', label: 'Under-desk' },
          { value: 'Arm-ready', label: 'Wood block' },
        ],
        image: {
          src: '/images/product/features/storage.png',
          alt: 'The pull-out storage drawer on the Wylorise Sovereign Q8',
          ratio: '3/4',
          placeholder: 'linear-gradient(160deg, #e8dcc2 0%, #b09472 50%, #5a3d18 100%)',
        },
      },
    ],
  },

  variantTeaser: {
    eyebrow: 'Configure yours',
    heading: 'Three sizes, one clean finish.',
    sizes: [
      { label: 'The Standard', sub: '55 × 28 in', price: '$99.99' },
      { label: 'The Pro', sub: '63 × 30 in', price: '$139.99' },
      { label: 'The Executive', sub: '72 × 30 in', price: '$189.99' },
    ],
    finishes: [
      { label: 'White', swatch: '#ECE9E3' },
      { label: 'Black', swatch: '#1b1a17' },
    ],
    priceFrom: 'From $99.99',
    cta: { label: 'Build your desk', href: '/product' },
  },

  gallery: {
    eyebrow: 'In the wild',
    heading: 'Real workspaces. Real bamboo.',
    images: [
      {
        src: '/images/product/gallery/07.png',
        alt: 'The Wylorise Sovereign Q8 in a bright minimal home office',
        ratio: '1/1',
        placeholder: 'linear-gradient(160deg,#f3ecdd,#cda158)',
      },
      {
        src: '/images/product/gallery/02.png',
        alt: 'The Wylorise Sovereign Q8 with a monitor and framed art',
        ratio: '1/1',
        placeholder: 'linear-gradient(160deg,#efe6d3,#c19a52)',
      },
      {
        src: '/images/product/gallery/03.png',
        alt: 'The Wylorise Sovereign Q8 in a warm, sunlit room',
        ratio: '1/1',
        placeholder: 'linear-gradient(160deg,#e8dcc2,#b07a2e)',
      },
      {
        src: '/images/product/gallery/04.png',
        alt: 'Close-up of the natural bamboo desktop grain',
        ratio: '1/1',
        placeholder: 'linear-gradient(160deg,#f3ecdd,#cda158)',
      },
      {
        src: '/images/product/gallery/08.png',
        alt: 'The Wylorise Sovereign Q8 raised to standing height',
        ratio: '1/1',
        placeholder: 'linear-gradient(160deg,#e6d9bd,#8d6022)',
      },
    ],
  },

  comparison: {
    eyebrow: 'The honest comparison',
    heading: 'See exactly where we stand',
    columns: ['Wylorise', 'Big-box standing desk', 'Premium showroom desk'],
    rows: [
      { feature: 'Natural bamboo top',           cells: [true, false, true] },
      { feature: '220 lb lift capacity',          cells: [true, false, true] },
      { feature: 'Wireless charging built in',    cells: [true, false, false] },
      { feature: 'Pull-out drawer + cable tray',  cells: [true, false, false] },
      { feature: 'Monitor-arm mounting block',    cells: [true, false, false] },
      { feature: '15-year frame warranty',        cells: [true, false, false] },
      { feature: 'Factory-direct price',          cells: [true, true, false] },
      { feature: 'Free US shipping',              cells: [true, false, false] },
    ],
  },

  reviews: {
    eyebrow: 'What people say',
    heading: 'Loved by people who work from home',
    score: 4.9,
    count: 248,
    items: [
      {
        stars: 5,
        body: "The bamboo top looks fantastic on video calls, and I still can't believe the price — it feels like a desk that should cost three times as much.",
        author: 'Marcus T.',
        config: 'The Pro',
      },
      {
        stars: 5,
        body: 'Smooth, quiet, and rock-steady even with two monitors and a laptop on it. Charging my phone right on the desk is the little thing I did not know I needed.',
        author: 'Priya S.',
        config: 'The Standard',
      },
      {
        stars: 5,
        body: 'I was nervous ordering a desk like this online, but it arrived perfectly and went together easily. The presets and the hidden cable tray are my favorite parts.',
        author: 'James K.',
        config: 'The Executive',
      },
    ],
  },

  story: {
    eyebrow: 'Our mission',
    heading: 'We cut out the showroom, *not* the materials',
    body: [
      'Wylorise exists for one reason: the same factory-built desks get sold under premium labels at three and four times the price, just for the privilege of a showroom floor. We did not think a great bamboo desk should cost that.',
      'So we go straight to the source. By buying factory-direct and skipping the distributors and retail middlemen, we keep the real materials and real engineering — natural bamboo, a dual-motor lift, built-in charging — and pass the savings to you. Same desk. Honest price.',
    ],
    image: {
      src: '/images/product/gallery/03.png',
      alt: 'The Wylorise Sovereign Q8 in a styled modern workspace',
      ratio: '4/5',
      placeholder: 'linear-gradient(160deg,#e8dcc2,#b07a2e)',
    },
  },

  guarantee: {
    items: [
      {
        icon: 'RotateCcw',
        title: '30-day trial',
        body: 'Live with it for 30 days. If it is not right for your space, send it back for a full refund — we cover return shipping.',
      },
      {
        icon: 'Truck',
        title: 'Free shipping',
        body: 'Free standard shipping on every order across the US, with tracking from our door to yours.',
      },
      {
        icon: 'Shield',
        title: '15-year frame warranty',
        body: 'Frame, motor, and electronics are covered for 15 years, and the bamboo top for 5.',
      },
      {
        icon: 'Lock',
        title: 'Secure checkout',
        body: 'Every order is a secure one-time payment, processed over an encrypted, PCI-compliant connection.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    heading: 'Everything you want to know',
    items: [
      {
        q: 'Is the top really bamboo?',
        a: 'Yes — every top is natural bamboo sealed with a protective lacquer, not laminate or a printed pattern. Because it is real bamboo, the grain varies slightly from desk to desk, so yours is one of a kind.',
      },
      {
        q: 'How is it this affordable?',
        a: 'We buy factory-direct and skip the showroom, distributor, and retail markups that normally sit on top of a desk like this. The materials and engineering are the same — we simply removed the middlemen and passed the savings to you.',
      },
      {
        q: 'How much weight can it hold?',
        a: 'The dual-motor, three-stage frame is rated to 220 lb, so it comfortably handles multiple monitors, a laptop, and the rest of your setup while moving smoothly between sitting and standing.',
      },
      {
        q: 'Does it require assembly?',
        a: 'Some assembly is required, and it ships in two boxes with all the hardware, tools, and illustrated instructions. Most people set it up without any special tools.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are processed in 1–2 business days and typically arrive within 5–12 business days, with tracking provided. Shipping is free within the US.',
      },
      {
        q: "What's the warranty?",
        a: 'The frame, motor, and electronics are covered for 15 years, and the bamboo top for 5 years. You also get a 30-day return window.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Ready when you are',
    headline: 'A real bamboo desk, at an *honest* price',
    sub: 'Join the people who put a do-everything bamboo desk in their home office — without the showroom markup.',
    cta: { label: 'Build your desk', href: '/product' },
    priceLine: 'From $99.99 · Free US shipping · 30-day trial',
  },

  footer: {
    blurb: 'Natural bamboo standing desks, sold factory-direct and priced honestly.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'The Desk', href: '/product' },
          { label: 'About', href: '/about' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'FAQ', href: '/support' },
          { label: 'Shipping & Returns', href: '/shipping' },
          { label: 'Contact', href: '/support' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ],
      },
    ],
    newsletter: {
      heading: 'Honest pricing, in your inbox',
      sub: 'Restock alerts, new colorways, and the occasional very good desk photo.',
    },
    payments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'],
    legal: `© ${new Date().getFullYear()} Wylorise LLC. All rights reserved.`,
  },
}