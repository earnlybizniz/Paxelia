/**
 * components/checkout/ShippingMethod.tsx
 * Shows a placeholder until the shipping address is valid, then IMMEDIATELY
 * reveals the single free-shipping option. There is no artificial "detecting
 * shipping methods" delay — shipping is a flat free rate that's known up front,
 * so faking a 1.4s spinner only added friction. Instant + honest.
 */
'use client'

interface Props {
  addressReady: boolean
}

export function ShippingMethod({ addressReady }: Props) {
  return (
    <section aria-labelledby="shipping-method-heading">
      <h2
        id="shipping-method-heading"
        className="font-sans text-[0.78rem] uppercase tracking-widest text-[var(--ink-mute)] mb-3"
      >
        Shipping method
      </h2>

      {!addressReady ? (
        /* Address not yet filled */
        <div
          className="rounded-[6px] border px-4 py-3.5"
          style={{
            borderColor:     'color-mix(in srgb, var(--ink) 12%, transparent)',
            backgroundColor: 'var(--paper2, #f5f5f4)',
          }}
        >
          <p className="font-sans text-[0.82rem] text-[var(--ink-mute)]">
            Enter your shipping address to see shipping options.
          </p>
        </div>
      ) : (
        /* Address ready → free shipping, shown instantly */
        <div
          className="rounded-[6px] border px-4 py-3.5 flex items-center justify-between"
          style={{
            borderColor:     'var(--accent)',
            backgroundColor: 'var(--paper)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: 'var(--accent)' }}
              aria-hidden
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            </span>
            <div>
              <p className="font-sans text-[0.88rem] font-medium text-[var(--ink)]">Free shipping</p>
              <p className="font-sans text-[0.75rem] text-[var(--ink-mute)]">5–12 business days</p>
            </div>
          </div>
          <span className="font-sans text-[0.88rem] font-medium text-[var(--ink)]">Free</span>
        </div>
      )}
    </section>
  )
}
