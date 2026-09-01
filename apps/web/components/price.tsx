import { cn } from '@epihardware/ui'
import { toNumber } from '@/lib/format'

const intFormatter = new Intl.NumberFormat('fr-FR')

/** Amazon-style price: large integer with a superscript cents + currency. */
export function Price({
  value,
  className,
  size = 'md'
}: {
  value: number | string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const n = toNumber(value)
  const [int, dec] = n.toFixed(2).split('.')
  const big = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  const small = size === 'lg' ? 'text-sm' : 'text-xs'
  return (
    <span
      className={cn(
        'inline-flex items-start font-semibold leading-none text-slate-900 dark:text-white',
        className
      )}
    >
      <span className={cn('mt-0 leading-none', small)}>€</span>
      <span className={cn('font-display font-extrabold leading-none', big)}>
        {intFormatter.format(Number(int))}
      </span>
      <span className={cn('mt-0.5 leading-none', small)}>{dec}</span>
    </span>
  )
}
