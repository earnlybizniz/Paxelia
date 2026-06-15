// components/academy/checkout/billing-section.tsx
/**
 * Billing address form, wrapped in Mapbox AddressAutofill — the same fields and
 * the same autofill behavior as the store's DeliverySection, just restyled for
 * the academy and labeled "Billing" (no shipping). Degrades gracefully when
 * NEXT_PUBLIC_MAPBOX_TOKEN is absent: suggestions stop, manual entry still works.
 */
'use client'

import { AddressAutofill } from '@mapbox/search-js-react'
import { cn } from '@/lib/utils'
import type { AcademyAddress } from '@/components/academy/checkout/whop-payment'

interface Props {
  address: AcademyAddress
  errors: Partial<Record<keyof AcademyAddress, string>>
  onChange: (field: keyof AcademyAddress, value: string) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

function Field({
  id,
  label,
  value,
  autoComplete,
  onChange,
  error,
  optional,
  inputMode,
  type = 'text',
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
      <label htmlFor={id} className="sr-only">
        {label}
        {optional ? ' (optional)' : ''}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={label + (optional ? ' (optional)' : '')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-[var(--omni-brand)]/25',
          error ? 'border-red-400 focus:border-red-400' : 'border-neutral-300 focus:border-[var(--omni-brand)]',
        )}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export function BillingSection({ address, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Country — US only, matching the store template */}
      <div>
        <label htmlFor="country" className="sr-only">
          Country / Region
        </label>
        <select
          id="country"
          name="country"
          autoComplete="billing country"
          value={address.country}
          onChange={(e) => onChange('country', e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[var(--omni-brand)] focus:ring-2 focus:ring-[var(--omni-brand)]/25"
        >
          <option value="US">United States</option>
        </select>
      </div>

      {/* Name row — outside AddressAutofill so it doesn't trigger suggestions */}
      <div className="grid grid-cols-2 gap-2.5">
        <Field
          id="firstName"
          label="First name"
          value={address.firstName}
          autoComplete="billing given-name"
          onChange={(v) => onChange('firstName', v)}
          optional
        />
        <Field
          id="lastName"
          label="Last name"
          value={address.lastName}
          autoComplete="billing family-name"
          onChange={(v) => onChange('lastName', v)}
          error={errors.lastName}
        />
      </div>

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Mapbox types */}
      <AddressAutofill
        accessToken={MAPBOX_TOKEN}
        options={{ country: 'US' }}
        onRetrieve={(res: any) => {
          const props = res?.features?.[0]?.properties
          if (!props) return
          if (props.address_line1) onChange('line1', props.address_line1)
          if (props.address_level2) onChange('city', props.address_level2)
          if (props.address_level1) onChange('state', props.address_level1)
          if (props.postcode) onChange('postalCode', props.postcode)
          if (props.country_code) onChange('country', props.country_code.toUpperCase())
        }}
      >
        <form autoComplete="on" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
          <Field
            id="line1"
            label="Address"
            value={address.line1}
            autoComplete="address-line1"
            onChange={(v) => onChange('line1', v)}
            error={errors.line1}
          />
          <Field
            id="line2"
            label="Apartment, suite, etc."
            value={address.line2}
            autoComplete="address-line2"
            onChange={(v) => onChange('line2', v)}
            optional
          />
          <div className="grid grid-cols-[1fr_5rem_5.5rem] gap-2.5">
            <Field
              id="city"
              label="City"
              value={address.city}
              autoComplete="address-level2"
              onChange={(v) => onChange('city', v)}
              error={errors.city}
            />
            <Field
              id="state"
              label="State"
              value={address.state}
              autoComplete="address-level1"
              onChange={(v) => onChange('state', v)}
              error={errors.state}
            />
            <Field
              id="postalCode"
              label="ZIP"
              value={address.postalCode}
              autoComplete="postal-code"
              onChange={(v) => onChange('postalCode', v)}
              error={errors.postalCode}
              inputMode="numeric"
            />
          </div>
        </form>
      </AddressAutofill>
    </div>
  )
}
