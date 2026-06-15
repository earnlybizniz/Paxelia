/**
 * components/checkout/ContactSection.tsx
 * Email input — collected here; hidden from Whop embed via hideEmail.
 */
'use client'

interface Props {
  email: string
  error?: string
  onChange: (email: string) => void
}

export function ContactSection({ email, error, onChange }: Props) {
  return (
    <section aria-labelledby="contact-heading">
      <h2
        id="contact-heading"
        className="font-sans text-[0.78rem] uppercase tracking-widest text-[var(--ink-mute)] mb-3"
      >
        Contact
      </h2>

      <div>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          className="w-full h-11 px-3.5 rounded-[6px] border font-sans text-[0.9rem] text-[var(--ink)] placeholder:text-[var(--ink-mute)] outline-none transition-colors"
          style={{
            backgroundColor:  'var(--paper)',
            borderColor:      error ? 'var(--error, #c0392b)' : 'var(--ink)/20',
            borderWidth:      '1px',
          }}
          onFocus={e  => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={e   => (e.currentTarget.style.borderColor = error ? 'var(--error, #c0392b)' : 'color-mix(in srgb, var(--ink) 20%, transparent)')}
        />
        {error && (
          <p id="email-error" role="alert" className="mt-1 font-sans text-[0.75rem]" style={{ color: 'var(--error, #c0392b)' }}>
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
