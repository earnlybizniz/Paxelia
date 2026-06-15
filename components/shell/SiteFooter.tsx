'use client'

import { HOME } from '@/lib/home-content'
import { Reveal } from '@/components/shell/Reveal'

export function SiteFooter() {
  return (
    <footer className="border-t border-walnut/10 bg-paper py-20 text-ink">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal variant="rise">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold">{HOME.brand.name}</h3>
              <p className="mt-2 text-sm text-muted-text">{HOME.footer.blurb}</p>
            </div>

            {/* Links */}
            {HOME.footer.columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-walnut">{col.title}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((item, i) => (
                    <li key={i}>
                      <a href={item.href} className="text-sm text-muted-text hover:text-walnut transition-colors">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bottom bar */}
        <Reveal variant="fade">
          <div className="mt-16 border-t border-walnut/10 pt-8">
            <p className="text-xs text-muted-text">
              {HOME.footer.legal}
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
