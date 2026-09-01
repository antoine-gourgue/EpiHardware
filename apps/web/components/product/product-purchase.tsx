'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import { Button, Spinner } from '@epihardware/ui'
import { addToCartAction } from '@/lib/actions/cart'

export function ProductPurchase({
  productId,
  productName,
  stock
}: {
  productId: string
  productName: string
  stock: number
}) {
  const [qty, setQty] = useState(1)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const max = Math.max(1, Math.min(stock, 20))
  const disabled = stock <= 0

  function add(then?: () => void) {
    startTransition(async () => {
      await addToCartAction(productId, qty)
      toast.success('Ajouté au panier', { description: `${qty} × ${productName}` })
      then?.()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={disabled || qty <= 1}
            className="grid h-11 w-11 place-items-center rounded-l-xl text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Diminuer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="grid h-11 w-12 place-items-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={disabled || qty >= max}
            className="grid h-11 w-11 place-items-center rounded-r-xl text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Augmenter"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {stock > 0 && stock <= 5 && (
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Plus que {stock} en stock
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="cart"
          onClick={() => add()}
          disabled={disabled || pending}
          className="flex-1"
        >
          {pending ? <Spinner className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {disabled ? 'Indisponible' : 'Ajouter au panier'}
        </Button>
        <Button
          size="lg"
          variant="buy"
          onClick={() => add(() => router.push('/cart'))}
          disabled={disabled || pending}
          className="flex-1"
        >
          <Zap className="h-4 w-4" />
          Acheter maintenant
        </Button>
      </div>
    </div>
  )
}
