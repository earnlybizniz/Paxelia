import type { Metadata } from 'next'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { ReviewsPageClient } from './reviews-client'
import { REVIEW_SUMMARY } from '@/lib/reviews-data'

export const metadata: Metadata = {
  title: `Reviews — The Wylorise Sovereign Q8 (${REVIEW_SUMMARY.score}★)`,
  description: `Read all ${REVIEW_SUMMARY.count} verified customer reviews of the Wylorise Sovereign Q8 bamboo standing desk.`,
}

export default function ReviewsPage() {
  return (
    <>
      <ThemeStyle />
      <Grain />
      <SiteHeader />
      <main id="main" className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
        <ReviewsPageClient />
      </main>
      <SiteFooter />
    </>
  )
}