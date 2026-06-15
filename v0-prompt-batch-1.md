# v0 PROMPT — Batch 1 of 4 (Wylorise academy rebrand: foundation)

Paste this into v0. It rebrands ONLY the academy (`/edu`) tenant. Do not touch anything else.

---

## HARD RULES — read first
- This is a multi-tenant app. You are editing the **academy tenant only** (the `/edu` routes + `components/academy/*` + `config/academy/*` + `app/edu/omni.css`).
- **Do NOT touch, edit, move, rename, or delete anything related to the store tenant** or anything shared: `app/store/**`, `components/{home,product,shell,checkout,policies,ui}/**`, `contexts/**`, `lib/**` (except none in this batch), `app/api/**`, `middleware.ts`, the root `app/layout.tsx`, `app/globals.css`, `styles/**`, `next.config.*`, `package.json`, `tsconfig.json`, and all env vars. Leave them exactly as they are.
- Replace each file below with the **complete** version provided. These are full-file replacements, not partial edits.
- Do not change any route paths, the `PLANS` array values, or any Whop/Supabase wiring.

## What this batch does
Rebrands the academy's foundation from "Omnirise / Meta ads" to **"Wylorise — Mastering Google Ads"** and reskins it to a bright, bold, modern **blue + amber** look (deliberately not Google's four-color logo). New fonts are loaded **inside the academy layout**, so the store tenant's fonts are untouched. The logo image is replaced with a text wordmark, so the header/footer no longer depend on `/images/logo-nav.png` or `/images/logo-footer.png` (you can leave those image files in place; they're just no longer referenced here).

## Files to replace (exact paths)
1. `app/edu/omni.css` — academy-scoped theme + animations. New blue/amber tokens, type overrides (display / body / mono), the search-query caret + amber highlight helpers, and namespaced keyframes. Everything is scoped under `.omni-root` so it cannot affect the store.
2. `app/edu/layout.tsx` — new Wylorise / Mastering Google Ads metadata + JSON-LD, and academy-scoped Google fonts (Bricolage Grotesque = display, Hanken Grotesk = body, Space Mono = mono) applied on the `.omni-root` wrapper.
3. `components/academy/site-header.tsx` — text wordmark "Wylorise" + amber dot (no image), blue/amber accents, nav relabeled ("Field Guide" → "The Book"), "Get access" CTA. Same scroll/animation behavior.
4. `components/academy/site-footer.tsx` — Wylorise brand, new ebook + Telegram description, `support@wylorise.store`, legal line "5742 Satterfield Drive, Macon, GA 31206 · Governed by the laws of the State of Georgia, USA," and the disclaimer updated to "not affiliated with Google."
5. `components/academy/ui/button.tsx` — restyled variants (primary = blue, accent = amber, blue focus ring). The `variant`/`size` API is unchanged, so every caller keeps working.
6. `components/academy/ui/section-heading.tsx` — `Eyebrow` restyled as a mono "search query" chip (the signature element), amber `Pill`, bolder display heading. Same exports and props.
7. `components/academy/ui/accordion.tsx` — blue/amber open state. Same exports and props.
8. `config/academy/plans.ts` — **`PLANS` array kept identical** (ids `"30"/"60"/"90"`, prices, per-day, badges all unchanged so checkout keeps working). Only `MEMBERSHIP_INCLUDES` copy and `SUPPORT_EMAIL` (now `support@wylorise.store`) changed.

## After applying
The academy home and inner pages will still render with their current section copy (still Meta/Discord-worded in places) — that copy gets rewritten in Batches 2–4. This batch only changes the shell, theme, fonts, shared UI primitives, and pricing config. Nothing in the store tenant changes.
