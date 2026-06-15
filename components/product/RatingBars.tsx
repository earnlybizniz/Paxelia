'use client'

import { REVIEW_SUMMARY } from '@/lib/reviews-data'

// dist is [5★, 4★, 3★, 2★, 1★]
const ROWS = [5, 4, 3, 2, 1].map((stars, i) => ({ stars, count: REVIEW_SUMMARY.dist[i] }))
const TOTAL = ROWS.reduce((s, r) => s + r.count, 0)

export function RatingBars() {

  return (
    <div className="w-full flex flex-col gap-3">
      {ROWS.map((row) => {
        const pct = Math.max((row.count / TOTAL) * 100, 2)
        return (
          <div
            key={row.stars}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: '2.5rem 1fr 3rem' }}
          >
            {/* label */}
            <div className="flex items-center gap-1 text-sm text-[var(--ink-soft)]">
              <span>{row.stars}</span>
              <span style={{ color: 'var(--highlight)' }}>★</span>
            </div>

            {/* track — grid 1fr column guarantees width */}
            <div
              className="h-2.5 rounded-full overflow-hidden w-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              <div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--highlight)', width: `${pct}%` }}
              />
            </div>

            {/* count */}
            <span className="text-sm text-right tabular-nums text-[var(--ink-mute)]">
              {row.count.toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}