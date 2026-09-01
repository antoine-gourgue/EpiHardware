import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export function CartLink({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}
      className="hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500/50 dark:hover:text-brand-300 relative inline-grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <ShoppingCart className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="bg-brand-600 absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-white ring-2 ring-slate-50 dark:ring-slate-950">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
