import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Package, ShoppingBag } from 'lucide-react'
import { Button } from '@epihardware/ui'
import { getCurrentUser } from '@/lib/session'
import { getUserOrders } from '@/lib/data/orders'
import { formatDate, formatPrice } from '@/lib/format'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { ProductImage } from '@/components/product-image'

export const metadata: Metadata = { title: 'Mes commandes' }

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const orders = await getUserOrders(user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mes commandes
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Retrouvez l’historique et les factures de vos achats.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <span className="bg-brand-50 text-brand-500 dark:bg-brand-500/10 grid h-14 w-14 place-items-center rounded-2xl">
            <Package className="h-7 w-7" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Aucune commande pour le moment
          </h3>
          <p className="mt-1 text-sm text-slate-500">Vos futurs achats apparaîtront ici.</p>
          <Button asChild className="mt-5">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4" />
              Commencer mes achats
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="hover:border-brand-200 hover:shadow-soft dark:hover:border-brand-500/40 group block rounded-2xl border border-slate-200/80 bg-white p-5 transition dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-slate-900 dark:text-white">
                      {order.reference}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 4).map((it) => (
                      <span
                        key={it.id}
                        className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white bg-white dark:border-slate-900"
                      >
                        <ProductImage
                          src={it.imageUrl}
                          alt={it.name}
                          fit="contain"
                          className="p-1"
                          sizes="48px"
                        />
                      </span>
                    ))}
                    {order.items.length > 4 && (
                      <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500 dark:border-slate-900 dark:bg-slate-800">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronRight className="group-hover:text-brand-600 h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
