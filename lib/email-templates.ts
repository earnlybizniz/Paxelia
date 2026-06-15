/**
 * lib/email-templates.ts
 * Shared, brand-styled HTML email templates (Shopify-style) used by:
 *   - app/api/whop/webhook/route.ts   → order confirmation (on payment success)
 *   - app/api/admin/fulfill/route.ts  → shipping / tracking notification
 *
 * Both emails share one consistent visual system (header, line item, totals,
 * shipping address, footer) so the customer sees a coherent brand experience
 * from purchase through delivery. Colors are pulled from the single brand
 * palette in lib/home-content.ts so they stay in sync with the storefront.
 *
 * NOTE on product images: product photos are not yet wired (gallery uses
 * gradient placeholders), so the line item renders a styled placeholder tile.
 * When real images exist, pass `productImageUrl` and it will render instead.
 */
import { HOME } from '@/lib/home-content'
import { ALDER_PRODUCT, getVariantHeroImageSrc, sizeLabel as canonicalSizeLabel, sizeDimensions, finishLabel } from '@/lib/pdp-product'

// ---- Types -----------------------------------------------------------------

export interface EmailOrder {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  variant_id?: string | null            // 'sm' | 'md' | 'lg'
  finish_id?: string | null             // 'mocha' | 'white' — drives the line-item image
  subtotal?: number | null
  shipping?: number | null
  total?: number | null
  currency?: string | null
  shipping_address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  } | null
}

export interface ShippingInfo {
  trackingNumber: string
  trackingUrl: string
}

// ---- Brand tokens (from the single source palette) -------------------------

const BRAND = HOME.brand.name
const PALETTE = HOME.brand.palette
const ACCENT = PALETTE.accent           // walnut
const ACCENT_DEEP = PALETTE.accentDeep
const INK = PALETTE.ink
const INK_SOFT = PALETTE.inkSoft
const INK_MUTE = PALETTE.inkMute
const PAPER = PALETTE.paper             // white
const PAPER2 = PALETTE.paper2           // faint grey-white (cards)
const PAPER3 = PALETTE.paper3           // border grey
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

// ---- Product / variant helpers ---------------------------------------------

const PRODUCT_NAME = ALDER_PRODUCT.name

/** Size label + dimensions for the line item — sourced from the single product
 *  config (lib/pdp-product) so the email can never drift from the storefront,
 *  cart, checkout summary, and thank-you page. */
function sizeLabel(variantId?: string | null): { name: string; sub: string } {
  return { name: canonicalSizeLabel(variantId), sub: sizeDimensions(variantId) }
}

function money(amount: number | null | undefined, currency?: string | null): string {
  const n = typeof amount === 'number' ? amount : 0
  const cur = (currency ?? 'USD').toUpperCase()
  const symbol = cur === 'USD' ? '$' : ''
  return `${symbol}${n.toFixed(2)}${symbol ? '' : ' ' + cur}`
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---- Reusable HTML blocks ---------------------------------------------------

/** Product line-item row: image/placeholder + name + size + price. */
function lineItemBlock(order: EmailOrder): string {
  const size = sizeLabel(order.variant_id)
  const price = money(order.subtotal ?? order.total, order.currency)

  // Variant hero image (first image of the chosen finish's gallery). Emails need
  // an ABSOLUTE URL, so we prefix the relative path with SITE_URL. If we have no
  // finish or no SITE_URL, fall back to the gradient placeholder tile.
  const relImg = getVariantHeroImageSrc(ALDER_PRODUCT, order.finish_id ?? undefined)
  const absImg = relImg && SITE_URL ? `${SITE_URL}${relImg}` : ''
  const imageCell = absImg
    ? `
    <td width="72" style="vertical-align:top;padding-right:16px;">
      <img src="${absImg}" width="72" height="72" alt="${escapeHtml(PRODUCT_NAME)}" style="display:block;width:72px;height:72px;border-radius:8px;border:1px solid ${PAPER3};object-fit:cover;" />
    </td>`
    : `
    <td width="72" style="vertical-align:top;padding-right:16px;">
      <div style="width:72px;height:72px;border-radius:8px;background:linear-gradient(135deg,#ece8e1 0%,#c9b9a4 100%);border:1px solid ${PAPER3};"></div>
    </td>`
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        ${imageCell}
        <td style="vertical-align:top;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:${INK};">${PRODUCT_NAME}</p>
          <p style="margin:0;font-size:13px;color:${INK_MUTE};">Size: ${size.name}${size.sub ? ` &middot; ${size.sub}` : ''}</p>
          ${order.finish_id ? `<p style="margin:2px 0 0;font-size:13px;color:${INK_MUTE};">Finish: ${escapeHtml(finishLabel(order.finish_id))}</p>` : ''}
          <p style="margin:6px 0 0;font-size:13px;color:${INK_MUTE};">Qty: 1</p>
        </td>
        <td width="90" style="vertical-align:top;text-align:right;">
          <p style="margin:0;font-size:15px;font-weight:600;color:${INK};">${price}</p>
        </td>
      </tr>
    </table>`
}

/** Totals block: subtotal / shipping / total. */
function totalsBlock(order: EmailOrder): string {
  const subtotal = money(order.subtotal ?? order.total, order.currency)
  const shippingVal = (order.shipping ?? 0) === 0 ? 'Free' : money(order.shipping, order.currency)
  const total = money(order.total, order.currency)
  const row = (label: string, value: string, bold = false) => `
    <tr>
      <td style="padding:6px 0;font-size:${bold ? '16px' : '14px'};color:${bold ? INK : INK_SOFT};${bold ? 'font-weight:700;' : ''}">${label}</td>
      <td style="padding:6px 0;font-size:${bold ? '16px' : '14px'};color:${bold ? INK : INK_SOFT};text-align:right;${bold ? 'font-weight:700;' : ''}">${value}</td>
    </tr>`
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${row('Subtotal', subtotal)}
      ${row('Shipping', shippingVal)}
      <tr><td colspan="2" style="border-top:1px solid ${PAPER3};padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>
      ${row('Total', total, true)}
    </table>`
}

/** Shipping address block. Returns '' if no address present. */
function addressBlock(order: EmailOrder): string {
  const a = order.shipping_address
  if (!a || !a.line1) return ''
  const name = [order.first_name, order.last_name].filter(Boolean).join(' ').trim()
  const cityLine = [a.city, a.state].filter(Boolean).join(', ')
  const lines = [
    name && escapeHtml(name),
    a.line1 && escapeHtml(a.line1),
    a.line2 && escapeHtml(a.line2),
    [cityLine, a.postalCode].filter(Boolean).join(' '),
    a.country && escapeHtml(a.country),
  ].filter(Boolean)
  return `
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${INK_MUTE};">Shipping to</p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:${INK_SOFT};">
      ${lines.map(l => escapeHtml(String(l))).join('<br />')}
    </p>`
}

/** Outer shell: wraps body content in the branded card layout. */
function shell(opts: { title: string; preheader: string; headerTitle: string; bodyHtml: string }): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER2};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${INK};">
  <!-- preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${PAPER2};padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:${PAPER};border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:${ACCENT};padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);">${escapeHtml(BRAND)}</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">${escapeHtml(opts.headerTitle)}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:40px;">${opts.bodyHtml}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid ${PAPER3};text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:${INK_MUTE};">
              Questions? Email us at
              <a href="mailto:${process.env.SUPPORT_FROM_EMAIL ?? ''}" style="color:${ACCENT};text-decoration:none;">${process.env.SUPPORT_FROM_EMAIL ?? 'support'}</a>
              ${SITE_URL ? ` or visit our <a href="${SITE_URL}/support" style="color:${ACCENT};text-decoration:none;">support page</a>` : ''}.
            </p>
            <p style="margin:0;font-size:12px;color:#aaa;">&copy; ${year} ${escapeHtml(BRAND)}. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Card wrapper used for the order-summary section inside the body. */
function summaryCard(inner: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${PAPER2};border:1px solid ${PAPER3};border-radius:10px;margin:0 0 24px;">
      <tr><td style="padding:24px;">${inner}</td></tr>
    </table>`
}

// ---- Public template renderers ---------------------------------------------

/**
 * Order confirmation email — sent the moment payment succeeds.
 * Shopify-style: greeting, order #, line item, totals, shipping address,
 * and a "what's next" note. Returns { subject, html }.
 */
export function renderOrderConfirmationEmail(order: EmailOrder): { subject: string; html: string } {
  const sid = shortId(order.id)
  const firstName = (order.first_name ?? '').trim() || 'there'
  const subject = `Order confirmed — #${sid} · ${BRAND}`

  const body = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK};">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${INK_SOFT};">
      Thanks for your order! We've received it and will begin preparing your desk right away.
      Here's a summary of what's on its way.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
      <tr>
        <td style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${INK_MUTE};">Order number</td>
        <td style="text-align:right;font-size:14px;font-family:monospace;color:${INK};">#${sid}</td>
      </tr>
    </table>

    ${summaryCard(`
      ${lineItemBlock(order)}
      <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
      <div style="border-top:1px solid ${PAPER3};height:1px;line-height:1px;font-size:0;margin:0 0 16px;">&nbsp;</div>
      ${totalsBlock(order)}
    `)}

    ${addressBlock(order) ? summaryCard(addressBlock(order)) : ''}

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:8px 0 0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${INK_MUTE};">What's next</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:${INK_SOFT};">
          We'll carefully prepare and pack your desk within 1–2 business days, then email you a
          tracking link as soon as it ships. Delivery typically takes 5–12 business days.
          Some assembly is required — full instructions are included in the box.
        </p>
      </td></tr>
    </table>`

  return {
    subject,
    html: shell({
      title: subject,
      preheader: `Your ${BRAND} order #${sid} is confirmed — here's your summary.`,
      headerTitle: 'Order confirmed',
      bodyHtml: body,
    }),
  }
}

/**
 * Shipping / tracking email — sent when the order is marked fulfilled.
 * Shares the same summary layout, plus a prominent tracking CTA.
 */
export function renderShippingEmail(order: EmailOrder, shipping: ShippingInfo): { subject: string; html: string } {
  const sid = shortId(order.id)
  const firstName = (order.first_name ?? '').trim() || 'there'
  const subject = `Your ${BRAND} order is on its way — #${sid}`

  const body = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK};">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${INK_SOFT};">
      Great news — your order has been packed and shipped. You can track its journey using the
      button below.
    </p>

    <!-- Tracking card -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${PAPER2};border:1px solid ${PAPER3};border-radius:10px;margin:0 0 24px;">
      <tr><td style="padding:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${INK_MUTE};">Order</p>
              <p style="margin:0;font-size:14px;font-family:monospace;color:${INK};">#${sid}</p>
            </td>
            <td style="text-align:right;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${INK_MUTE};">Tracking</p>
              <p style="margin:0;font-size:14px;font-family:monospace;color:${INK};">${escapeHtml(shipping.trackingNumber)}</p>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:20px;">
          <a href="${escapeHtml(shipping.trackingUrl)}"
             style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;">
            Track your order
          </a>
        </div>
      </td></tr>
    </table>

    ${summaryCard(`
      ${lineItemBlock(order)}
      <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
      <div style="border-top:1px solid ${PAPER3};height:1px;line-height:1px;font-size:0;margin:0 0 16px;">&nbsp;</div>
      ${totalsBlock(order)}
    `)}

    ${addressBlock(order) ? summaryCard(addressBlock(order)) : ''}

    <p style="margin:8px 0 0;font-size:13px;line-height:1.7;color:${INK_MUTE};">
      Delivery typically takes 5–12 business days. Some assembly is required — instructions are
      included in the box.
    </p>`

  return {
    subject,
    html: shell({
      title: subject,
      preheader: `Your ${BRAND} order #${sid} has shipped — track it here.`,
      headerTitle: 'Your order is on its way',
      bodyHtml: body,
    }),
  }
}