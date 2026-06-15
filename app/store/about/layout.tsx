/**
 * app/store/about/layout.tsx
 * Server layout wrapper — supplies page metadata for the (client) About page.
 * Client components cannot export `metadata`, so the title lives here.
 */
import type { Metadata } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'

export const metadata: Metadata = {
  title: `${C.brandName} — About`,
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}