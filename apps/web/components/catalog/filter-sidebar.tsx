import Link from 'next/link'
import { cn } from '@epihardware/ui'
import type { BrandDTO, CategoryDTO } from '@/lib/types'
import { catalogHref, type CatalogParams } from '@/lib/query'

function FilterGroup({
  title,
  items,
  activeSlug,
  params,
  paramKey
}: {
  title: string
  items: { slug: string; name: string; count?: number }[]
  activeSlug?: string
  params: CatalogParams
  paramKey: 'category' | 'brand'
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      <ul className="space-y-0.5">
        <li>
          <Link
            href={catalogHref(params, { [paramKey]: undefined, page: 1 } as Partial<CatalogParams>)}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition',
              !activeSlug
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            Tout
          </Link>
        </li>
        {items.map((it) => {
          const active = activeSlug === it.slug
          return (
            <li key={it.slug}>
              <Link
                href={catalogHref(params, {
                  [paramKey]: active ? undefined : it.slug,
                  page: 1
                } as Partial<CatalogParams>)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span>{it.name}</span>
                {it.count != null && <span className="text-xs text-slate-400">{it.count}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function FilterSidebar({
  categories,
  brands,
  params
}: {
  categories: CategoryDTO[]
  brands: BrandDTO[]
  params: CatalogParams
}) {
  return (
    <div className="space-y-8">
      <FilterGroup
        paramKey="category"
        title="Catégories"
        params={params}
        activeSlug={params.category}
        items={categories.map((c) => ({ slug: c.slug, name: c.name, count: c.productCount }))}
      />
      <FilterGroup
        paramKey="brand"
        title="Marques"
        params={params}
        activeSlug={params.brand}
        items={brands.map((b) => ({ slug: b.slug, name: b.name }))}
      />
    </div>
  )
}
