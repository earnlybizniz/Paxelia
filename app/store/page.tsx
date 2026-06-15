import type { Metadata } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import { AnnouncementBar } from '@/components/shell/AnnouncementBar'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { Hero } from '@/components/home/Hero'
import { MarqueeTrust } from '@/components/home/MarqueeTrust'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { FeatureScenes } from '@/components/home/FeatureScenes'
import { VariantTeaser } from '@/components/home/VariantTeaser'
import { LifestyleGallery } from '@/components/home/LifestyleGallery'
import { ComparisonTable } from '@/components/home/ComparisonTable'
import { ReviewsPreview } from '@/components/home/ReviewsPreview'
import { GuaranteeStrip } from '@/components/home/GuaranteeStrip'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FinalCta } from '@/components/home/FinalCta'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'

export const metadata: Metadata = {
  title: `${C.brandName} — Home`,
  description: 'A genuine Italian marble standing desk with a 440 lb electric lift — sold factory-direct, without the showroom markup.',
}

export default function HomePage() {
  return (
    <>
      <ThemeStyle />
      <Grain />
      <AnnouncementBar />
      <SiteHeader />
      <Hero />
      <MarqueeTrust />
      <ProblemSolution />
      <FeatureScenes />
      <VariantTeaser />
      <LifestyleGallery />
      <ComparisonTable />
      <ReviewsPreview />
      <GuaranteeStrip />
      <FaqAccordion />
      <FinalCta />
      <SiteFooter />
    </>
  )
}