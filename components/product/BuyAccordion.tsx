'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package, Truck, Wrench, Info } from 'lucide-react'
import { useProduct } from '@/contexts/product-context'
import { cn } from '@/lib/utils'
import { E } from '@/lib/motion'

type AccordionItem = {
  id: string
  icon: React.ReactNode
  title: string
  content: React.ReactNode
}

export function BuyAccordion() {
  const { product, selection } = useProduct()
  const [openId, setOpenId] = useState<string | null>('specs')

  // Per-size spec overrides: the selected size's own specs appear first,
  // followed by the shared base specs. Lets the Specifications block reflect
  // the selected variant live (dimensions, weight, etc.).
  const sizeAxis = product.axes.find(a => a.key === 'size')
  const selectedSize = sizeAxis?.options.find(o => o.id === selection.size)
  const mergedSpecs = [...(selectedSize?.specs ?? []), ...product.specs]

  const items: AccordionItem[] = [
    {
      id: 'specs',
      icon: <Info size={16} />,
      title: 'Specifications',
      content: (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {mergedSpecs.map((spec, i) => (
            <div key={`${spec.label}-${i}`} className="contents">
              <dt className="font-sans text-[0.8rem] text-[var(--ink-mute)]">{spec.label}</dt>
              <dd className="font-sans text-[0.8rem] text-[var(--ink)]">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'inbox',
      icon: <Package size={16} />,
      title: "What's in the box",
      content: (
        <ul className="flex flex-col gap-1.5">
          {product.inBox.map((item, i) => (
            <li key={i} className="font-sans text-[0.8rem] text-[var(--ink-soft)] flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'assembly',
      icon: <Wrench size={16} />,
      title: 'Assembly',
      content: (
        <p className="font-sans text-[0.8rem] text-[var(--ink-soft)] leading-relaxed">
          Some assembly is required. The desk arrives with clear illustrated instructions and all the hardware you need. Most people set it up without any special tools.
        </p>
      ),
    },
    {
      id: 'shipping',
      icon: <Truck size={16} />,
      title: 'Shipping & returns',
      content: (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[0.8rem] text-[var(--ink-soft)] leading-relaxed">
            <strong className="text-[var(--ink)]">Free shipping</strong> on all US orders. Orders are processed in 1–2 business days and typically arrive within 5–12 business days, with tracking provided.
          </p>
          <p className="font-sans text-[0.8rem] text-[var(--ink-soft)] leading-relaxed">
            <strong className="text-[var(--ink)]">30-day trial:</strong> If it&apos;s not right for your space, we&apos;ll arrange the return and cover the shipping, then issue a full refund. No restocking fees.
          </p>
        </div>
      ),
    },
  ]

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className="border-t border-[var(--ink)]/10 pt-4">
      {items.map((item) => (
        <div key={item.id} className="border-b border-[var(--ink)]/10">
          <button
            onClick={() => toggle(item.id)}
            className="flex items-center justify-between w-full py-3 group"
            aria-expanded={openId === item.id}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[var(--accent)]">{item.icon}</span>
              <span className="font-sans text-[0.85rem] font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {item.title}
              </span>
            </div>
            <motion.span
              animate={{ rotate: openId === item.id ? 180 : 0 }}
              transition={{ duration: 0.2, ease: E }}
              className="text-[var(--ink-mute)]"
            >
              <ChevronDown size={18} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: E }}
                className="overflow-hidden"
              >
                <div className="pb-4 pl-7">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}