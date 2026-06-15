/**
 * app/store/support/layout.tsx
 * Server layout wrapper — supplies page metadata for the (client) Support page.
 * Client components cannot export `metadata`, so the title lives here.
 */
import type { Metadata } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'

export const metadata: Metadata = {
  title: `${C.brandName} — Support`,
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}