import Link from 'next/link'
import { cn } from '@epihardware/ui'

/**
 * EpiHardware brand mark — a microchip glyph whose die traces read as a stylised
 * "E", set in a gradient tile, paired with the wordmark. Pure SVG so it stays
 * crisp at every size and inherits the theme.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'from-brand-500 shadow-soft relative grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br to-amber-400',
        className
      )}
    >
      {/* subtle top-left sheen */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
      <svg
        viewBox="0 0 32 32"
        className="relative h-[62%] w-[62%] text-white"
        fill="none"
        aria-hidden="true"
      >
        {/* CPU pins */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9">
          <path d="M12 3v3M20 3v3M12 26v3M20 26v3M3 12h3M3 20h3M26 12h3M26 20h3" />
        </g>
        {/* chip package */}
        <rect x="6" y="6" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2.2" />
        {/* die forming an "E" */}
        <path
          d="M20 11.5h-6.5v9H20M13.5 16h5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Logo({
  className,
  href = '/',
  onDark = false
}: {
  className?: string
  href?: string
  onDark?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="EpiHardware — accueil"
    >
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
      <span
        className={cn(
          'font-display text-lg font-extrabold tracking-tight',
          onDark ? 'text-white' : 'text-slate-900 dark:text-white'
        )}
      >
        Epi
        <span className={onDark ? 'text-brand-400' : 'text-brand-600 dark:text-brand-400'}>
          Hardware
        </span>
      </span>
    </Link>
  )
}
