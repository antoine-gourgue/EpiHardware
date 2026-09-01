import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react'
import { Button, Separator } from '@epihardware/ui'
import { getCurrentUser } from '@/lib/session'
import { getOrderById } from '@/lib/data/orders'
import { formatDate, formatPrice } from '@/lib/format'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { ProductImage } from '@/components/product-image'

export const metadata: Metadata = { title: 'Détail de la commande' }

export default async function OrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) return null
  const { id } = await params
  const { success } = await searchParams
  const order = await getOrderById(id, user)
  if (!order) notFound()

  const itemsTotal = order.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0)

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="hover:text-brand-600 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Toutes mes commandes
      </Link>

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6 flex-none" />
          <div>
            <p className="font-semibold">Merci pour votre commande !</p>
            <p className="text-sm">Un email de confirmation vous a été envoyé.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {order.reference}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">Passée le {formatDate(order.createdAt)}</p>
          </div>
          <Button asChild variant="outline">
            <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Facture PDF
            </a>
          </Button>
        </div>

        <Separator className="my-6" />

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 py-4">
              <span className="relative h-16 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800">
                <ProductImage
                  src={it.imageUrl}
                  alt={it.name}
                  fit="contain"
                  className="p-1.5"
                  sizes="64px"
                />
              </span>
              <div className="min-w-0 flex-1">
                {it.productSlug ? (
                  <Link
                    href={`/products/${it.productSlug}`}
                    className="hover:text-brand-600 font-semibold text-slate-900 dark:text-white"
                  >
                    {it.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white">{it.name}</span>
                )}
                <p className="text-sm text-slate-500">
                  {formatPrice(it.unitPrice)} × {it.quantity}
                </p>
              </div>
              <span className="font-display font-extrabold text-slate-900 dark:text-white">
                {formatPrice(it.unitPrice * it.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <Separator className="my-6" />

        <dl className="ml-auto max-w-xs space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <dt>Sous-total</dt>
            <dd className="tabular-nums">{formatPrice(itemsTotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <dt>Livraison</dt>
            <dd className="text-emerald-600 dark:text-emerald-400">Offerte</dd>
          </div>
          <Separator />
          <div className="flex justify-between text-base">
            <dt className="font-semibold text-slate-900 dark:text-white">Total</dt>
            <dd className="font-display text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
