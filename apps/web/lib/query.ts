import type { ProductSort } from './types'

export interface CatalogParams {
  category?: string
  brand?: string
  search?: string
  sort?: ProductSort
  page?: number
}

/** Build a `/products?...` href, dropping empty values and resetting page. */
export function catalogHref(base: CatalogParams, patch: Partial<CatalogParams>): string {
  const merged = { ...base, ...patch }
  const sp = new URLSearchParams()
  if (merged.category) sp.set('category', merged.category)
  if (merged.brand) sp.set('brand', merged.brand)
  if (merged.search) sp.set('search', merged.search)
  if (merged.sort && merged.sort !== 'featured') sp.set('sort', merged.sort)
  if (merged.page && merged.page > 1) sp.set('page', String(merged.page))
  const qs = sp.toString()
  return qs ? `/products?${qs}` : '/products'
}

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Recommandés' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' }
]
