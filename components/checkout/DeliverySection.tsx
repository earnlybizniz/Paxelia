/**
 * components/checkout/DeliverySection.tsx
 * Shipping address form wrapped in Mapbox AddressAutofill.
 * Correct autoComplete tokens per spec for autofill to work.
 */
'use client'

import { AddressAutofill } from '@mapbox/search-js-react'

export interface AddressState {
  firstName:  string
  lastName:   string
  line1:      string
  line2:      string
  city:       string
  state:      string
  postalCode: string
  country:    string
}

interface Props {
  address:  AddressState
  errors:   Partial<Record<keyof AddressState, string>>
  onChange: (field: keyof AddressState, value: string) => void
}

const inputClass = (hasError: boolean) =>
  `w-full h-11 px-3.5 rounded-[6px] border font-sans text-[0.9rem] text-[var(--ink)] placeholder:text-[var(--ink-mute)] outline-none transition-colors bg-[var(--paper)]`

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  borderColor: hasError ? 'var(--error, #c0392b)' : 'color-mix(in srgb, var(--ink) 20%, transparent)',
  borderWidth: '1px',
})

function Field({
  id, label, value, autoComplete, onChange, error, optional, inputMode, type = 'text',
}: {
  id: string
  label: string
  value: string
  autoComplete: string
  onChange: (v: string) => void
  error?: string
  optional?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">{label}{optional ? ' (optional)' : ''}</label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={label + (optional ? ' (optional)' : '')}
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(!!error)}
        style={inputStyle(!!error)}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = error ? 'var(--error, #c0392b)' : 'color-mix(in srgb, var(--ink) 20%, transparent)')}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 font-sans text-[0.75rem]" style={{ color: 'var(--error, #c0392b)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// Read from env — set NEXT_PUBLIC_MAPBOX_TOKEN in your project vars.
// If the token is missing the AddressAutofill component degrades gracefully:
// it simply won't show suggestions, but all manual address fields still work.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export function DeliverySection({ address, errors, onChange }: Props) {
  return (
    <section aria-labelledby="delivery-heading">
      <h2
        id="delivery-heading"
        className="font-sans text-[0.78rem] uppercase tracking-widest text-[var(--ink-mute)] mb-3"
      >
        Delivery
      </h2>

      <div className="flex flex-col gap-2">
        {/* Country — US only for this template */}
        <div>
          <label htmlFor="country" className="sr-only">Country / Region</label>
          <select
            id="country"
            name="country"
            autoComplete="shipping country"
            value={address.country}
            onChange={e => onChange('country', e.target.value)}
            className="w-full h-11 px-3.5 rounded-[6px] border font-sans text-[0.9rem] text-[var(--ink)] bg-[var(--paper)] outline-none transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--ink) 20%, transparent)', borderWidth: '1px' }}
          >
            <option value="US">United States</option>
          </select>
        </div>

        {/* Name row — outside AddressAutofill so it doesn't trigger suggestions */}
        <div className="grid grid-cols-2 gap-2">
          <Field id="firstName" label="First name" value={address.firstName} autoComplete="shipping given-name"  onChange={v => onChange('firstName', v)} optional />
          <Field id="lastName"  label="Last name"  value={address.lastName}  autoComplete="shipping family-name" onChange={v => onChange('lastName', v)}  error={errors.lastName} />
        </div>

        {/*
          AddressAutofill wraps ONLY the address fields.
          The first input with autoComplete="address-line1" is the trigger.
          line2 / city / state / zip must also be inside so autofill can populate them.
        */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore Mapbox types */}
        <AddressAutofill
          accessToken={MAPBOX_TOKEN}
          options={{ country: 'US' }}
          onRetrieve={(res: any) => {
            const props = res?.features?.[0]?.properties
            if (!props) return
            if (props.address_line1)  onChange('line1',      props.address_line1)
            if (props.address_level2) onChange('city',       props.address_level2)
            if (props.address_level1) onChange('state',      props.address_level1)
            if (props.postcode)       onChange('postalCode', props.postcode)
            if (props.country_code)   onChange('country',    props.country_code.toUpperCase())
          }}
        >
          <form autoComplete="on" className="flex flex-col gap-2">
            {/* Address line 1 — triggers Mapbox suggestions */}
            <Field id="line1" label="Address" value={address.line1} autoComplete="address-line1" onChange={v => onChange('line1', v)} error={errors.line1} />

            {/* Apartment */}
            <Field id="line2" label="Apartment, suite, etc." value={address.line2} autoComplete="address-line2" onChange={v => onChange('line2', v)} optional />

            {/* City / State / ZIP */}
            <div className="grid grid-cols-[1fr_5rem_5.5rem] gap-2">
              <Field id="city"       label="City"  value={address.city}       autoComplete="address-level2" onChange={v => onChange('city', v)}       error={errors.city} />
              <Field id="state"      label="State" value={address.state}      autoComplete="address-level1" onChange={v => onChange('state', v)}      error={errors.state} />
              <Field id="postalCode" label="ZIP"   value={address.postalCode} autoComplete="postal-code"    onChange={v => onChange('postalCode', v)} error={errors.postalCode} inputMode="numeric" />
            </div>
          </form>
        </AddressAutofill>
      </div>
    </section>
  )
}
