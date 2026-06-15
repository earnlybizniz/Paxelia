'use client'

import { motion } from 'framer-motion'
import { Reveal } from '@/components/shell/Reveal'
import { CheckCircle2, Shield, Truck, Lock } from 'lucide-react'

export function SocialProofBar() {
  const guarantees = [
    { icon: CheckCircle2, label: '30-Day Returns', desc: 'Risk-free in your space' },
    { icon: Shield, label: '15-Year Warranty', desc: 'Frame, motor & electronics' },
    { icon: Truck, label: 'Free Shipping', desc: 'On all US orders' },
    { icon: Lock, label: 'Secure Checkout', desc: 'Encrypted payment' },
  ]

  return (
    <div className="bg-[var(--paper2)] border-y border-[var(--ink)]/5">
      <Reveal variant="fade" className="py-4 md:py-5">
        <div className="relative overflow-hidden">
          {/* Subtle glow fade overlay - left */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--paper2)]/40 to-transparent z-10 pointer-events-none" />
          {/* Subtle glow fade overlay - right */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--paper2)]/40 to-transparent z-10 pointer-events-none" />
          
          {/* Inner mask wrapper - only fades content, not background */}
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            {/* Scrolling marquee */}
            <motion.div
              className="flex gap-16 whitespace-nowrap px-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 10,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {/* Double the guarantees for seamless loop */}
              {[...guarantees, ...guarantees].map((item, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-3 py-2">
                  <item.icon size={20} className="text-[var(--accent)] flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-sans text-[0.85rem] font-medium text-[var(--ink)]">
                      {item.label}
                    </span>
                    <span className="font-sans text-[0.75rem] text-[var(--ink-soft)]">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
