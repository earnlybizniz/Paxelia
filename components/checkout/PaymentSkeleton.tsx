/**
 * components/checkout/PaymentSkeleton.tsx
 * Shown while the Whop embed is loading.
 */
'use client'

export function PaymentSkeleton() {
  return (
    <div className="rounded-[8px] border border-[var(--ink)]/8 p-5 flex flex-col gap-3 animate-pulse"
      style={{ backgroundColor: 'var(--paper)' }}
    >
      <div className="h-3 w-24 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }} />
      <div className="h-11 w-full rounded-[6px]" style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 8%, transparent)' }} />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-11 rounded-[6px]" style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 8%, transparent)' }} />
        <div className="h-11 rounded-[6px]" style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 8%, transparent)' }} />
      </div>
      <div className="h-11 w-full rounded-[6px]" style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 8%, transparent)' }} />
    </div>
  )
}
