import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@epihardware/ui'

export function CartLink({ count, onDark = false }: { count: number; onDark?: boolean }) {
  return (
    <Link
      href="/cart"
      aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}
      className={cn(
        'relative inline-grid h-10 w-10 place-items-center rounded-lg border transition',
        onDark
          ? 'border-white/15 bg-white/5 text-slate-100 hover:border-white/30 hover:bg-white/10 hover:text-white'
          : 'hover:border-brand-400 hover:text-brand-600 dark:hover:border-brand-500/50 dark:hover:text-brand-300 border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
      )}
    >
      <ShoppingCart className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span
          className={cn(
            'bg-brand-500 text-navy-900 absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold ring-2',
            onDark ? 'ring-navy-900' : 'ring-slate-50 dark:ring-slate-950'
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
