import type { Metadata } from 'next'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { AnnouncementBar } from '@/components/shell/AnnouncementBar'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { ProductProvider } from '@/contexts/product-context'
import { ProductHero } from '@/components/product/ProductHero'
import { SocialProofBar } from '@/components/product/SocialProofBar'
import { FeatureGrid } from '@/components/product/FeatureGrid'
import { PainSolution } from '@/components/product/PainSolution'
import { DescriptionSections } from '@/components/product/DescriptionSections'
import { ReviewsModule } from '@/components/product/ReviewsModule'
import { ProductFaq } from '@/components/product/ProductFaq'
import { ClosingCta } from '@/components/product/ClosingCta'
import { StickyBuyBar } from '@/components/product/StickyBuyBar'
import { ProductTracking } from '@/components/product/ProductTracking'
import { ALDER_PRODUCT } from '@/lib/pdp-product'

export const metadata: Metadata = {
  title: `${ALDER_PRODUCT.name} — Electric Dual-Level Standing Desk`,
  description: ALDER_PRODUCT.highlights.slice(0, 3).join('. '),
  openGraph: {
    title: `${ALDER_PRODUCT.name} — Electric Dual-Level Standing Desk`,
    description: ALDER_PRODUCT.highlights.slice(0, 3).join('. '),
    images: [ALDER_PRODUCT.gallery[0].src || ''],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: ALDER_PRODUCT.name,
  description: ALDER_PRODUCT.highlights.join('. '),
  image: ALDER_PRODUCT.gallery.map(img => img.src).filter(Boolean),
  brand: { '@type': 'Brand', name: ALDER_PRODUCT.brand },
  offers: {
    '@type': 'Offer',
    price: ALDER_PRODUCT.basePrice,
    priceCurrency: ALDER_PRODUCT.currency,
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: ALDER_PRODUCT.rating,
    reviewCount: ALDER_PRODUCT.reviewCount,
  },
}

export default function ProductPage() {
  return (
    <>
      <ThemeStyle />
      <Grain />
      <AnnouncementBar />
      <SiteHeader />

      <ProductProvider product={ALDER_PRODUCT}>
          {/* Tracking island — fires ViewContent on mount */}
          <ProductTracking />
        <main id="main">
          {/* 1. Hero */}
          <ProductHero />
          {/* 2. Social proof bar */}
          <SocialProofBar />
          {/* 3. At-a-glance feature overview */}
          <FeatureGrid />
          {/* 4. Problem → solution */}
          <PainSolution />
          {/* 5. Feature story (broad → specific) */}
          <DescriptionSections />
          {/* 6. Reviews */}
          <ReviewsModule />
          {/* 7. FAQ */}
          <ProductFaq />
          {/* 8. Closing CTA */}
          <ClosingCta />
          {/* Comparison table, size finder, how-to, specs & demo video arrive in the next batches */}
        </main>

        {/* Sticky buy bar */}
        <StickyBuyBar />
      </ProductProvider>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
