import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button, Container, Separator } from '@epihardware/ui'
import { getCart } from '@/lib/data/cart'
import { getCurrentUser } from '@/lib/session'
import { formatPrice } from '@/lib/format'
import { CartLine } from '@/components/cart/cart-line'
import { CheckoutButton } from '@/components/cart/checkout-button'

export const metadata: Metadata = { title: 'Panier' }

const SHIPPING_THRESHOLD = 100

export default async function CartPage() {
  const [cart, user] = await Promise.all([getCart(), getCurrentUser()])

  if (cart.lines.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <span className="bg-brand-50 text-brand-500 dark:bg-brand-500/10 grid h-16 w-16 place-items-center rounded-2xl">
            <ShoppingBag className="h-8 w-8" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            Votre panier est vide
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Parcourez notre sélection et trouvez le composant idéal.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/products">Découvrir la boutique</Link>
          </Button>
        </div>
      </Container>
    )
  }

  const shipping = cart.subtotal >= SHIPPING_THRESHOLD ? 0 : 6.9
  const total = cart.subtotal + shipping
  const remaining = Math.max(0, SHIPPING_THRESHOLD - cart.subtotal)

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Mon panier
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        {cart.itemCount} article{cart.itemCount > 1 ? 's' : ''}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-2xl border border-slate-200/80 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.lines.map((line) => (
              <li key={line.productId}>
                <CartLine line={line} />
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 py-4 dark:border-slate-800">
            <Link
              href="/products"
              className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuer mes achats
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              Récapitulatif
            </h2>

            {remaining > 0 && (
              <div className="bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mt-4 rounded-xl p-3 text-sm">
                Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison offerte 🎉
              </div>
            )}

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <dt>Sous-total</dt>
                <dd className="font-medium tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <dt>Livraison</dt>
                <dd className="font-medium tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Offerte</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <dt className="font-semibold text-slate-900 dark:text-white">Total</dt>
                <dd className="font-display text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <CheckoutButton isAuthenticated={Boolean(user)} />
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              Paiement sécurisé · Aucune carte requise en démo
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
