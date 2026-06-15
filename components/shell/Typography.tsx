import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn('font-sans font-medium uppercase tracking-[0.22em] text-[0.75rem] text-[var(--accent)]', className)}
    >
      {children}
    </p>
  )
}

interface SectionHeadingProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: React.CSSProperties
}

export function SectionHeading({ children, as: Tag = 'h2', className, style }: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        'font-display font-normal text-[var(--ink)] leading-[1.04] tracking-[-0.02em]',
        className
      )}
      style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', ...style }}
    >
      {children}
    </Tag>
  )
}

/** Parse *emphasis* in a string → accent italic spans */
export function ParsedHeading({
  text,
  as: Tag = 'h2',
  className,
}: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/)
  return (
    <Tag
      className={cn(
        'font-display font-normal text-[var(--ink)] leading-[1.04] tracking-[-0.02em]',
        className
      )}
      style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
    >
      {parts.map((p, i) =>
        i % 2 === 1
          ? <em key={i} className="not-italic" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{p}</em>
          : <span key={i}>{p}</span>
      )}
    </Tag>
  )
}

export function StarRating({ value, max = 5, size = 16 }: { value: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, value - i))
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
            <defs>
              <linearGradient id={`star-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="#D4AF37" />
                <stop offset={`${fill * 100}%`} stopColor="var(--ink-mute)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.4l4.2-.8z"
              fill={`url(#star-${i})`}
            />
          </svg>
        )
      })}
    </div>
  )
}
