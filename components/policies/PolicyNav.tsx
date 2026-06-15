/**
 * components/policies/PolicyNav.tsx
 * Cross-links bar rendered at the bottom of every policy page.
 */
import Link from 'next/link'

const POLICIES = [
  { label: 'Refund & Returns', href: '/refund'   },
  { label: 'Shipping',         href: '/shipping'  },
  { label: 'Privacy',          href: '/privacy'   },
  { label: 'Terms of Service', href: '/terms'     },
]

export function PolicyNav() {
  return (
    <nav
      aria-label="Other policies"
      className="mt-16 pt-8 border-t flex flex-wrap gap-x-6 gap-y-3"
      style={{ borderColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }}
    >
      <p className="w-full font-sans text-[0.75rem] uppercase tracking-widest" style={{ color: 'var(--ink-mute)' }}>
        Other policies
      </p>
      {POLICIES.map(p => (
        <Link
          key={p.href}
          href={p.href}
          className="font-sans text-[0.85rem] underline underline-offset-2 transition-colors hover:opacity-70"
          style={{ color: 'var(--ink-soft, var(--ink))' }}
        >
          {p.label}
        </Link>
      ))}
    </nav>
  )
}
