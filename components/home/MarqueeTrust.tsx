'use client'

import { useHome } from '@/contexts/home-context'

export function MarqueeTrust() {
  const { marquee } = useHome()
  // Triplicate for seamless loop
  const items = [...marquee.items, ...marquee.items, ...marquee.items]

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--ink)]/8 bg-[var(--paper2)] py-4"
      aria-label="Press and trust highlights"
    >
      {/* Screen-reader version */}
      <ul className="sr-only">
        {marquee.items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      {/* Visual marquee */}
      <div
        aria-hidden="true"
        className="flex gap-10 w-max"
        style={{ animation: 'marqueeScroll 32s linear infinite' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-display text-[var(--ink)] opacity-50 whitespace-nowrap text-[0.95rem] hover:opacity-80 transition-opacity cursor-default select-none">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: 'var(--accent)', opacity: 0.6 }}
            />
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
