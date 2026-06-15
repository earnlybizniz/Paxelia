'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { CountUp } from '@/components/shell/CountUp'
import { Eyebrow, SectionHeading, StarRating } from '@/components/shell/Typography'
import { rise, stagger, E } from '@/lib/motion'

export function ReviewsPreview() {
  const { reviews } = useHome()

  return (
    <Section id="reviews" tone="paper" wash>
      <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">

        {/* Score block */}
        <Reveal variant="rise" className="flex flex-col gap-4">
          <Eyebrow>{reviews.eyebrow}</Eyebrow>
          <div>
            <span
              className="font-display text-[var(--ink)] font-normal leading-none block mb-3"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontVariantNumeric: 'tabular-nums' }}
            >
              <CountUp value={reviews.score} dec={1} />
            </span>
            <StarRating value={reviews.score} size={22} />
            <p className="font-sans text-[0.8rem] text-[var(--ink-mute)] mt-2 tracking-wide">
              {reviews.count.toLocaleString()} verified reviews
            </p>
          </div>
          <SectionHeading as="h2" className="max-w-[16ch]" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            {reviews.heading}
          </SectionHeading>
          <Link
            href="/reviews"
            className="inline-block font-sans text-[0.875rem] text-[var(--accent)] relative
              after:absolute after:left-0 after:bottom-[-1px] after:h-px after:w-0 after:bg-[var(--accent)]
              after:transition-[width] after:duration-300 hover:after:w-full"
          >
            Read all reviews →
          </Link>
        </Reveal>

        {/* Cards */}
        <Reveal staggerChildren={0.1} className="grid sm:grid-cols-3 gap-4">
          {reviews.items.map((review, i) => (
            <RevealItem key={i} variant="rise">
              <motion.div
                className="flex flex-col gap-4 p-6 bg-[var(--paper2)] rounded-[4px] border border-[var(--ink)]/6 cursor-default
                  hover:border-[var(--accent)]/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_32px_var(--ink)/6]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: E }}
              >
                <StarRating value={review.stars} size={14} />
                <p className="font-sans text-[0.875rem] text-[var(--ink-soft)] leading-relaxed flex-1">
                  &ldquo;{review.body}&rdquo;
                </p>
                <div>
                  <p className="font-sans text-[0.8rem] font-medium text-[var(--ink)]">{review.author}</p>
                  <p className="font-sans text-[0.7rem] text-[var(--ink-mute)] mt-0.5">{review.config}</p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
