'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Spinner } from '@epihardware/ui'
import type { CartLineDTO } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { removeFromCartAction, setCartQtyAction } from '@/lib/actions/cart'
import { ProductImage } from '@/components/product-image'

export function CartLine({ line }: { line: CartLineDTO }) {
  const [pending, startTransition] = useTransition()
  const max = Math.max(1, Math.min(line.stock, 20))

  function setQty(q: number) {
    if (q < 1 || q > max) return
    startTransition(() => setCartQtyAction(line.productId, q))
  }
  function remove() {
    startTransition(() => removeFromCartAction(line.productId))
  }

  return (
    <div className="flex gap-4 py-5" data-pending={pending}>
      <Link
        href={`/products/${line.slug}`}
        className="relative h-24 w-24 flex-none overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800"
      >
        <ProductImage
          src={line.imageUrl}
          alt={line.name}
          fit="contain"
          className="p-2"
          sizes="96px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${line.slug}`}
            className="hover:text-brand-600 line-clamp-2 font-semibold text-slate-900 dark:text-white"
          >
            {line.name}
          </Link>
          <button
            onClick={remove}
            disabled={pending}
            className="flex-none rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            aria-label="Retirer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setQty(line.quantity - 1)}
              disabled={pending || line.quantity <= 1}
              className="grid h-9 w-9 place-items-center rounded-l-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Diminuer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="grid h-9 w-9 place-items-center text-sm font-semibold tabular-nums">
              {pending ? <Spinner className="h-3.5 w-3.5" /> : line.quantity}
            </span>
            <button
              onClick={() => setQty(line.quantity + 1)}
              disabled={pending || line.quantity >= max}
              className="grid h-9 w-9 place-items-center rounded-r-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Augmenter"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-display font-extrabold text-slate-900 dark:text-white">
            {formatPrice(line.price * line.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
