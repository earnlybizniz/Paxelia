'use client'

import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { ImageFrame } from '@/components/shell/ImageFrame'
import { Eyebrow, SectionHeading, ParsedHeading } from '@/components/shell/Typography'
import { slideL, slideR } from '@/lib/motion'
import { motion } from 'framer-motion'

export function StoryBlock() {
  const { story } = useHome()
  if (!story) return null

  return (
    <Section id="story" tone="paper2" wash>
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          variants={slideL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12% 0px' }}
        >
          <ImageFrame slot={story.image} sizes="(max-width:768px) 100vw, 44vw" />
        </motion.div>

        <motion.div
          variants={slideR}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12% 0px' }}
          className="flex flex-col gap-6"
        >
          <Eyebrow>{story.eyebrow}</Eyebrow>
          <ParsedHeading text={story.heading} as="h2" className="max-w-[20ch]" />
          {story.body.map((para, i) => (
            <p key={i} className="font-sans text-[var(--ink-soft)] leading-relaxed text-[0.95rem]">{para}</p>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
