import { Star } from 'lucide-react'
import { cn } from '@epihardware/ui'

export function RatingStars({
  rating,
  className,
  showValue = false
}: {
  rating: number
  className?: string
  showValue?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  )
}
