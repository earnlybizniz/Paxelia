/**
 * components/shell/Section.tsx
 * Shared section shell: background tone, soft radial wash, vertical padding,
 * animated divider rule, max-width gutter.
 */
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

interface SectionProps {
  children: React.ReactNode
  id?: string
  tone?: 'paper' | 'paper2' | 'paper3' | 'ink'
  wash?: boolean
  divider?: boolean
  className?: string
  innerClassName?: string
  style?: React.CSSProperties
}

const toneClass = {
  paper:  'bg-[var(--paper)]',
  paper2: 'bg-[var(--paper2)]',
  paper3: 'bg-[var(--paper3)]',
  ink:    'bg-[var(--ink)]',
}

export function Section({
  children,
  id,
  tone = 'paper',
  wash = false,
  divider = true,
  className,
  innerClassName,
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden',
        toneClass[tone],
        className
      )}
      style={{ padding: 'clamp(4.5rem, 10vw, 8rem) 0', ...style }}
    >
      {/* Soft radial accent wash (behind content) */}
      {wash && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 110% 50%, color-mix(in srgb, var(--accent) 6%, transparent), transparent)',
          }}
        />
      )}

      {/* Animated top divider rule */}
      {divider && (
        <Reveal variant="maskUp" className="absolute top-0 left-0 right-0 h-px overflow-hidden">
          <div className="h-px w-full bg-[var(--accent)]/20" />
        </Reveal>
      )}

      {/* Content gutter */}
      <div className={cn('relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-10', innerClassName)}>
        {children}
      </div>
    </section>
  )
}
