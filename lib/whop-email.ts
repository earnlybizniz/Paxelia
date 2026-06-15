/**
 * lib/whop-email.ts
 * Claims a one-time email from the whop_email_pool to send to Whop, so Whop
 * never receives the customer's real address. The real email is stored on the
 * orders row instead.
 *
 * Uses the atomic Postgres function claim_whop_email() (FOR UPDATE SKIP LOCKED)
 * so concurrent checkouts can never be assigned the same email.
 *
 * Returns null if the pool is exhausted — the caller MUST treat this as a hard
 * stop (pool needs refilling) and not fall through with the real email.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

export async function claimWhopEmail(
  supabase: SupabaseClient,
  orderId: string,
): Promise<string | null> {
  const { data, error } = await supabase.rpc('claim_whop_email', { p_order_id: orderId })
  if (error) {
    console.error('[whop-email] claim_whop_email RPC error:', error)
    return null
  }
  // RPC returns the email string, or null when the pool is empty.
  return (typeof data === 'string' && data.length > 0) ? data : null
}

/** Remaining unused emails in the pool (for admin/monitoring). */
export async function whopEmailPoolRemaining(
  supabase: SupabaseClient,
): Promise<number | null> {
  const { data, error } = await supabase.rpc('whop_email_pool_remaining')
  if (error) {
    console.error('[whop-email] whop_email_pool_remaining RPC error:', error)
    return null
  }
  return typeof data === 'number' ? data : null
}