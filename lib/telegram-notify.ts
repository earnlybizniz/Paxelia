/**
 * lib/telegram-notify.ts
 *
 * SELF-CONTAINED, FAIL-SILENT Telegram notifier for the RETAIL store.
 *
 * Isolation guarantees (do not break these):
 *   - imports NOTHING from Supabase / Meta / Resend / the Whop SDK / product config
 *   - only reads an inbound webhook payload and posts a message to Telegram
 *   - every exported function swallows its own errors and never throws
 *
 * Fully env-driven so the repo re-skins as a template. To point notifications at
 * a brand-new store you only set:
 *   TELEGRAM_BOT_TOKEN          (required)  bot token from @BotFather
 *   TELEGRAM_CHAT_ID            (required)  chat / channel id to post into
 *   WHOP_NOTIFY_WEBHOOK_SECRET  (required)  secret of the SEPARATE Whop webhook
 *   TELEGRAM_STORE_LABEL        (optional)  store name shown in every message (default "Store")
 *
 * Whop sends amounts in dollars, so amounts are shown as-is. No product name or
 * price is hardcoded — amount / customer / product all come from the live payload.
 */
import { Webhook, WebhookVerificationError } from 'standardwebhooks'

// ── Config readers ────────────────────────────────────────────────────────────
const botToken     = () => process.env.TELEGRAM_BOT_TOKEN ?? ''
const chatId       = () => process.env.TELEGRAM_CHAT_ID ?? ''
const notifySecret = () => process.env.WHOP_NOTIFY_WEBHOOK_SECRET ?? ''
const storeLabel   = () => (process.env.TELEGRAM_STORE_LABEL ?? 'Store').trim()

/** Telegram side is usable only once a bot token + chat id are present. */
export function notifyConfigured(): boolean {
  return Boolean(botToken() && chatId())
}
/** The inbound webhook can only be verified once its own secret is present. */
export function notifySecretConfigured(): boolean {
  const s = notifySecret()
  return Boolean(s) && !s.includes('placeholder')
}

// ── Signature verification (its OWN secret; mirrors lib/whop.ts, shares nothing)
export { WebhookVerificationError }
export function verifyNotifyWebhook(
  rawBody: string,
  headers: Record<string, string | null>,
): unknown {
  const secret = notifySecret()
  if (!secret || secret.includes('placeholder')) {
    throw new WebhookVerificationError('WHOP_NOTIFY_WEBHOOK_SECRET is not set')
  }
  // standardwebhooks base64-DECODES the secret (and strips a `whsec_` prefix),
  // so a raw secret must be base64-ENCODED first.
  const encoded = secret.startsWith('whsec_')
    ? secret
    : Buffer.from(secret, 'utf8').toString('base64')
  const wh = new Webhook(encoded)

  const h: Record<string, string> = {}
  if (headers['webhook-id'])        h['webhook-id']        = headers['webhook-id']!
  if (headers['webhook-timestamp']) h['webhook-timestamp'] = headers['webhook-timestamp']!
  if (headers['webhook-signature']) h['webhook-signature'] = headers['webhook-signature']!

  return wh.verify(rawBody, h)
}

// ── Defensive payload helpers ─────────────────────────────────────────────────
type AnyRec = Record<string, unknown>
const asRec = (v: unknown): AnyRec => (v && typeof v === 'object' ? (v as AnyRec) : {})

/** Escape text for Telegram parse_mode=HTML so values can't break the message. */
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
function firstString(...vals: unknown[]): string | null {
  for (const v of vals) if (typeof v === 'string' && v.trim()) return v.trim()
  return null
}
function firstNumber(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}

// Whop sends amounts in dollars (e.g. 99.99) — display as-is.
function money(d: AnyRec): string | null {
  const amt = firstNumber(
    d.final_amount, d.subtotal, d.amount, d.total, d.amount_after_fees,
    d.gross_amount, d.net_amount, d.disputed_amount, d.refunded_amount,
  )
  if (amt === null) return null
  const cur = (firstString(d.currency, asRec(d.plan).base_currency) ?? 'usd').toUpperCase()
  return `${cur} ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
function customer(d: AnyRec): string | null {
  const user = asRec(d.user), member = asRec(d.member)
  return firstString(user.email, d.email, d.user_email, member.email, user.username, d.username)
}
function product(d: AnyRec): string | null {
  const plan = asRec(d.plan), ap = asRec(d.access_pass), prod = asRec(d.product), mem = asRec(d.membership)
  return firstString(plan.name, plan.title, ap.title, ap.name, prod.title, prod.name, asRec(mem.product).title)
}
function nameOf(d: AnyRec): string | null {
  const user = asRec(d.user), idn = asRec(d.identity)
  return firstString(d.name, d.full_name, user.name, user.username, idn.name, idn.full_name)
}
function reasonOf(d: AnyRec): string | null {
  return firstString(
    d.reason, d.decline_reason, d.failure_reason, d.rejection_reason,
    d.required_action, d.action_required, d.decision, d.resolution,
    d.description, d.message, d.detail, d.details,
  )
}
function methodOf(d: AnyRec): string | null {
  const pm = asRec(d.payout_method), dest = asRec(d.destination)
  const brand = firstString(d.brand, d.bank_name, d.payout_method_type, d.method_type, d.type, pm.type, pm.bank_name, dest.bank_name)
  const last4 = firstString(d.last4, d.last_four, pm.last4, pm.last_four, dest.last4)
  if (brand && last4) return `${brand} ••••${last4}`
  if (last4) return `••••${last4}`
  return brand
}
const idOf      = (d: AnyRec) => firstString(d.id, d.payment_id, d.withdrawal_id, d.membership_id, d.receipt_id, d.case_id, d.profile_id)
const statusOf  = (d: AnyRec) => firstString(d.status, d.dispute_status, d.case_status, d.account_status, d.profile_status, d.verification_status, d.state)
const typeOf    = (d: AnyRec) => firstString(d.type, d.case_type, d.category, d.kind)
const outcomeOf = (d: AnyRec) => firstString(d.outcome, d.decision, d.resolution, d.result)

// ── Row builders ──────────────────────────────────────────────────────────────
const row = (emoji: string, label: string, value: string | null): string | null =>
  value ? `${emoji} ${label}${esc(value)}` : null
const codeRow = (emoji: string, value: string | null): string | null =>
  value ? `${emoji} <code>${esc(value)}</code>` : null

type Msg = { emoji: string; headline: string; rows: (string | null)[] }

// ── Bespoke templates for the events that matter most ─────────────────────────
// Event names are normalised (lowercased, dots → underscores) before lookup, so
// `payment.succeeded` and `payment_succeeded` both resolve to the same template.
function bespoke(key: string, d: AnyRec): Msg | null {
  switch (key) {
    // ───── Payments ─────
    case 'payment_succeeded':
      return { emoji: '🎉', headline: 'New order — payment received',
        rows: [row('💳', '', money(d)), row('👤', '', customer(d)), row('📦', '', product(d)), codeRow('🔖', idOf(d))] }
    case 'payment_failed':
      return { emoji: '⚠️', headline: 'Payment failed',
        rows: [row('💳', '', money(d)), row('👤', '', customer(d)), row('📦', '', product(d)), codeRow('🔖', idOf(d))] }

    // ───── Refunds ─────
    case 'refund_created':
      return { emoji: '↩️', headline: 'Refund issued',
        rows: [row('💸', '', money(d)), row('👤', '', customer(d)), row('📝', 'Reason: ', reasonOf(d)), codeRow('🔖', idOf(d))] }
    case 'refund_updated':
      return { emoji: '🔄', headline: 'Refund updated',
        rows: [row('💸', '', money(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }

    // ───── Disputes / chargebacks ─────
    case 'dispute_created':
      return { emoji: '🚨', headline: 'Dispute opened',
        rows: [row('💳', 'Amount at risk: ', money(d)), row('👤', '', customer(d)), row('📝', 'Reason: ', reasonOf(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'dispute_updated':
      return { emoji: '⚖️', headline: 'Dispute updated',
        rows: [row('💳', '', money(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }

    // ───── Payouts / withdrawals ─────
    case 'withdrawal_created':
      return { emoji: '🏦', headline: 'Withdrawal initiated',
        rows: [row('💰', '', money(d)), row('📊', 'Status: ', statusOf(d)), row('🏧', 'To: ', methodOf(d)), codeRow('🔖', idOf(d))] }
    case 'withdrawal_updated':
      return { emoji: '🏦', headline: 'Withdrawal updated',
        rows: [row('💰', '', money(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'payout_method_created':
      return { emoji: '🏧', headline: 'Payout method added',
        rows: [row('🏦', '', methodOf(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'payout_account_status_updated':
      return { emoji: '🧾', headline: 'Payout account status changed',
        rows: [row('📊', 'Status: ', statusOf(d)), row('📝', '', reasonOf(d)), codeRow('🔖', idOf(d))] }

    // ───── Identity / verification (KYC) ─────
    case 'verification_succeeded':
      return { emoji: '🛡️', headline: 'Verification succeeded',
        rows: [row('👤', '', nameOf(d) ?? customer(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'identity_profile_approved':
      return { emoji: '✅', headline: 'Identity approved',
        rows: [row('👤', '', nameOf(d) ?? customer(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'identity_profile_rejected':
      return { emoji: '❌', headline: 'Identity rejected',
        rows: [row('👤', '', nameOf(d) ?? customer(d)), row('📝', 'Reason: ', reasonOf(d)), codeRow('🔖', idOf(d))] }
    case 'identity_profile_needs_action':
      return { emoji: '⚠️', headline: 'Identity needs action',
        rows: [row('👤', '', nameOf(d) ?? customer(d)), row('📝', 'Action: ', reasonOf(d)), codeRow('🔖', idOf(d))] }
    case 'identity_profile_updated':
      return { emoji: '🪪', headline: 'Identity profile updated',
        rows: [row('👤', '', nameOf(d) ?? customer(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }

    // ───── Resolution center ─────
    case 'resolution_center_case_created':
      return { emoji: '🗂️', headline: 'Resolution case opened',
        rows: [row('💳', '', money(d)), row('📋', 'Type: ', typeOf(d)), row('📝', 'Reason: ', reasonOf(d)), row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'resolution_center_case_updated':
      return { emoji: '🗂️', headline: 'Resolution case updated',
        rows: [row('📊', 'Status: ', statusOf(d)), codeRow('🔖', idOf(d))] }
    case 'resolution_center_case_decided':
      return { emoji: '⚖️', headline: 'Resolution case decided',
        rows: [row('🏁', 'Outcome: ', outcomeOf(d) ?? statusOf(d)), row('💳', '', money(d)), codeRow('🔖', idOf(d))] }

    default:
      return null
  }
}

// ── Graceful fallback for any other event you happen to subscribe to ──────────
function fallback(eventName: string, d: AnyRec): Msg {
  const e = eventName.toLowerCase()
  if (e.includes('member') || e.includes('subscription') || e.includes('entry')) {
    const ended = /invalid|deactiv|cancel|expire|past_due|ended/.test(e)
    return ended
      ? { emoji: '🚪', headline: 'Membership ended', rows: [row('👤', '', customer(d)), row('📦', '', product(d)), row('📊', '', statusOf(d))] }
      : { emoji: '✅', headline: 'New member', rows: [row('👤', '', customer(d)), row('📦', '', product(d))] }
  }
  return { emoji: '🔔', headline: 'Whop event',
    rows: [codeRow('🏷️', eventName || 'unknown'), row('💳', '', money(d)), row('👤', '', customer(d)), row('📦', '', product(d)), row('📊', '', statusOf(d))] }
}

/** Build the full message text for an event, or null if there's nothing to send. */
export function buildMessage(eventName: string, data: AnyRec): string | null {
  const key = (eventName || '').toLowerCase().replace(/\./g, '_').trim()
  const msg = bespoke(key, data) ?? fallback(eventName, data)
  const body = msg.rows.filter(Boolean).join('\n')
  const header = `${msg.emoji} <b>${esc(msg.headline)}</b>\n<i>${esc(storeLabel())}</i>`
  return body ? `${header}\n\n${body}` : header
}

// ── Send to Telegram (never throws, time-bounded) ─────────────────────────────
export async function sendTelegram(text: string): Promise<boolean> {
  try {
    if (!notifyConfigured()) return false
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(`https://api.telegram.org/bot${botToken()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId(), text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer))
    if (!res.ok) { console.error('[notify] Telegram sendMessage non-OK:', res.status); return false }
    return true
  } catch (err) {
    console.error('[notify] Telegram send failed:', err)
    return false
  }
}

/** High-level: classify → build → send. Never throws. */
export async function notifyFromWebhook(eventName: string, data: AnyRec): Promise<void> {
  try {
    const text = buildMessage(eventName, data)
    if (text) await sendTelegram(text)
  } catch (err) {
    console.error('[notify] notifyFromWebhook failed:', err)
  }
}
