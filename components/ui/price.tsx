'use client'

import { cn } from '@/lib/utils'
import { formatPrice, getDiscountPercent } from '@/lib/product'

interface PriceProps {
  price: number
  msrp?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSavings?: boolean
  className?: string
}

const sizeStyles = {
  sm: {
    price: 'text-lg font-semibold',
    msrp: 'text-sm',
    badge: 'text-xs px-1.5 py-0.5',
  },
  md: {
    price: 'text-2xl font-bold',
    msrp: 'text-base',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    price: 'text-3xl font-bold',
    msrp: 'text-lg',
    badge: 'text-sm px-2 py-1',
  },
  xl: {
    price: 'text-4xl font-bold',
    msrp: 'text-xl',
    badge: 'text-sm px-2.5 py-1',
  },
}

export function Price({ price, msrp, size = 'md', showSavings = true, className }: PriceProps) {
  const styles = sizeStyles[size]
  const hasDiscount = msrp && msrp > price
  const discountPercent = hasDiscount ? getDiscountPercent(price, msrp) : 0
  
  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn(styles.price, 'text-foreground')}>
        {formatPrice(price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={cn(styles.msrp, 'text-muted-foreground line-through')}>
            {formatPrice(msrp)}
          </span>
          
          {showSavings && discountPercent > 0 && (
            <span className={cn(
              styles.badge,
              'bg-success/10 text-success font-medium rounded'
            )}>
              Save {discountPercent}%
            </span>
          )}
        </>
      )}
    </div>
  )
}

// MonthlyPrice removed — store uses single one-time payment only
