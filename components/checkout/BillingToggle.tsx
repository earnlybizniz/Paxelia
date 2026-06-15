/**
 * components/checkout/BillingToggle.tsx
 * "Billing address same as shipping" checkbox — checked by default.
 * When on:  pass shipping to Whop prefill + hideAddressForm
 * When off: Whop embed collects billing internally
 */
'use client'

interface Props {
  checked:   boolean
  onChange:  (checked: boolean) => void
}

export function BillingToggle({ checked, onChange }: Props) {
  return (
    <section aria-labelledby="billing-heading">
      <h2
        id="billing-heading"
        className="font-sans text-[0.78rem] uppercase tracking-widest text-[var(--ink-mute)] mb-3"
      >
        Billing address
      </h2>

      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        htmlFor="billing-same"
      >
        {/* Custom checkbox */}
        <span
          className="w-5 h-5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: checked ? 'var(--accent)' : 'transparent',
            borderColor:     checked ? 'var(--accent)' : 'color-mix(in srgb, var(--ink) 30%, transparent)',
          }}
          aria-hidden
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="var(--paper)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input
          id="billing-same"
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="font-sans text-[0.88rem] text-[var(--ink)]">
          Same as shipping address
        </span>
      </label>
    </section>
  )
}
