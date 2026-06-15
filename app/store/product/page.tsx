import type { Metadata } from 'next'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { AnnouncementBar } from '@/components/shell/AnnouncementBar'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { ProductProvider } from '@/contexts/product-context'
import { ProductHero } from '@/components/product/ProductHero'
import { SocialProofBar } from '@/components/product/SocialProofBar'
import { ProductVideo } from '@/components/product/ProductVideo'
import { DescriptionSections } from '@/components/product/DescriptionSections'
import { DurabilityBlock } from '@/components/product/DurabilityBlock'
import { FitGuide } from '@/components/product/FitGuide'
import { ReviewsModule } from '@/components/product/ReviewsModule'
import { ProductFaq } from '@/components/product/ProductFaq'
import { ClosingCta } from '@/components/product/ClosingCta'
import { StickyBuyBar } from '@/components/product/StickyBuyBar'
import { ProductTracking } from '@/components/product/ProductTracking'
import { ALDER_PRODUCT } from '@/lib/pdp-product'

export const metadata: Metadata = {
  title: `${ALDER_PRODUCT.name} — Natural Bamboo Standing Desk`,
  description: ALDER_PRODUCT.highlights.slice(0, 3).join('. '),
  openGraph: {
    title: `${ALDER_PRODUCT.name} — Natural Bamboo Standing Desk`,
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
          {/* 3. Product description (alternating image/text blocks) */}
          <DescriptionSections />
          {/* 4. Durability */}
          <DurabilityBlock />
          {/* 5. Product video (16:9 showcase) */}
          <ProductVideo />
          {/* 7. Fit guide / dimensions */}
          <FitGuide />
          {/* 8. Reviews */}
          <ReviewsModule />
          {/* 9. FAQ */}
          <ProductFaq />
          {/* 10. Closing CTA */}
          <ClosingCta />
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
