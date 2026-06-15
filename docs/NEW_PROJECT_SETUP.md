# New Project Setup — ALDER Store Template

A complete, plain-English, step-by-step guide to go from a **fresh copy of this template** to a **store that's ready to take real orders**. Written for a non-developer. Follow the phases in order.

Estimated time with everything ready (accounts created, images + copy on hand): **about one focused day.** The slowest parts are real product photography and the final sandbox test — neither can be rushed.

---

## Overview — what you'll do
1. **Phase 1:** Create accounts (Supabase, Whop, Resend, optional Meta + Mapbox)
2. **Phase 2:** Set up the database (run the SQL)
3. **Phase 3:** Fill in your brand + product content (edit config files)
4. **Phase 4:** Set environment variables
5. **Phase 5:** Set up Whop (plans + webhook)
6. **Phase 6:** Set up Resend (verified domain)
7. **Phase 7:** Set up Meta (optional, for ads)
8. **Phase 8:** Sandbox test (prove it works before going live)
9. **Phase 9:** Go live

> The fastest way to do Phase 3 is to **give me (Claude) your details and I'll generate the config for you** — see `PROJECT_INTAKE.md`. This guide assumes you're filling things in either way.

---

## A note on the two "tenants"
This template ships with two storefronts behind the scenes: an **academy** side (`/edu`) and the **retail store** (`/store`) — which is the one you're selling the desk from. They're kept separate by the middleware and never link to each other. **You only work on the retail store.** Leave the `/edu` and `config/academy` files alone.

The retail store is reached by visiting your site with `?s=r` on the end the first time (e.g. `yourbrand.com/?s=r`). That sets a cookie that locks the visitor to the retail store from then on. (This is how the template hides retail behind a "secret" entry — you can change or remove this behavior later, but for setup just know that's how you reach the store.)

---

## Phase 1 — Create your accounts

Sign up for these (all have free tiers to start):
- **Supabase** (database) — [supabase.com](https://supabase.com) — **required**
- **Whop** (payments + merchant of record) — your Whop dashboard — **required**
- **Resend** (sends emails) — [resend.com](https://resend.com) — **required for emails**
- **Meta** (Pixel/ads tracking) — [business.facebook.com](https://business.facebook.com) — **optional**
- **Mapbox** (address autofill) — [mapbox.com](https://mapbox.com) — **optional but recommended**

Keep a notes file open — you'll collect keys/IDs from each as you go (they all go into your env vars in Phase 4).

---

## Phase 2 — Set up the database

Open `SUPABASE_SETUP.md` and run the six SQL steps in your Supabase SQL Editor, top to bottom. This creates the `orders` and `rebills` tables exactly as the code needs them.

When done, grab these two values from **Supabase → Project Settings → API** for later:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

---

## Phase 3 — Fill in your brand + product

This is where the store becomes *yours*. Edit these config files (details in `STORE_VARIABLES.md`):

### 3a. Brand identity — `lib/home-content.ts` (`brand` block)
- Brand name, logo wordmark
- Color palette (especially `accent` — your main brand color)
- Fonts (`display` for headings, `sans` for body)

### 3b. Brand contact & policies — `lib/policies-config.ts`
- Legal entity name, site URL, **support email**, mailing address, governing law
- Shipping times, return window, refund timing, who pays return shipping, warranty length
- Privacy toggles (CCPA/GDPR), "last updated" date

### 3c. Product — `lib/pdp-product.ts`
- Product name, eyebrow, badges
- **Price**: `basePrice` + each size's `priceDelta` (see "How variants work" below)
- **Variants**: sizes and finishes (ids + labels — see below)
- Gallery images, highlights, description paragraphs, materials, specs, "in the box", features, reviews, product FAQ

### 3d. Homepage — `lib/home-content.ts`
- Hero, problem/solution, feature rows, comparison table, reviews, story, guarantees, FAQ, final CTA, footer

### 3e. About page — `lib/about-config.ts`
- Hero, mission/values, craft, sustainability, closing CTA

### 3f. Support page — `lib/support-config.ts`
- FAQ groups + answers, contact form topics

### 3g. Images — `public/` folder
- Replace `logo.png`, `logo-inverse.png`, `favicon.png`
- Add your product photos (the gallery references image paths in `pdp-product.ts`)

> **Images are the one thing no template can generate.** Budget time for real product photography — for a premium product, the photos do a lot of the selling.

---

## How variants work (important)

Your product has **variants** — by default, **Size** (sm/md/lg) and **Finish** (walnut/oak/ash/ink). Two separate concepts:

- **Internal id** (e.g. `sm`, `md`, `lg`): the behind-the-scenes key. It must be **identical** in three places — the product axis in `lib/pdp-product.ts`, and the `WHOP_PLANS` + `VARIANT_PRICES` maps in `lib/whop-plans.ts`. The ids are arbitrary (`sm` could be anything) but must match across those files.
- **Display label** (e.g. `48"`, `Walnut`): what the customer sees. **You can name these anything** per project — they're independent of the ids.

So for a new project:
- ✅ You can freely rename **labels** (e.g. call the sizes "Petite / Standard / Grand").
- ✅ You can rename **ids** too — as long as you change them in **all three** spots together.
- ✅ You can change the **number** of variants (2 sizes, 5 sizes, etc.) — add/remove matching entries in the product axis, `WHOP_PLANS`, `VARIANT_PRICES`, **and** create the matching Whop plans + env plan ids.
- **Pricing is by SIZE only.** Finish is cosmetic (all finish `priceDelta`s are 0). The price for each size = `basePrice` + that size's `priceDelta`.

---

## Phase 4 — Set environment variables

Open `ENV_VARIABLES.md` and fill in every required variable. Put them in:
- `.env.local` while testing locally
- Your host (e.g. Vercel → Settings → Environment Variables) for production

Minimum to take orders: Site URL, Supabase (2), Whop (5), Resend (2), Admin (2).

---

## Phase 5 — Set up Whop (payments)

1. **Create one plan per size** in your Whop dashboard. Set each plan's price to match your product:
   - Small plan → $799 (or your sm price)
   - Medium plan → $899 (or your md price)
   - Large plan → $1049 (or your lg price)
   - ⚠️ These **must** match `VARIANT_PRICES` in `lib/whop-plans.ts` and the product page price.
2. Copy each plan's id (`plan_xxxx`) into `NEXT_PUBLIC_WHOP_PLAN_SM/MD/LG`.
3. Copy your **company id** (`biz_xxxx`) into `NEXT_PUBLIC_WHOP_COMPANY_ID`.
4. Copy your **API key** into `WHOP_API_KEY`.
5. **Create a webhook** pointing to `https://yourbrand.com/api/whop/webhook`, and **subscribe it to these three events** (all three matter):
   - `payment.succeeded` — marks orders paid + fires the purchase tracking
   - `setup_intent.succeeded` — saves the customer's payment method for future rebilling
   - `payment.failed` — reconciles failed rebill charges
   Copy the webhook's signing secret into `WHOP_WEBHOOK_SECRET`.

> Whop is your **Merchant of Record** — it handles the actual payment, taxes, and card data. You never touch raw card details.

> **Saving cards for rebilling has a legal consent requirement** (card-network rule). If you rebill customers later, you must disclose it at checkout and in your terms (timing, frequency, amount, cancellation). Handle this on your legal/terms side.

---

## Phase 6 — Set up Resend (emails)

1. In Resend, **add and verify your sending domain** (Domains → add → set the DNS records they give you). This is required — emails from an unverified domain won't deliver.
2. Create an **API key** → `RESEND_API_KEY`.
3. Set `SUPPORT_FROM_EMAIL` to an address on your verified domain (e.g. `support@yourbrand.com`).

This powers the support-form messages and the order/tracking emails the admin sends.

---

## Phase 7 — Set up Meta (optional, for ads)

Only if you'll run Meta ads:
1. Get your **Pixel id** → `NEXT_PUBLIC_META_PIXEL_ID`.
2. Generate a **Conversions API token** → `META_CAPI_TOKEN`.
3. (Testing) Use a **Test Event Code** → `META_TEST_EVENT_CODE`, then remove it for production.

If you skip this, the store works fully — it just won't send ad-tracking events.

---

## Phase 8 — Sandbox test (DO NOT skip)

This proves the money flow works before real customers. The code is correct, but only a real test transaction proves the live integration. Work through `SANDBOX_CHECKLIST` (in this doc, below) — at minimum:

1. **Place a test order** end to end. Confirm:
   - An `orders` row appears with status `draft`, then flips to `paid` after payment.
   - The thank-you page shows the order.
2. **Confirm the saved payment method is captured.** After the test order, check the `orders` row has `whop_member_id` and `whop_payment_method_id` filled in.
   - ⚠️ The code reads these from the `setup_intent.succeeded` webhook using best-guess field paths. There are temporary debug logs in the webhook (`[webhook] setup_intent.succeeded data:`) — check your server logs to confirm the real field names, and if they differ, that's a one-line fix. **Then remove the two debug logs.**
3. **Confirm Meta dedup** (if using Meta): in Events Manager Test Events, a single purchase should show **one** Purchase event, not two.
4. **Test a rebill** from the admin Finance page on the test customer. Confirm the charge succeeds and the amount is correct (Whop uses dollars).
5. **Test fulfillment**: in the admin, enter a tracking number on the test order, hit save — confirm the order flips to `fulfilled` and the tracking email arrives.
6. **Test the support form**: submit it, confirm the email arrives at your support address.

> The webhook subscriptions (Phase 5, step 5) are the #1 thing people forget — if `setup_intent.succeeded` isn't subscribed, rebilling data never saves and step 2 will fail.

---

## Phase 9 — Go live

1. Remove the two temporary webhook debug logs (after step 2 above confirmed the field paths).
2. Make sure all env vars are set in your **production** host (not just locally).
3. Confirm your domain is connected and `NEXT_PUBLIC_SITE_URL` points to it.
4. Do one final real (small) transaction if possible, then refund it.
5. You're live.

---

## Admin panel

Your operations happen at `https://yourbrand.com/admin`:
- Log in with `ADMIN_PASSWORD`.
- **Dashboard**: revenue, order counts, and an "awaiting fulfillment" queue.
- **Orders**: view orders; open one to enter a tracking number → "Save & Send" marks it fulfilled and emails the customer a tracking link.
- **Finance**: see customers with saved payment methods; charge a saved card (rebill) with a live Whop verification first.

Keep `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` strong and private — this panel can charge saved cards.

---

## Quick reference: the absolute minimum to sell
1. Supabase SQL run ✅
2. Brand + product config filled ✅
3. Required env vars set ✅
4. Whop plans + webhook (3 events) ✅
5. Resend domain verified ✅
6. Sandbox test passed ✅

See `PROJECT_INTAKE.md` to gather all your values fast (or hand them to me and I'll generate the config).
