# Supabase Setup — Omnirise Store

This is the **single source of truth** for the store's database. It takes a **brand-new, empty Supabase project** to a **production-ready database** that exactly matches what the code reads and writes.

You do **not** need to be a developer. Open the Supabase **SQL Editor** → **New query**, then copy each block below, paste it, and click **Run**. Do them **top to bottom**, in order.

Every block is **idempotent** (`create ... if not exists`, `create or replace`, `on conflict do nothing`), so re-running this doc on an existing database is safe and won't wipe anything.

---

## What you'll create

**Three tables**
- `orders` — every checkout creates a row; the webhook marks it paid; the admin fulfills it.
- `rebills` — audit log for off-session rebill charges made from the admin Finance page.
- `whop_email_pool` — one-time alias emails handed to Whop so a customer's real email never reaches Whop.

**Two functions**
- `claim_whop_email(p_order_id)` — atomically claims one available pool email for an order.
- `whop_email_pool_remaining()` — how many pool emails are still free (for monitoring).

---

## Before you start

1. Go to [supabase.com](https://supabase.com) → create a new project. Pick a strong database password and save it somewhere safe.
2. Wait for the project to finish provisioning (~2 minutes).
3. In the left sidebar, open **SQL Editor** → **New query**. This is where every block below goes.
4. From **Project Settings → API**, grab two values for your environment file (see `ENV_VARIABLES.md`):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **`service_role` secret key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret — never put it in client code)
   - (the `anon` key is **not** used by this template — all database access is server-side)

---

## Step 1 — Enable the UUID generator

The tables use `gen_random_uuid()` for primary keys (built in on Supabase via `pgcrypto`). Run this first:

```sql
create extension if not exists pgcrypto;
```

Expected result: *"Success. No rows returned."*

---

## Step 2 — Create the `orders` table

The core table. Every checkout creates a row here; the webhook updates it on payment; the admin updates it on fulfillment. These columns are exactly what the code uses.

```sql
create table if not exists orders (
  -- identity
  id                      uuid primary key default gen_random_uuid(),
  customer_id             text not null,              -- our first-party tracking id (also the Meta dedup key)

  -- order state: 'draft' (checkout) -> 'paid' (webhook) -> 'fulfilled' (admin) | 'refunded'
  status                  text not null default 'draft',

  -- what was bought
  variant_id              text,                       -- size id: 'sm' | 'md' | 'lg'
  plan_id                 text,                       -- the Whop plan id charged
  session_id              text,                       -- Whop checkout session id
  items                   jsonb,                      -- line items snapshot [{ variantId, finish, quantity, price }]

  -- money (all in dollars, matching Whop)
  subtotal                numeric,
  shipping                numeric,
  total                   numeric,
  currency                text default 'usd',

  -- customer details
  email                   text,                       -- the customer's REAL email (Whop only ever gets an alias)
  first_name              text,
  last_name               text,
  shipping_address        jsonb,                      -- { firstName, lastName, line1, line2, city, state, postalCode, country }
  billing_same            boolean default true,

  -- Whop payment references
  whop_payment_id         text,                       -- payment receipt id (set on payment.succeeded)
  whop_member_id          text,                       -- saved for rebilling (set on setup_intent.succeeded)
  whop_payment_method_id  text,                       -- saved for rebilling (set on setup_intent.succeeded)

  -- fulfillment (set by the admin when you ship)
  tracking_number         text,
  tracking_url            text,
  fulfilled_at            timestamptz,

  -- Meta tracking context captured at checkout (passed to Whop metadata; the webhook reads it for CAPI)
  fbp                     text,
  fbc                     text,
  user_agent              text,

  -- timestamps
  created_at              timestamptz not null default now(),
  updated_at              timestamptz
);
```

---

## Step 3 — Indexes for `orders`

Make admin pages and webhook lookups fast.

```sql
create index if not exists orders_customer_id_idx on orders (customer_id);
create index if not exists orders_status_idx      on orders (status);
create index if not exists orders_created_at_idx   on orders (created_at desc);
create index if not exists orders_email_idx        on orders (email);
```

---

## Step 4 — Create the `rebills` table

Audit log for off-session rebill charges you make from the admin Finance page. Each attempt inserts a row; the webhook updates its status when the charge resolves.

```sql
create table if not exists rebills (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid references orders(id),      -- which customer/order this rebill is for
  member_id          text not null,                   -- Whop member id charged
  payment_method_id  text not null,                   -- Whop saved payment method id charged
  amount             numeric not null,                -- dollars
  currency           text not null default 'usd',
  status             text not null default 'pending', -- 'pending' -> 'succeeded' | 'failed' (set by webhook)
  whop_payment_id    text,                            -- the resulting Whop payment id
  created_at         timestamptz not null default now(),
  updated_at         timestamptz
);
```

---

## Step 5 — Indexes for `rebills`

```sql
create index if not exists rebills_order_id_idx on rebills (order_id);
create index if not exists rebills_status_idx   on rebills (status);
```

---

## Step 6 — Create the `whop_email_pool` table

This is the table that was missing from earlier versions of this doc. It holds a supply of **one-time alias emails**. At checkout, the server claims one and hands *that* to Whop, so the customer's real email never reaches Whop — the real email is stored on the `orders` row instead.

```sql
create table if not exists whop_email_pool (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,         -- a real, deliverable inbox you control
  used         boolean not null default false,
  order_id     uuid,                         -- which order claimed it (null = available)
  assigned_at  timestamptz,                  -- when it was claimed (null = available)
  created_at   timestamptz not null default now()
);

create index if not exists whop_email_pool_used_idx on whop_email_pool (used);
```

---

## Step 7 — Create the pool functions

The code calls these two RPCs (see `lib/whop-email.ts`). `claim_whop_email` is **atomic** — `for update skip locked` guarantees two simultaneous checkouts can never be handed the same email.

```sql
-- Atomically claim one available email for an order.
-- Returns the email string, or NULL if the pool is empty.
create or replace function claim_whop_email(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_email text;
begin
  update whop_email_pool
     set used        = true,
         order_id    = p_order_id,
         assigned_at = now()
   where id = (
     select id
       from whop_email_pool
      where used = false
      order by created_at
      limit 1
      for update skip locked
   )
  returning email into claimed_email;

  return claimed_email;  -- NULL when the pool is exhausted
end;
$$;
```

```sql
-- How many emails are still available (for monitoring / refill alerts).
create or replace function whop_email_pool_remaining()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from whop_email_pool where used = false;
$$;
```

---

## Step 8 — Seed the pool with alias emails

The pool must contain **real, deliverable inbox addresses you control** (Whop sends order/login emails to them). One is consumed per order. Insert your list:

```sql
insert into whop_email_pool (email) values
  ('your-alias-1@outlook.com'),
  ('your-alias-2@outlook.com'),
  ('your-alias-3@outlook.com')
  -- ...add as many as you want (one is consumed per order)
on conflict (email) do nothing;
```

> **If you're an existing deploy:** your pool is already seeded (you don't need to re-run this). Use Step 8 only on a fresh project, or to top up.

**Keeping the pool topped up.** Check how many remain anytime:

```sql
select whop_email_pool_remaining() as emails_available;
```

As of the current checkout code, an empty pool **no longer blocks a sale** — checkout falls back to the customer's real email for that one order. But you should still refill before it runs low, so real emails keep out of Whop. (To find which orders used a fallback, look for `whop_email_pool EXHAUSTED` in your server logs.)

---

## Step 9 — Lock down with Row Level Security

This template talks to the database **only from the server** (the `service_role` key bypasses RLS, and the pool functions are `security definer`). Enabling RLS with **no policies** means the public/anon key has zero access to any of these tables — exactly what you want for orders, payments, and the email pool.

```sql
alter table orders          enable row level security;
alter table rebills         enable row level security;
alter table whop_email_pool enable row level security;
-- Intentionally NO policies are created.
-- The server (service_role key) bypasses RLS and is the only thing that touches these tables.
-- The pool functions run as security definer. The public anon key has zero access.
```

> If you ever build a browser-side feature that needs to read these tables directly (this template does not), add specific RLS policies here. For now, leave them locked.

---

## You're done — sanity check

Confirm all three tables exist with the right columns:

```sql
select table_name, column_name, data_type
from information_schema.columns
where table_name in ('orders', 'rebills', 'whop_email_pool')
order by table_name, ordinal_position;
```

Confirm the pool functions work and report availability:

```sql
select whop_email_pool_remaining() as emails_available;
```

You should see all three tables' columns, and a number for `emails_available`.

### Environment variables
Put these into your environment (see `ENV_VARIABLES.md`):

```
NEXT_PUBLIC_SUPABASE_URL=...     (Project URL)
SUPABASE_SERVICE_ROLE_KEY=...    (service_role secret — keep private)
```
