import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageOpen, X } from 'lucide-react'
import { Badge, Container } from '@epihardware/ui'
import { getBrands, getCategories, getProducts } from '@/lib/data/catalog'
import type { ProductSort } from '@/lib/types'
import { catalogHref, type CatalogParams } from '@/lib/query'
import { ProductCard } from '@/components/product-card'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { FilterDrawer } from '@/components/catalog/filter-drawer'
import { SortSelect } from '@/components/catalog/sort-select'
import { Pagination } from '@/components/catalog/pagination'

export const metadata: Metadata = { title: 'Boutique' }

const VALID_SORTS: ProductSort[] = ['featured', 'price-asc', 'price-desc', 'newest', 'rating']

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const category = first(sp.category)
  const brand = first(sp.brand)
  const search = first(sp.search)
  const sortRaw = first(sp.sort) as ProductSort | undefined
  const sort: ProductSort = sortRaw && VALID_SORTS.includes(sortRaw) ? sortRaw : 'featured'
  const page = Math.max(1, Number(first(sp.page)) || 1)

  const params: CatalogParams = { category, brand, search, sort, page }

  const [{ products, total, totalPages }, categories, brands] = await Promise.all([
    getProducts({ category, brand, search, sort, page, perPage: 9 }),
    getCategories(),
    getBrands()
  ])

  const activeCategory = categories.find((c) => c.slug === category)
  const activeBrand = brands.find((b) => b.slug === brand)

  return (
    <>
      <section className="border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-900/40">
        <Container className="py-10 sm:py-12">
          <p className="text-brand-600 dark:text-brand-400 text-sm font-semibold uppercase tracking-wide">
            Boutique
          </p>
          <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {activeCategory?.name ??
              (search ? `Résultats pour « ${search} »` : 'Tous les produits')}
          </h1>
          {activeCategory?.description && (
            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
              {activeCategory.description}
            </p>
          )}
        </Container>
      </section>

      <Container className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar categories={categories} brands={brands} params={params} />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FilterDrawer>
                <FilterSidebar categories={categories} brands={brands} params={params} />
              </FilterDrawer>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{total}</span>{' '}
                produit
                {total > 1 ? 's' : ''}
              </p>
            </div>
            <SortSelect value={sort} />
          </div>

          {(activeCategory || activeBrand || search) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {activeCategory && (
                <FilterChip href={catalogHref(params, { category: undefined, page: 1 })}>
                  {activeCategory.name}
                </FilterChip>
              )}
              {activeBrand && (
                <FilterChip href={catalogHref(params, { brand: undefined, page: 1 })}>
                  {activeBrand.name}
                </FilterChip>
              )}
              {search && (
                <FilterChip href={catalogHref(params, { search: undefined, page: 1 })}>
                  « {search} »
                </FilterChip>
              )}
              <Link
                href="/products"
                className="hover:text-brand-600 text-sm font-medium text-slate-400 underline-offset-2 hover:underline"
              >
                Réinitialiser
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
              <PackageOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                Aucun produit trouvé
              </h3>
              <p className="mt-1 text-sm text-slate-500">Essayez d’ajuster vos filtres.</p>
              <Link
                href="/products"
                className="text-brand-600 hover:text-brand-700 mt-4 text-sm font-semibold"
              >
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 3} />
                ))}
              </div>
              <Pagination params={params} page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </Container>
    </>
  )
}

function FilterChip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <Badge
        variant="neutral"
        className="gap-1.5 py-1 pl-2.5 pr-2 transition hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        {children}
        <X className="h-3 w-3" />
      </Badge>
    </Link>
  )
}
