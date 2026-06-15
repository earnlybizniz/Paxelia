// app/edu/checkout/checkout-client.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, Lock, ShieldCheck, Loader2 } from 'lucide-react'
import { Container } from '@/components/academy/container'
import { Button } from '@/components/academy/ui/button'
import { WhopPayment, type AcademyAddress } from '@/components/academy/checkout/whop-payment'
import { BillingSection } from '@/components/academy/checkout/billing-section'
import { planForVariant } from '@/lib/whop-plans'
import { PLANS } from '@/config/academy/plans'
import { cn } from '@/lib/utils'

type Variant = 'sm' | 'md' | 'lg'
const PLAN_TO_VARIANT: Record<string, Variant> = { '30': 'sm', '60': 'md', '90': 'lg' }

type Step = 'plan' | 'details' | 'questionnaire' | 'review' | 'payment'
const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 'plan', label: 'Plan' },
  { key: 'details', label: 'Details' },
  { key: 'questionnaire', label: 'About you' },
  { key: 'review', label: 'Review' },
]
const STEP_INDEX: Record<Step, number> = { plan: 0, details: 1, questionnaire: 2, review: 3, payment: 3 }

const DEFAULT_ADDRESS: AcademyAddress = {
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
}

const EXPERIENCE_OPTIONS = ['Just getting started', 'Some experience', 'Experienced']
const FOCUS_OPTIONS = [
  'Setting up tracking & launching',
  'Improving current campaigns',
  'Scaling what works',
  'Learning the fundamentals',
]

interface FieldErrors {
  email?: string
  lastName?: string
  line1?: string
  city?: string
  state?: string
  postalCode?: string
}

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export default function CheckoutClient() {
  const [step, setStep] = useState<Step>('plan')

  const [planId, setPlanId] = useState<string | null>(null) // '30' | '60' | '90'
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<AcademyAddress>(DEFAULT_ADDRESS)
  const [errors, setErrors] = useState<FieldErrors>({})

  // Questionnaire — collected only, never stored or sent
  const [experience, setExperience] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)

  // Agreements gate the pay button
  const [agreeRecurring, setAgreeRecurring] = useState(false)
  const [agreeLegal, setAgreeLegal] = useState(false)

  // Session (created on "Pay")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [whopPlanId, setWhopPlanId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [awaitingEmbed, setAwaitingEmbed] = useState(false)

  // Preselect plan from ?plan=, surface a returned payment error
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const p = sp.get('plan')
    if (p && PLAN_TO_VARIANT[p]) setPlanId(p)
    if (sp.get('error') === 'payment') {
      setSessionError('Your payment didn’t go through. You can review your details and try again.')
    }
  }, [])

  const selectedPlan = PLANS.find((p) => p.id === planId) ?? null
  const variantId: Variant | '' = planId ? PLAN_TO_VARIANT[planId] : ''
  const embedReady = !!(sessionId && whopPlanId)

  const resetSession = useCallback(() => {
    setSessionId(null)
    setOrderId(null)
    setWhopPlanId(null)
    setSessionError(null)
    setAwaitingEmbed(false)
  }, [])

  const handleAddr = useCallback(
    (field: keyof AcademyAddress, value: string) => {
      setAddress((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      resetSession()
    },
    [resetSession],
  )

  const handleEmail = useCallback(
    (value: string) => {
      setEmail(value)
      setErrors((prev) => ({ ...prev, email: undefined }))
      resetSession()
    },
    [resetSession],
  )

  const selectPlan = useCallback(
    (id: string) => {
      setPlanId(id)
      resetSession()
    },
    [resetSession],
  )

  const validateDetails = () => {
    const e: FieldErrors = {}
    if (!emailValid(email)) e.email = 'Enter a valid email'
    if (!address.lastName.trim()) e.lastName = 'Last name required'
    if (!address.line1.trim()) e.line1 = 'Address required'
    if (!address.city.trim()) e.city = 'City required'
    if (!address.state.trim()) e.state = 'State required'
    if (!address.postalCode.trim()) e.postalCode = 'ZIP required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const canPay = agreeRecurring && agreeLegal

  const createSession = useCallback(async () => {
    if (!variantId) return
    // Reuse-if-unchanged: any edit clears the session, so a live session means
    // nothing changed — just reveal the payment step.
    if (sessionId && whopPlanId) {
      setStep('payment')
      return
    }
    setSessionLoading(true)
    setSessionError(null)
    try {
      const res = await fetch('/api/academy/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, email, address, billingSame: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSessionError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setWhopPlanId(planForVariant(variantId))
      setSessionId(data.sessionId)
      setOrderId(data.orderId)
      setAwaitingEmbed(true) // mount embed off-screen; reveal when ready
    } catch {
      setSessionError('Network error — please try again.')
    } finally {
      setSessionLoading(false)
    }
  }, [variantId, email, address, sessionId, whopPlanId])

  const handleEmbedStateChange = useCallback((state: 'loading' | 'ready' | 'disabled') => {
    if (state === 'ready') {
      setAwaitingEmbed((prev) => {
        if (prev) setStep('payment')
        return false
      })
    }
  }, [])

  // Safety net: the embed is mounted off-screen (1x1, clipped) while we wait for
  // its 'ready' event. A non-rendered/out-of-viewport iframe can be throttled by
  // the browser and may never post 'ready', leaving the buyer stuck on the
  // "Preparing…" loader. If 'ready' hasn't arrived shortly, reveal the payment
  // step anyway — that moves the embed on-screen where it finishes loading
  // (showing its own skeleton). Presentational only; does not touch payment.
  useEffect(() => {
    if (!awaitingEmbed) return
    const t = setTimeout(() => {
      setAwaitingEmbed(false)
      setStep('payment')
    }, 3500)
    return () => clearTimeout(t)
  }, [awaitingEmbed])

  const handleComplete = useCallback(() => {
    window.location.assign(`/thank-you?order=${orderId}`)
  }, [orderId])

  const price = selectedPlan ? `$${selectedPlan.price.toFixed(2)}` : ''
  const days = selectedPlan?.days ?? 0

  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          Join Wylorise
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          One membership — the full ebook and the entire community.
        </p>

        <StepIndicator current={STEP_INDEX[step]} />

        {sessionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {sessionError}
          </div>
        )}

        {/* ── STEP 1: PLAN ─────────────────────────────────────────── */}
        {step === 'plan' && (
          <div className="flex flex-col gap-3">
            {PLANS.map((plan) => {
              const active = plan.id === planId
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => selectPlan(plan.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border bg-white p-5 text-left transition-all',
                    active
                      ? 'border-[var(--omni-brand)] ring-2 ring-[var(--omni-brand)]/20'
                      : 'border-neutral-200 hover:border-neutral-300',
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-semibold text-neutral-950">{plan.name}</span>
                      {plan.badge ? (
                        <span className="rounded-full bg-[var(--omni-brand-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--omni-brand)]">
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Billed every {plan.days} days · {plan.perDay}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-semibold text-neutral-950">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span
                      className={cn(
                        'grid h-5 w-5 place-items-center rounded-full border',
                        active ? 'border-[var(--omni-brand)] bg-[var(--omni-brand)] text-white' : 'border-neutral-300',
                      )}
                      aria-hidden
                    >
                      {active && <Check className="h-3 w-3" />}
                    </span>
                  </div>
                </button>
              )
            })}
            <Button
              variant="primary"
              size="lg"
              disabled={!planId}
              onClick={() => setStep('details')}
              className="mt-2 w-full disabled:opacity-40 disabled:pointer-events-none"
            >
              Continue
            </Button>
          </div>
        )}

        {/* ── STEP 2: DETAILS ──────────────────────────────────────── */}
        {step === 'details' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-neutral-500">
                Contact
              </h2>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => handleEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className={cn(
                  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-[var(--omni-brand)]/25',
                  errors.email ? 'border-red-400 focus:border-red-400' : 'border-neutral-300 focus:border-[var(--omni-brand)]',
                )}
              />
              {errors.email && (
                <p role="alert" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
              <p className="mt-1.5 text-xs text-neutral-400">Your access details and receipt go here.</p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-neutral-500">
                Billing details
              </h2>
              <BillingSection address={address} errors={errors} onChange={handleAddr} />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (validateDetails()) setStep('questionnaire')
                }}
                className="w-full"
              >
                Continue
              </Button>
              <BackButton onClick={() => setStep('plan')} label="Back to plan" />
            </div>
          </div>
        )}

        {/* ── STEP 3: QUESTIONNAIRE ────────────────────────────────── */}
        {step === 'questionnaire' && (
          <div className="flex flex-col gap-7">
            <QuestionGroup
              label="How would you describe your experience with Google Ads?"
              options={EXPERIENCE_OPTIONS}
              value={experience}
              onSelect={setExperience}
            />
            <QuestionGroup
              label="What's your main focus right now?"
              options={FOCUS_OPTIONS}
              value={focus}
              onSelect={setFocus}
            />
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                disabled={!experience || !focus}
                onClick={() => setStep('review')}
                className="w-full disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue
              </Button>
              <BackButton onClick={() => setStep('details')} label="Back to details" />
            </div>
          </div>
        )}

        {/* ── STEP 4: REVIEW + AGREE ───────────────────────────────── */}
        {step === 'review' && (
          <div className="flex flex-col gap-6">
            {selectedPlan && <Recap planName={selectedPlan.name} price={price} days={days} email={email} />}

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <h2 className="font-display text-sm font-semibold text-neutral-950">Before you join</h2>
              <ul className="mt-3 space-y-2">
                {[
                  `You'll be charged ${price} today, then automatically every ${days} days until you cancel.`,
                  'Cancel anytime — you keep full access through the end of your paid period.',
                  '30-day money-back guarantee on your first payment. Renewals are non-refundable.',
                  'Educational membership — no income or results guarantees. Not affiliated with Google.',
                  'Your charge appears as WYLORISE. Payments are securely processed by Whop.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--omni-brand)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <AgreeCheckbox checked={agreeRecurring} onChange={setAgreeRecurring}>
                I understand my membership renews automatically every {days} days at {price} until I cancel.
              </AgreeCheckbox>
              <AgreeCheckbox checked={agreeLegal} onChange={setAgreeLegal}>
                I&apos;ve read and agree to the{' '}
                <Link href="/terms" target="_blank" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                  Terms
                </Link>
                ,{' '}
                <Link href="/privacy" target="_blank" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                  Privacy Policy
                </Link>
                ,{' '}
                <Link href="/refund" target="_blank" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                  Refund Policy
                </Link>
                , and{' '}
                <Link href="/eula" target="_blank" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                  EULA
                </Link>
                .
              </AgreeCheckbox>
            </div>

            {awaitingEmbed ? (
              <PreparingLoader />
            ) : (
              <Button
                variant="primary"
                size="lg"
                disabled={!canPay || sessionLoading}
                onClick={createSession}
                className="w-full disabled:opacity-40 disabled:pointer-events-none"
              >
                <Lock className="h-4 w-4" />
                {sessionLoading ? 'Preparing…' : `Pay ${price} & get access`}
              </Button>
            )}

            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 30-day money-back · cancel anytime
            </p>

            <BackButton onClick={() => setStep('questionnaire')} label="Back" />
          </div>
        )}

        {/* ── STEP 5: PAYMENT (recap + embed) ──────────────────────── */}
        {step === 'payment' && (
          <div className="flex flex-col gap-5">
            {selectedPlan && <Recap planName={selectedPlan.name} price={price} days={days} email={email} />}
            <BackButton onClick={() => setStep('review')} label="Back to review" />
          </div>
        )}

        {/* THE SINGLE PERSISTENT EMBED — mounts once a real session exists and
            stays mounted; hidden off-screen until the payment step so it can
            initialise during the loader, then revealed once it reports ready. */}
        {embedReady && (
          <div
            className={step === 'payment' ? 'mt-6' : ''}
            {...(step !== 'payment'
              ? {
                  'aria-hidden': true as const,
                  style: {
                    position: 'absolute' as const,
                    width: 1,
                    height: 1,
                    overflow: 'hidden' as const,
                    clipPath: 'inset(50%)',
                    pointerEvents: 'none' as const,
                  },
                }
              : {})}
          >
            <WhopPayment
              planId={whopPlanId!}
              sessionId={sessionId!}
              orderId={orderId!}
              email={email}
              address={address}
              billingSame
              onComplete={handleComplete}
              onStateChange={handleEmbedStateChange}
            />
          </div>
        )}

        <p className="mt-8 text-center text-xs text-neutral-400">
          Questions?{' '}
          <Link href="/support" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
            Contact support
          </Link>
        </p>
      </div>
    </Container>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="my-8 flex items-center">
      {STEP_LABELS.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors',
                  done && 'bg-[var(--omni-brand)] text-white',
                  active && 'border-2 border-[var(--omni-brand)] bg-white text-[var(--omni-brand)]',
                  !done && !active && 'border border-neutral-300 bg-white text-neutral-400',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  active ? 'text-neutral-900' : 'text-neutral-400',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <span className={cn('mx-2 h-px flex-1', done ? 'bg-[var(--omni-brand)]' : 'bg-neutral-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function QuestionGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string
  options: string[]
  value: string | null
  onSelect: (v: string) => void
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-neutral-800">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                active
                  ? 'border-violet-400 bg-violet-50 text-violet-800'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AgreeCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
      <span
        className={cn(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border-2 transition-colors',
          checked ? 'border-violet-600 bg-violet-600' : 'border-neutral-300',
        )}
        aria-hidden
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="leading-relaxed">{children}</span>
    </label>
  )
}

function Recap({ planName, price, days, email }: { planName: string; price: string; days: number; email: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-neutral-950">{planName}</p>
          <p className="text-xs text-neutral-500">Renews every {days} days</p>
        </div>
        <span className="font-display text-base font-semibold text-neutral-950">{price}</span>
      </div>
      {email && (
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
          <span className="text-xs uppercase tracking-wide text-neutral-400">Email</span>
          <span className="truncate text-sm text-neutral-700">{email}</span>
        </div>
      )}
    </div>
  )
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 self-center text-sm text-neutral-500 transition-colors hover:text-neutral-800"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  )
}

function PreparingLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 py-8"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-900">Getting your secure checkout ready</p>
        <p className="mt-1 text-xs text-neutral-500">One moment while we prepare payment.</p>
      </div>
    </div>
  )
}
