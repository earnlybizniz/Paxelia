/**
 * PDP Pricing Helpers
 */
import type { Product, VariantOption } from './pdp-product'

export function getSelectedPrice(product: Product, selection: Record<string, string>): number {
  let price = product.basePrice
  for (const axis of product.axes) {
    const selectedId = selection[axis.key]
    const option = axis.options.find(o => o.id === selectedId)
    if (option) {
      price += option.priceDelta
    }
  }
  return price
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getConfigLabel(product: Product, selection: Record<string, string>): string {
  const labels: string[] = []
  for (const axis of product.axes) {
    const selectedId = selection[axis.key]
    const option = axis.options.find(o => o.id === selectedId)
    if (option) {
      labels.push(option.label)
    }
  }
  return labels.join(' / ')
}

export function getVariantId(slug: string, selection: Record<string, string>): string {
  const parts = [slug]
  for (const [key, value] of Object.entries(selection)) {
    parts.push(`${key}:${value}`)
  }
  return parts.join('-')
}

export function getSavings(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0
  return compareAt - price
}

export function getDefaultSelection(product: Product): Record<string, string> {
  const selection: Record<string, string> = {}
  for (const axis of product.axes) {
    const defaultOption = axis.options.find(o => o.default) || axis.options[0]
    if (defaultOption) {
      selection[axis.key] = defaultOption.id
    }
  }
  return selection
}

export function getSelectedOption(axis: { options: VariantOption[] }, selection: Record<string, string>, key: string): VariantOption | undefined {
  return axis.options.find(o => o.id === selection[key])
}