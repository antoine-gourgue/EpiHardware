import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Package,
  Layers,
  Tag,
  Wallet,
  AlertTriangle,
  ShoppingCart,
  Users,
  ArrowRight
} from 'lucide-react'
import { Button } from '@epihardware/ui'
import { getAdminStats, getAdminProducts } from '@/lib/data/admin'
import { isDemoMode } from '@/lib/env'
import { formatPrice } from '@/lib/format'
import { ProductImage } from '@/components/product-image'

export const metadata: Metadata = { title: 'Tableau de bord' }

export default async function AdminDashboard() {
  const [stats, products] = await Promise.all([getAdminStats(), getAdminProducts()])
  const lowStock = products.filter((p) => p.stock <= 12).slice(0, 6)

  const cards = [
    { label: 'Produits', value: String(stats.products), icon: Package },
    { label: 'Catégories', value: String(stats.categories), icon: Layers },
    { label: 'Marques', value: String(stats.brands), icon: Tag },
    { label: 'Valeur du catalogue', value: formatPrice(stats.catalogValue), icon: Wallet },
    ...(stats.orders != null
      ? [{ label: 'Commandes', value: String(stats.orders), icon: ShoppingCart }]
      : []),
    ...(stats.revenue != null
      ? [{ label: 'Chiffre d’affaires', value: formatPrice(stats.revenue), icon: Wallet }]
      : []),
    ...(stats.customers != null
      ? [{ label: 'Clients', value: String(stats.customers), icon: Users }]
      : [])
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Vue d’ensemble de votre boutique.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Package className="h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {isDemoMode && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 flex-none" />
          Mode démo : les statistiques de vente et les écritures sont désactivées.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">{c.label}</span>
              <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 grid h-9 w-9 place-items-center rounded-lg">
                <c.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Stock faible</h2>
          </div>
          <Link
            href="/admin/products"
            className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 text-sm font-medium"
          >
            Tout gérer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">Aucun produit en stock faible. 👍</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <span className="relative h-11 w-11 flex-none overflow-hidden rounded-lg bg-white ring-1 ring-slate-100 dark:ring-slate-800">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.name}
                    fit="contain"
                    className="p-1"
                    sizes="44px"
                  />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">
                  {p.name}
                </span>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                  {p.stock} en stock
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
