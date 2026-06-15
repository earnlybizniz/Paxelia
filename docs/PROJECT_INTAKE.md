# Project Intake — The "Ask Me Everything" Questionnaire

This is the master list of **every variable** needed to turn the template into a finished store. Use it two ways:

1. **DIY**: answer these and plug the answers into the config files (see `STORE_VARIABLES.md` for where each goes).
2. **With Claude (recommended)**: start a new chat, say *"New project — here's my filled intake"* (or *"interview me"*), and I'll generate all the config files for you. You can either answer everything below, or just hand me raw details and I'll draft the rest (descriptions, FAQ answers, policy values).

> Tip: For the product description, you can give me the **URL of an existing product page** (e.g. the original manufacturer's listing) and I'll generate a polished description, highlights, features, and specs from it — or just give me the raw product details.

---

## SECTION 1 — Brand basics
1. **Brand name?** (e.g. "ALDER")
2. **Logo**: do you have a logo file? (provide `logo.png`, a light/inverse version, and a `favicon.png`) — or should it be a text wordmark for now?
3. **Brand colors?** Your main accent color at minimum (hex). Optionally a full palette (background, text, accent). If unsure, describe the vibe (e.g. "warm, earthy, premium") and I'll propose one.
4. **Fonts?** A heading font + body font (Google Fonts names). If unsure, I'll suggest a pairing that fits the vibe.
5. **Site URL?** (your live domain, e.g. `https://yourbrand.com`)

## SECTION 2 — Contact & company
6. **Support email?** (shown across the store + receives the contact form, e.g. `support@yourbrand.com`)
7. **Legal entity name?** (for policies, e.g. "Yourbrand Furniture Co.")
8. **Business mailing address?** (for the privacy/contact policy)
9. **Governing law region?** (state/country for the Terms, e.g. "State of Oregon, USA")

## SECTION 3 — The product
10. **What is the product?** (one product — name + what it is)
11. **Product tagline / eyebrow?** (short hook shown above the title)
12. **Existing product URL** (so I can generate the description) **OR** raw details: materials, dimensions, key features, what's in the box, specs.
13. **Any badges?** (e.g. "Editor's Choice 2026")
14. **Star rating + review count** to display? (e.g. 4.9 / 3,217) and a few **review quotes** (or I'll draft realistic ones — your call, but real reviews are better).

## SECTION 4 — Variants & pricing
15. **Sizes (or your main variant axis):** how many, their **display labels**, and the **price for each**.
   - Example: Small ($799), Medium ($899), Large ($1049).
   - Remember: pricing is by **size only**.
16. **Finishes/colors (cosmetic, no price change):** display labels + a swatch color (hex) for each.
17. Confirm: should pricing stay **size-only** (finish doesn't change price)? (This is the template default and the simplest.)

> Internal ids (`sm/md/lg`, `walnut/oak/...`) are handled for you — you just give labels and prices. If the variant *count* changes, I'll wire the ids + you'll create matching Whop plans.

## SECTION 5 — Shipping, returns, warranty (policy values)
18. **Where do you ship?** (regions/countries)
19. **Processing time?** (e.g. "1–2 business days")
20. **Delivery estimate?** (e.g. "3–7 business days")
21. **Shipping cost?** (e.g. "Free standard shipping" or a price)
22. **Carriers?** (e.g. "UPS, FedEx") · **Do you provide tracking?** (yes/no) · **Ship internationally?** (yes/no)
23. **Trial period?** (e.g. 30-night trial) · **Return window?** (e.g. 30 days)
24. **Who pays return shipping?** (you / the customer) · **Restocking fee %?** (usually 0)
25. **Any non-returnable items?** (e.g. gift cards, final-sale)
26. **Refund processing time?** (e.g. "5–10 business days")
27. **Warranty length?** (e.g. 5 years) and what it covers

## SECTION 6 — Privacy/legal toggles
28. **Do you have California (CCPA) customers?** (yes/no — adds a CCPA section)
29. **Do you have EU (GDPR) customers?** (yes/no — adds a GDPR section)
30. **What customer data do you collect?** (default: name, email, shipping address, order details)
31. **Analytics/tracking tools?** (default: Meta Pixel / Conversions API) · **Use cookies?** (yes/no)

## SECTION 7 — Homepage content
32. **Hero headline + subline?** (the big promise) — or give me the angle and I'll draft it.
33. **The "problem" your product solves** vs **how yours is better** (for the problem/solution + comparison sections).
34. **Top features** (3–4) with a sentence each.
35. **Brand story** (a paragraph or two — origin, mission) — or I'll draft from your notes.
36. **Guarantees** (the template uses: trial, shipping, warranty, secure checkout — adjust if needed).
37. **Homepage FAQ** (6ish Q&As) — or I'll generate from your policies + product.

## SECTION 8 — About page
38. **Mission / what you stand for** (2–3 sentences).
39. **Three core values** (title + a line each).
40. **How it's made** (materials + process) + three craft proof points.
41. **Sustainability/sourcing angle** (if any) + three points.
42. **About-page images**: hero (wide), a craft close-up, a process/workshop shot.

## SECTION 9 — Support page
43. **Top FAQs** grouped by: Orders & Payment, Shipping & Delivery, Returns & Refunds, Product & Specs, Warranty & Care. (Most auto-fill from your policy answers; the **Product & Specs** group is product-specific — give me those Q&As or product details.)
44. **Contact form topics** (default: Order question, Shipping & tracking, Returns & refunds, Product question, Warranty, Something else).

## SECTION 10 — Accounts & keys (for env vars)
You'll gather these from each provider (see `ENV_VARIABLES.md` for exactly where):
45. **Supabase**: Project URL + service_role key (after running `SUPABASE_SETUP.md`).
46. **Whop**: API key, webhook secret, company id, and the three plan ids (one per size).
47. **Resend**: API key + a from-address on your **verified** domain.
48. **Meta** (optional): Pixel id + Conversions API token.
49. **Mapbox** (optional): public token (domain-restricted).
50. **Admin**: choose a strong `ADMIN_PASSWORD` + a random `ADMIN_SESSION_SECRET`.

## SECTION 11 — Imagery checklist
- Logo (`logo.png`) + inverse (`logo-inverse.png`) + favicon (`favicon.png`)
- Product gallery photos (multiple angles + detail + lifestyle)
- Homepage hero image + feature images + lifestyle/gallery images
- About: hero, craft close-up, process shot

---

## The fastest path with Claude
Paste this into a new chat:

> "New project from the ALDER template. Here are my intake answers: [paste your answers to the sections above]. Generate the config files (`home-content.ts`, `policies-config.ts`, `pdp-product.ts`, `whop-plans.ts`, `support-config.ts`, `about-config.ts`) filled with my details. For the product description, use this URL: [url] (or: here are the raw details: [...]). Then give me the exact env-var list to fill and the Whop/Resend/Supabase setup steps."

I'll then produce ready-to-paste config files and walk you through the account setup, the SQL (`SUPABASE_SETUP.md`), and the sandbox test — everything in `NEW_PROJECT_SETUP.md`.

---

## What I still can't do for you (you must provide/handle)
- **Real photography** — I can't generate genuine product photos.
- **Account creation + keys** — you must create the Whop/Supabase/Resend/Meta/Mapbox accounts (I'll tell you exactly where each key lives).
- **The live sandbox test** — only a real test transaction proves the integration (Whop charge, the saved-card webhook field paths, Resend delivery). I'll give you the checklist; you run it.
- **Legal review** — policies are strong templates, not lawyer-reviewed. The saved-card rebilling consent especially should be reviewed for your jurisdiction.
