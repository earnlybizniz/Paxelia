'use client'

import { motion } from 'framer-motion'
import { useProduct } from '@/contexts/product-context'
import { formatCurrency } from '@/lib/pdp-pricing'
import { cn } from '@/lib/utils'
import { E } from '@/lib/motion'

export function VariantSelector() {
  const { product, selection, setOption } = useProduct()

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {product.axes.map((axis) => {
        // Hide any axis that has a single option (e.g. a one-colorway finish) — there
        // is nothing to choose, so no picker is rendered. The single option still flows
        // through the cart, checkout, and order emails as the product's fixed finish.
        if (axis.options.length <= 1) return null

        const selectedOption = axis.options.find(o => o.id === selection[axis.key])

        return (
          <div key={axis.key} className="flex flex-col gap-3 min-w-0">
            {/* Axis Header */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-[0.85rem] font-medium text-[var(--ink)]">
                  {axis.label}
                </span>
                {selectedOption && (
                  <span className="font-sans text-[0.85rem] text-[var(--ink-soft)]">
                    — {selectedOption.label}
                  </span>
                )}
              </div>
              {axis.help && (
                <a
                  href="#fit-guide"
                  className="font-sans text-[0.75rem] text-[var(--accent)] hover:underline"
                >
                  {axis.help}
                </a>
              )}
            </div>

            {/* Options */}
            {axis.type === 'card' ? (
              <div
                className="grid gap-2 min-w-0"
                style={{ gridTemplateColumns: `repeat(${Math.min(axis.options.length, 3)}, minmax(0, 1fr))` }}
                role="radiogroup"
                aria-label={axis.label}
              >
                {axis.options.map((option) => {
                  const isSelected = selection[axis.key] === option.id
                  const isDefault = option.default

                  return (
                    <button
                      key={option.id}
                      onClick={() => !option.soldOut && setOption(axis.key, option.id)}
                      disabled={option.soldOut}
                      role="radio"
                      aria-checked={isSelected}
                      className={cn(
                        'relative flex flex-col items-center gap-1 p-3 rounded-[6px] border-2 transition-all duration-200 min-w-0',
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                          : 'border-[var(--ink)]/10 hover:border-[var(--accent)]/50',
                        option.soldOut && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {/* Most Popular tag */}
                      {isDefault && !isSelected && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-[var(--paper)] px-2 py-0.5 rounded-full font-sans text-[0.6rem] font-medium whitespace-nowrap">
                          Most popular
                        </span>
                      )}

                      <span className={cn(
                        'font-sans font-medium',
                        isSelected ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'
                      )}>
                        {option.label}
                      </span>

                      {option.sub && (
                        <span className="font-sans text-[0.7rem] font-bold text-[var(--ink-soft)]">
                          {option.sub}
                        </span>
                      )}

                      {/* Absolute price for this size (basePrice + delta) */}
                      <span className={cn(
                        'font-sans text-[0.8rem] font-semibold text-green-700',
                      )}>
                        {formatCurrency(product.basePrice + option.priceDelta)}
                      </span>

                      {option.soldOut && (
                        <span className="font-sans text-[0.65rem] text-[var(--ink-mute)] line-through">
                          Sold out
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Swatch type */
              <div
                className="flex flex-wrap gap-3"
                role="radiogroup"
                aria-label={axis.label}
              >
                {axis.options.map((option) => {
                  const isSelected = selection[axis.key] === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => !option.soldOut && setOption(axis.key, option.id)}
                      disabled={option.soldOut}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={option.label}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <motion.div
                        className={cn(
                          'relative w-10 h-10 rounded-full transition-all duration-200',
                          isSelected
                            ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--paper)]'
                            : 'ring-1 ring-[var(--ink)]/20 group-hover:ring-[var(--accent)]/50'
                        )}
                        style={{ backgroundColor: option.swatch }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.15, ease: E }}
                      >
                        {option.soldOut && (
                          <div className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-[var(--ink-mute)] rotate-45" />
                          </div>
                        )}
                      </motion.div>
                      <span className={cn(
                        'font-sans text-[0.7rem] transition-colors',
                        isSelected ? 'text-[var(--ink)]' : 'text-[var(--ink-mute)]'
                      )}>
                        {option.label}
                      </span>
                      {option.priceDelta !== 0 && (
                        <span className="font-sans text-[0.6rem] text-[var(--ink-mute)]">
                          +{formatCurrency(option.priceDelta)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
