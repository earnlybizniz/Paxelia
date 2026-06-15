/**
 * app/api/support/route.ts
 * Receives the contact form POST and sends it via Resend.
 *
 * Env vars required:
 *   RESEND_API_KEY        — Resend secret key (server-only)
 *   SUPPORT_FROM_EMAIL    — Verified "from" domain address, e.g. noreply@alder.com
 *
 * Recipient is always POLICY_CONFIG.supportEmail (single source of truth).
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { POLICY_CONFIG } from '@/lib/policies-config'

const SUPPORT_EMAIL = POLICY_CONFIG.supportEmail

async function sendSupportEmail({
  name,
  email,
  topic,
  orderRef,
  message,
}: {
  name: string
  email: string
  topic: string
  orderRef: string
  message: string
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.SUPPORT_FROM_EMAIL ?? `noreply@${new URL(POLICY_CONFIG.siteUrl).hostname}`

  await resend.emails.send({
    from:     fromEmail,
    to:       SUPPORT_EMAIL,
    replyTo:  email,
    subject:  `[Support] ${topic} — ${name}`,
    text: [
      `Name:          ${name}`,
      `Email:         ${email}`,
      `Topic:         ${topic}`,
      `Order ref:     ${orderRef || '—'}`,
      ``,
      `Message:`,
      message,
    ].join('\n'),
    html: `
      <table style="font-family:sans-serif;font-size:14px;color:#1c1a17;max-width:600px">
        <tr><td style="padding:8px 0"><strong>Name:</strong> ${escHtml(name)}</td></tr>
        <tr><td style="padding:8px 0"><strong>Email:</strong> ${escHtml(email)}</td></tr>
        <tr><td style="padding:8px 0"><strong>Topic:</strong> ${escHtml(topic)}</td></tr>
        <tr><td style="padding:8px 0"><strong>Order ref:</strong> ${escHtml(orderRef || '—')}</td></tr>
        <tr><td style="padding:24px 0 8px"><strong>Message:</strong></td></tr>
        <tr><td style="white-space:pre-wrap;background:#f4f1ea;padding:16px;border-radius:6px">${escHtml(message)}</td></tr>
      </table>
    `,
  })
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, topic, orderRef, message, company } = body as Record<string, string>

  // Honeypot — silently drop if filled
  if (company) {
    return NextResponse.json({ ok: true })
  }

  // Server-side validation
  if (!name?.trim())    return NextResponse.json({ error: 'Name is required.' },    { status: 400 })
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  try {
    await sendSupportEmail({
      name:     name.trim(),
      email:    email.trim(),
      topic:    topic?.trim() || 'General',
      orderRef: orderRef?.trim() || '',
      message:  message.trim(),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[support] Resend error:', err)
    return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 })
  }
}
