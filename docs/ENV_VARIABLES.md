# Environment Variables — ALDER Store Template

Every environment variable the code actually uses, what it's for, and exactly where to get it. This list was generated directly from the code, so it's complete and accurate — nothing extra, nothing missing.

You don't need to be a developer. Each variable is a `NAME=value` line you'll paste into your hosting provider's "Environment Variables" settings (e.g. Vercel → Project → Settings → Environment Variables), or into a local `.env.local` file while testing.

---

## How to read this list

- **Public** vars start with `NEXT_PUBLIC_` — these are safe to expose to the browser (they end up in the page). Never put a secret in a `NEXT_PUBLIC_` var.
- **Secret** vars have NO `NEXT_PUBLIC_` prefix — these stay on the server only. Treat them like passwords.
- **Required** = the store won't work without it. **Optional** = nice to have.

---

## The full list (copy this as your template)

```bash
# ─── Site ───
NEXT_PUBLIC_SITE_URL=

# ─── Supabase (database) ───
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# ─── Whop (payments + merchant of record) ───
WHOP_API_KEY=
WHOP_WEBHOOK_SECRET=
NEXT_PUBLIC_WHOP_COMPANY_ID=
NEXT_PUBLIC_WHOP_PLAN_SM=
NEXT_PUBLIC_WHOP_PLAN_MD=
NEXT_PUBLIC_WHOP_PLAN_LG=

# ─── Resend (transactional email) ───
RESEND_API_KEY=
SUPPORT_FROM_EMAIL=

# ─── Meta (Pixel + Conversions API) ───
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_TOKEN=
META_TEST_EVENT_CODE=

# ─── Mapbox (address autofill at checkout) ───
NEXT_PUBLIC_MAPBOX_TOKEN=

# ─── Admin panel ───
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

---

## What each one is and where to get it

### Site

**`NEXT_PUBLIC_SITE_URL`** · Public · Required
Your live site's full URL, e.g. `https://yourbrand.com` (no trailing slash). Used to build return URLs after payment and the links in emails. While testing locally, use `http://localhost:3000`.

---

### Supabase (database)

**`NEXT_PUBLIC_SUPABASE_URL`** · Public · Required
Your Supabase project URL. Get it from **Supabase → Project Settings → API → Project URL**.

**`SUPABASE_SERVICE_ROLE_KEY`** · **Secret** · Required
The powerful server-side database key. Get it from **Supabase → Project Settings → API → `service_role` secret**. ⚠️ Keep this private — it can read/write all your data. Never expose it to the browser.

---

### Whop (payments + merchant of record)

**`WHOP_API_KEY`** · **Secret** · Required
Your Whop app's API key. Get it from your Whop dashboard → **Developer / API keys**. Used server-side to create checkout sessions and to charge saved cards (rebilling).

**`WHOP_WEBHOOK_SECRET`** · **Secret** · Required
The signing secret for verifying that incoming webhooks really came from Whop. When you create your webhook endpoint in the Whop dashboard, Whop gives you this secret. Without it, payment confirmations can't be trusted/processed.

**`NEXT_PUBLIC_WHOP_COMPANY_ID`** · Public · Required
Your Whop company id (looks like `biz_xxxxxxxx`). Found in your Whop dashboard. Used when charging saved payment methods.

**`NEXT_PUBLIC_WHOP_PLAN_SM` / `_MD` / `_LG`** · Public · Required
The Whop **plan id** for each size (Small / Medium / Large), each looks like `plan_xxxxxxxx`. You create one plan per size in Whop, set its price, and paste its id here. ⚠️ The price you set on each Whop plan **must match** the price shown on your product (see `STORE_VARIABLES.md` → prices). Whop charges its plan's price; the store records the matching price.

---

### Resend (email)

**`RESEND_API_KEY`** · **Secret** · Required (for emails to send)
Your Resend API key. Sign up at [resend.com](https://resend.com), then **API Keys → Create**. Used to send the support-form messages and the order/tracking emails.

**`SUPPORT_FROM_EMAIL`** · Public-ish · Required (for emails to send)
The "from" address on emails you send, e.g. `support@yourbrand.com`. ⚠️ This must be on a **domain you've verified in Resend** (Resend → Domains → add and verify your domain via DNS). Sending from an unverified domain will fail.

---

### Meta (Pixel + Conversions API)

**`NEXT_PUBLIC_META_PIXEL_ID`** · Public · Optional (required only if you run Meta ads)
Your Meta Pixel id. From **Meta Events Manager → Data Sources → your pixel → Settings**. Powers browser-side tracking (ViewContent, AddToCart, etc.).

**`META_CAPI_TOKEN`** · **Secret** · Optional (pairs with the pixel)
The Conversions API access token, generated in **Events Manager → your pixel → Settings → Conversions API → Generate access token**. Lets the server send purchase events directly to Meta (more reliable than browser-only). Uses the same id as the pixel.

**`META_TEST_EVENT_CODE`** · **Secret** · Optional (testing only)
A temporary code from **Events Manager → Test Events** used to confirm your events arrive while testing. Leave blank/unset in production.

> If you leave the Meta vars unset, the store still works fully — it just won't send ad-tracking events.

---

### Mapbox (address autofill at checkout)

**`NEXT_PUBLIC_MAPBOX_TOKEN`** · Public · Optional (recommended)
A Mapbox public token (starts with `pk.`). Get it free at [mapbox.com](https://mapbox.com) → **Account → Tokens**. Powers the address autocomplete on the checkout's delivery field. ⚠️ In Mapbox, restrict the token to your domain(s) so it can't be abused. If you leave this unset, checkout still works — customers just type their address manually (no suggestions).

---

### Admin panel

**`ADMIN_PASSWORD`** · **Secret** · Required (to access /admin)
The single password you'll type to log into the admin panel at `/admin`. Choose something long and strong. This is what protects your orders and the ability to charge saved cards — treat it seriously.

**`ADMIN_SESSION_SECRET`** · **Secret** · Required (to access /admin)
A random string (32+ characters) used to sign your admin login session cookie. Generate one however you like — e.g. a password manager's random generator, or run `openssl rand -base64 32`. ⚠️ If this isn't set, admin login won't work. Keep it private.

---

## Quick setup order
1. Create accounts: Supabase, Whop, Resend, (optional) Meta, (optional) Mapbox.
2. Fill the **Required** vars first — that's the minimum to take real orders.
3. Add Meta + Mapbox when you're ready (optional polish/ads).
4. Set the same variables in your hosting provider (e.g. Vercel) for production, and in `.env.local` for local testing.

See `NEW_PROJECT_SETUP.md` for the full step-by-step that ties all of this together.
