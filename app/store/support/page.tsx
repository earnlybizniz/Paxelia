/**
 * app/store/support/page.tsx
 * User-facing path: /support  (middleware rewrites → /store/support)
 *
 * Subject-tabbed FAQ + contact form → /api/support → Resend.
 * All FAQ answers interpolate POLICY_CONFIG so they auto-match any brand.
 * ABSOLUTE RULE: nothing on this page mentions subscriptions, recurring charges,
 * auto-renewal, saved payment methods, rebilling, or repeat billing.
 */
'use client'

import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, Mail } from 'lucide-react'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { SUPPORT_CONFIG } from '@/lib/support-config'
import { POLICY_CONFIG } from '@/lib/policies-config'
import { E } from '@/lib/motion'
import { cn } from '@/lib/utils'

const SUPPORT_EMAIL = POLICY_CONFIG.supportEmail

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqItem({ q, a, groupId, idx }: { q: string; a: string; groupId: string; idx: number }) {
  const [open, setOpen] = useState(false)
  const panelId = `faq-${groupId}-${idx}-panel`
  const btnId   = `faq-${groupId}-${idx}-btn`

  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }}>
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-[3px]"
        style={{ color: open ? 'var(--accent)' : 'var(--ink)' }}
      >
        <span className="font-sans text-[0.9rem] font-medium leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: E }}
          className="flex-shrink-0"
          aria-hidden
        >
          <ChevronDown size={16} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: E }}
            style={{ overflow: 'hidden' }}
          >
            <p className="font-sans text-[0.875rem] leading-relaxed pb-4" style={{ color: 'var(--ink-soft)' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

type FormState = 'idle' | 'sending' | 'success' | 'error'

function ContactForm() {
  const id = useId()
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields, setFields] = useState({
    name:     '',
    email:    '',
    topic:    SUPPORT_CONFIG.contactTopics[0],
    orderRef: '',
    message:  '',
    company:  '', // honeypot — never shown to user
  })

  const set = (k: keyof typeof fields) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields(p => ({ ...p, [k]: e.target.value }))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/support', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Unknown error')
      setState('success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setErrorMsg(msg)
      setState('error')
    }
  }

  const inputCls = cn(
    'w-full py-3.5 px-4 rounded-[6px] border font-sans text-[0.875rem] bg-[var(--paper)]',
    'text-[var(--ink)] placeholder:text-[var(--ink-mute)] outline-none transition-colors',
    'focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]',
  )
  const borderStyle = { borderColor: 'color-mix(in srgb, var(--ink) 18%, transparent)' }

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: E }}
        className="py-10 text-center flex flex-col items-center gap-3"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}
          aria-hidden
        >
          <Mail size={22} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
        </div>
        <p className="font-display text-[1.25rem] font-normal" style={{ color: 'var(--ink)' }}>
          Message sent.
        </p>
        <p className="font-sans text-[0.875rem]" style={{ color: 'var(--ink-soft)' }}>
          Thanks — we&apos;ll reply within 1 business day.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot — visually hidden, never filled by real users */}
      <input
        type="text"
        name="company"
        value={fields.company}
        onChange={set('company')}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="font-sans text-[0.78rem] font-medium" style={{ color: 'var(--ink-soft)' }}>
            Name <span aria-hidden style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            value={fields.name}
            onChange={set('name')}
            className={inputCls}
            style={borderStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="font-sans text-[0.78rem] font-medium" style={{ color: 'var(--ink-soft)' }}>
            Email <span aria-hidden style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={fields.email}
            onChange={set('email')}
            className={inputCls}
            style={borderStyle}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-topic`} className="font-sans text-[0.78rem] font-medium" style={{ color: 'var(--ink-soft)' }}>
            Topic
          </label>
          <select
            id={`${id}-topic`}
            value={fields.topic}
            onChange={set('topic')}
            className={cn(inputCls, 'cursor-pointer')}
            style={borderStyle}
          >
            {SUPPORT_CONFIG.contactTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-order`} className="font-sans text-[0.78rem] font-medium" style={{ color: 'var(--ink-soft)' }}>
            Order reference <span className="font-normal" style={{ color: 'var(--ink-mute)' }}>(optional)</span>
          </label>
          <input
            id={`${id}-order`}
            type="text"
            autoComplete="off"
            placeholder="e.g. ord_abc123"
            value={fields.orderRef}
            onChange={set('orderRef')}
            className={inputCls}
            style={borderStyle}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-message`} className="font-sans text-[0.78rem] font-medium" style={{ color: 'var(--ink-soft)' }}>
          Message <span aria-hidden style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <textarea
          id={`${id}-message`}
          required
          rows={5}
          placeholder="How can we help?"
          value={fields.message}
          onChange={set('message')}
          className={cn(inputCls, 'resize-y min-h-[120px]')}
          style={borderStyle}
        />
      </div>

      {state === 'error' && (
        <p role="alert" className="font-sans text-[0.82rem]" style={{ color: '#c0392b' }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="self-start py-3.5 px-8 rounded-[6px] font-sans text-[0.9rem] font-medium transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<string>(SUPPORT_CONFIG.groups[0].id)
  const activeGroup = SUPPORT_CONFIG.groups.find(g => g.id === activeTab) ?? SUPPORT_CONFIG.groups[0]

  return (
    <>
      <ThemeStyle />
      <Grain />
      <SiteHeader />

      <main id="main" style={{ backgroundColor: 'var(--paper)' }}>

        {/* ── Hero ── */}
        <section
          aria-labelledby="support-heading"
          className="pt-20 pb-14 px-5 md:px-10"
        >
          <div className="mx-auto max-w-[760px] text-center flex flex-col gap-3">
            <Reveal>
              <p className="font-sans text-[0.72rem] uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                {SUPPORT_CONFIG.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.07}>
              <h1
                id="support-heading"
                className="font-display font-normal text-balance leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--ink)' }}
              >
                {SUPPORT_CONFIG.headline}
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="font-sans text-[0.95rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {SUPPORT_CONFIG.sub}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Tabbed FAQ ── */}
        <section
          aria-label="Frequently asked questions"
          className="pb-20 px-5 md:px-10"
        >
          <div className="mx-auto max-w-[760px]">

            {/* Tab row — horizontal scroll on mobile */}
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="flex gap-2 overflow-x-auto pb-1 mb-8 no-scrollbar"
            >
              {SUPPORT_CONFIG.groups.map(g => {
                const active = g.id === activeTab
                return (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`faq-panel-${g.id}`}
                    id={`faq-tab-${g.id}`}
                    onClick={() => setActiveTab(g.id)}
                    className={cn(
                      'whitespace-nowrap flex-shrink-0 py-2 px-4 rounded-full font-sans text-[0.82rem] font-medium',
                      'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
                    )}
                    style={
                      active
                        ? { backgroundColor: 'var(--accent)', color: 'var(--paper)' }
                        : {
                            backgroundColor: 'color-mix(in srgb, var(--ink) 7%, transparent)',
                            color: 'var(--ink-soft)',
                          }
                    }
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>

            {/* FAQ panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                role="tabpanel"
                id={`faq-panel-${activeTab}`}
                aria-labelledby={`faq-tab-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: E }}
                className="rounded-[10px] border overflow-hidden"
                style={{
                  borderColor: 'color-mix(in srgb, var(--ink) 10%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--paper2, #f5f5f4) 60%, var(--paper))',
                }}
              >
                <div className="px-5 md:px-7">
                  {activeGroup.faqs.map((faq, i) => (
                    <FaqItem
                      key={i}
                      q={faq.q}
                      a={faq.a}
                      groupId={activeTab}
                      idx={i}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Contact form ── */}
        <section
          aria-labelledby="contact-heading"
          className="pb-24 px-5 md:px-10"
        >
          <div className="mx-auto max-w-[760px]">

            {/* Divider */}
            <div
              className="mb-12 h-px w-full"
              style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }}
              aria-hidden
            />

            <Reveal staggerChildren={0.07}>
              <RevealItem>
                <h2
                  id="contact-heading"
                  className="font-display font-normal mb-2 leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--ink)' }}
                >
                  Still need help?
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="font-sans text-[0.9rem] mb-8 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Fill in the form below and we&apos;ll get back to you within 1 business day.
                  Prefer email?{' '}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="underline underline-offset-2 transition-colors hover:text-[var(--ink)]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </RevealItem>
            </Reveal>

            <ContactForm />
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}