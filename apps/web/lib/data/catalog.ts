import 'server-only'
import { prisma, type Prisma } from '@epihardware/db'
import { isDemoMode } from '../env'
import type { BrandDTO, CategoryDTO, ProductDTO, ProductSort } from '../types'
import { toNumber } from '../format'
import { demoBrands, demoCategories, demoProductById, demoProducts } from './demo-store'

type ProductRow = Prisma.ProductGetPayload<{
  include: { category: true; brand: true }
}>

function rowToDTO(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: toNumber(p.price),
    stock: p.stock,
    imageUrl: p.imageUrl,
    rating: p.rating,
    featured: p.featured,
    category: { name: p.category.name, slug: p.category.slug },
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug } : null
  }
}

export interface ProductQuery {
  category?: string
  brand?: string
  search?: string
  sort?: ProductSort
  minPrice?: number
  maxPrice?: number
  page?: number
  perPage?: number
}

export interface ProductPage {
  products: ProductDTO[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

const sortComparators: Record<ProductSort, (a: ProductDTO, b: ProductDTO) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: (a, b) => b.name.localeCompare(a.name),
  rating: (a, b) => b.rating - a.rating
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const page = Math.max(1, query.page ?? 1)
  const perPage = query.perPage ?? 9
  const sort = query.sort ?? 'featured'

  if (isDemoMode) {
    let items = demoProducts.slice()
    if (query.category) items = items.filter((p) => p.category.slug === query.category)
    if (query.brand) items = items.filter((p) => p.brand?.slug === query.brand)
    if (query.search) {
      const q = query.search.toLowerCase()
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (query.minPrice != null) items = items.filter((p) => p.price >= query.minPrice!)
    if (query.maxPrice != null) items = items.filter((p) => p.price <= query.maxPrice!)
    items.sort(sortComparators[sort])
    const total = items.length
    const start = (page - 1) * perPage
    return {
      products: items.slice(start, start + perPage),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage))
    }
  }

  const where: Prisma.ProductWhereInput = {
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.brand ? { brand: { slug: query.brand } } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(query.minPrice != null || query.maxPrice != null
      ? {
          price: {
            ...(query.minPrice != null ? { gte: query.minPrice } : {}),
            ...(query.maxPrice != null ? { lte: query.maxPrice } : {})
          }
        }
      : {})
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === 'price-asc'
      ? [{ price: 'asc' }]
      : sort === 'price-desc'
        ? [{ price: 'desc' }]
        : sort === 'newest'
          ? [{ createdAt: 'desc' }]
          : sort === 'rating'
            ? [{ rating: 'desc' }]
            : [{ featured: 'desc' }, { rating: 'desc' }]

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true, brand: true },
      skip: (page - 1) * perPage,
      take: perPage
    }),
    prisma.product.count({ where })
  ])

  return {
    products: rows.map(rowToDTO),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage))
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  if (isDemoMode) return demoProductById(slug) ?? null
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true }
  })
  return row ? rowToDTO(row) : null
}

export async function getRelatedProducts(product: ProductDTO, take = 4): Promise<ProductDTO[]> {
  if (isDemoMode) {
    return demoProducts
      .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
      .slice(0, take)
  }
  const rows = await prisma.product.findMany({
    where: { category: { slug: product.category.slug }, NOT: { id: product.id } },
    include: { category: true, brand: true },
    take
  })
  return rows.map(rowToDTO)
}

export async function getFeaturedProducts(take = 6): Promise<ProductDTO[]> {
  if (isDemoMode) return demoProducts.filter((p) => p.featured).slice(0, take)
  const rows = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true, brand: true },
    orderBy: { rating: 'desc' },
    take
  })
  return rows.map(rowToDTO)
}

export async function searchProducts(term: string, take = 6): Promise<ProductDTO[]> {
  if (!term.trim()) return []
  const { products } = await getProducts({ search: term, perPage: take, sort: 'rating' })
  return products
}

export async function getProductsByIds(ids: string[]): Promise<ProductDTO[]> {
  if (ids.length === 0) return []
  if (isDemoMode) {
    return ids.map((id) => demoProductById(id)).filter((p): p is ProductDTO => Boolean(p))
  }
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { category: true, brand: true }
  })
  return rows.map(rowToDTO)
}

export async function getCategories(): Promise<CategoryDTO[]> {
  if (isDemoMode) return demoCategories
  const rows = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    productCount: c._count.products
  }))
}

export async function getBrands(): Promise<BrandDTO[]> {
  if (isDemoMode) return demoBrands
  const rows = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return rows.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))
}
