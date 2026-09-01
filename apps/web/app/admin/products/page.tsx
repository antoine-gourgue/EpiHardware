import type { Metadata } from 'next'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { Badge, Button } from '@epihardware/ui'
import { getAdminProducts } from '@/lib/data/admin'
import { formatPrice } from '@/lib/format'
import { ProductImage } from '@/components/product-image'
import { ProductSearch } from '@/components/admin/product-search'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export const metadata: Metadata = { title: 'Produits' }

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const products = await getAdminProducts(q)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Produits
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {products.length} produit{products.length > 1 ? 's' : ''} au catalogue
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <ProductSearch initial={q ?? ''} />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3 font-semibold">Produit</th>
                <th className="px-5 py-3 font-semibold">Catégorie</th>
                <th className="px-5 py-3 font-semibold">Prix</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-11 w-11 flex-none overflow-hidden rounded-lg bg-white ring-1 ring-slate-100 dark:ring-slate-800">
                        <ProductImage
                          src={p.imageUrl}
                          alt={p.name}
                          fit="contain"
                          className="p-1"
                          sizes="44px"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900 dark:text-white">
                          {p.name}
                        </p>
                        {p.featured && (
                          <Badge variant="brand" className="mt-0.5">
                            Coup de cœur
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.category.name}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        p.stock <= 12
                          ? 'font-medium text-amber-600 dark:text-amber-400'
                          : 'text-slate-500'
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        aria-label={`Modifier ${p.name}`}
                        className="hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 inline-grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  )
}
