'use client'

/**
 * ScarcityMeter
 *
 * - On first visit, assigns a random `remaining` between 1–15 and locks it
 *   in localStorage so it never goes back up on reload or return visits.
 * - Ticks downward over time with exponential decay: fast when remaining is
 *   high, slowing as it approaches 1.
 * - `sold` is always derived as TOTAL_POOL − remaining, keeping both numbers
 *   consistent.
 */

import { useEffect, useRef, useState } from 'react'
import { Flame } from 'lucide-react'

// Total pool size — sold = TOTAL_POOL − remaining
const TOTAL_POOL = 500

const STORAGE_KEY = 'wyl_scarcity_v1'

// ── helpers ──────────────────────────────────────────────────────────────────

/** Pick a random integer in [min, max] inclusive. */
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Next tick interval in ms.
 * When remaining is high → short interval (fast drop).
 * When remaining is close to 1 → long interval (very slow drop).
 *
 * Formula: base * (1 / remaining)^(-k)  →  base * remaining^k
 * k = 1.6 gives a steep but natural curve.
 */
function nextInterval(remaining: number): number {
  const base = 4_000   // 4 s at remaining=1 (effectively "stopped")
  const k = 1.6
  return Math.round(base * Math.pow(Math.max(1, remaining), k) / Math.pow(15, k))
}

// ── persistence helpers ───────────────────────────────────────────────────────

function loadStored(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 1 && n <= 15 ? n : null
  } catch {
    return null
  }
}

function persist(n: number) {
  try { localStorage.setItem(STORAGE_KEY, String(n)) } catch { /* ignore */ }
}

// ── component ─────────────────────────────────────────────────────────────────

export function ScarcityMeter() {
  // null = not yet hydrated (avoids SSR mismatch)
  const [remaining, setRemaining] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from localStorage (or assign fresh value) only on the client
  useEffect(() => {
    const stored = loadStored()
    const initial = stored ?? randInt(1, 15)
    if (!stored) persist(initial)
    setRemaining(initial)
  }, [])

  // Tick: decrement remaining with exponential slowdown
  useEffect(() => {
    if (remaining === null || remaining <= 1) return

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setRemaining(prev => {
          if (prev === null || prev <= 1) return prev
          const next = prev - 1
          persist(next)
          return next
        })
      }, nextInterval(remaining))
    }

    schedule()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [remaining])

  // Avoid SSR mismatch: render nothing until hydrated
  if (remaining === null) return null

  const sold = TOTAL_POOL - remaining
  const pct = Math.min(100, Math.round((sold / TOTAL_POOL) * 100))
  const critical = remaining <= 5

  return (
    <div
      className={[
        'rounded-[10px] border px-3.5 py-3 transition-colors duration-500',
        critical
          ? 'border-red-500/40 bg-red-500/8'
          : 'border-red-400/30 bg-red-500/6',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={`Only ${remaining} left in stock`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Sold count */}
        <span className="flex items-center gap-1.5 font-sans text-[0.78rem] text-[var(--ink-soft)]">
          <Flame
            size={13}
            className={[
              'flex-shrink-0 transition-colors duration-500',
              critical ? 'text-red-500' : 'text-red-400',
            ].join(' ')}
          />
          <span>{sold.toLocaleString()} sold</span>
        </span>

        {/* Remaining — the urgent message */}
        <span
          className={[
            'font-sans text-[0.82rem] font-semibold transition-colors duration-500',
            critical ? 'text-red-600' : 'text-red-500',
          ].join(' ')}
        >
          {remaining === 1
            ? 'Last one left at this price!'
            : `Only ${remaining} left at this price`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-red-200/40">
        <div
          className={[
            'h-full rounded-full transition-all duration-700 ease-out',
            critical ? 'bg-red-600' : 'bg-red-500',
          ].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
