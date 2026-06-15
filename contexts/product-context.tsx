'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Product, ProductImage } from '@/lib/pdp-product'
import { ALDER_PRODUCT } from '@/lib/pdp-product'
import { getSelectedPrice, getConfigLabel, getVariantId, getDefaultSelection } from '@/lib/pdp-pricing'

// ============================================================
// TYPES
// ============================================================
interface ProductContextType {
  product: Product
  gallery: ProductImage[]
  selection: Record<string, string>
  setOption: (axisKey: string, optionId: string) => void
  price: number
  compareAt: number | undefined
  configLabel: string
  variantId: string
  activeImage: ProductImage
  activeIndex: number
  setActiveIndex: (index: number) => void
}

// ============================================================
// CONTEXT
// ============================================================
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// ============================================================
// PROVIDER
// ============================================================
interface ProductProviderProps {
  children: ReactNode
  product?: Product
}

export function ProductProvider({ children, product = ALDER_PRODUCT }: ProductProviderProps) {
  // Initialize selection from defaults
  const [selection, setSelection] = useState<Record<string, string>>(() => getDefaultSelection(product))
  const [activeIndex, setActiveIndexRaw] = useState(0)
  const setActiveIndex = useCallback((index: number) => setActiveIndexRaw(index), [])

  // Set option and update gallery if the option has an image
  const setOption = useCallback((axisKey: string, optionId: string) => {
    setSelection(prev => ({ ...prev, [axisKey]: optionId }))

    const scrollToGallery = () => {
      if (typeof window === 'undefined') return
      requestAnimationFrame(() => {
        document.getElementById('product-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    // Multi-colourway templates only: if the chosen finish has its OWN gallery
    // set (galleryByFinish), the whole gallery swaps to it, so reset to the
    // first image of the new set and scroll up. Wylorise has no galleryByFinish,
    // so this is skipped and the single-gallery jump below runs instead.
    if (axisKey === 'finish' && (product.galleryByFinish?.[optionId]?.length ?? 0) > 0) {
      setActiveIndexRaw(0)
      scrollToGallery()
      return
    }

    // Single flat gallery (Wylorise): every axis — frame colour AND size —
    // carries an `image` that points at a specific gallery entry. Jump to that
    // image and scroll the buyer up so they actually SEE the variant they picked
    // (essential on mobile, where the gallery sits above the variant buttons).
    const axis = product.axes.find(a => a.key === axisKey)
    const option = axis?.options.find(o => o.id === optionId)
    if (option?.image) {
      const imageIndex = product.gallery.findIndex(img => img.src === option.image)
      if (imageIndex >= 0) {
        setActiveIndexRaw(imageIndex)
        scrollToGallery()
      }
    }
  }, [product.axes, product.gallery, product.galleryByFinish])

  // Computed values
  const price = useMemo(() => getSelectedPrice(product, selection), [product, selection])
  const configLabel = useMemo(() => getConfigLabel(product, selection), [product, selection])
  const variantId = useMemo(() => getVariantId(product.slug, selection), [product.slug, selection])

  // Active gallery = the set for the selected finish, falling back to the
  // default product.gallery if no per-finish set exists.
  const gallery = useMemo<ProductImage[]>(() => {
    const finishId = selection['finish']
    const byFinish = product.galleryByFinish?.[finishId]
    return byFinish && byFinish.length > 0 ? byFinish : product.gallery
  }, [product.galleryByFinish, product.gallery, selection])

  const activeImage = gallery[activeIndex] || gallery[0]

  // Calculate compareAt based on selection.
  // Uses each option's optional compareDelta when provided (so was-prices can
  // differ from the live-price delta); falls back to priceDelta otherwise.
  const compareAt = useMemo(() => {
    if (!product.compareAt) return undefined
    let compare = product.compareAt
    for (const axis of product.axes) {
      const selectedId = selection[axis.key]
      const option = axis.options.find(o => o.id === selectedId)
      if (option) {
        compare += option.compareDelta ?? option.priceDelta
      }
    }
    return compare
  }, [product.compareAt, product.axes, selection])

  const value = useMemo<ProductContextType>(() => ({
    product,
    gallery,
    selection,
    setOption,
    price,
    compareAt,
    configLabel,
    variantId,
    activeImage,
    activeIndex,
    setActiveIndex,
  }), [product, gallery, selection, setOption, price, compareAt, configLabel, variantId, activeImage, activeIndex])

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

// ============================================================
// HOOK
// ============================================================
export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}