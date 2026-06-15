import { eduBrand, eduFooter } from '@/lib/edu/site'

/**
 * EDU tenant site footer. Fresh component — no retail dependency.
 * Includes the honest, required compliance disclaimer.
 */
export function EduFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="text-xl font-display font-semibold tracking-tight text-foreground">
              {eduBrand.name}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {eduBrand.tagline} The Meta ads membership — one complete field
              guide plus a live community that keeps you current.
            </p>
            <a
              href={`mailto:${eduBrand.supportEmail}`}
              className="mt-4 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {eduBrand.supportEmail}
            </a>
          </div>

          <FooterColumn title="Membership" links={eduFooter.membership} />
          <FooterColumn title="Company" links={eduFooter.company} />
          <FooterColumn title="Policies" links={eduFooter.policies} />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {eduBrand.disclaimer}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} {eduBrand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: readonly { label: string; href: string }[]
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
