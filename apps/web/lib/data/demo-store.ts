import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_PRODUCTS, type DemoProduct } from '@epihardware/db/demo'
import type { BrandDTO, CategoryDTO, ProductDTO } from '../types'

/**
 * In-memory projection of the demo catalogue into the same DTOs the database
 * path returns. IDs are derived from slugs so they stay stable across renders.
 */

export const demoCategories: CategoryDTO[] = DEMO_CATEGORIES.map((c) => ({
  id: c.slug,
  name: c.name,
  slug: c.slug,
  description: c.description,
  icon: c.icon,
  productCount: DEMO_PRODUCTS.filter((p) => p.categorySlug === c.slug).length
}))

export const demoBrands: BrandDTO[] = DEMO_BRANDS.map((b) => ({
  id: b.slug,
  name: b.name,
  slug: b.slug
}))

function toDTO(p: DemoProduct): ProductDTO {
  const category = DEMO_CATEGORIES.find((c) => c.slug === p.categorySlug)!
  const brand = DEMO_BRANDS.find((b) => b.slug === p.brandSlug) ?? null
  return {
    id: p.slug,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    rating: p.rating,
    featured: p.featured,
    category: { name: category.name, slug: category.slug },
    brand: brand ? { name: brand.name, slug: brand.slug } : null
  }
}

export const demoProducts: ProductDTO[] = DEMO_PRODUCTS.map(toDTO)

export function demoProductById(id: string): ProductDTO | undefined {
  return demoProducts.find((p) => p.id === id || p.slug === id)
}
