import 'server-only'
import { prisma } from '@epihardware/db'
import { isDemoMode } from '../env'
import { toNumber } from '../format'
import type { ProductDTO } from '../types'
import { demoProducts, demoCategories, demoBrands, demoProductById } from './demo-store'

export interface AdminStats {
  products: number
  categories: number
  brands: number
  catalogValue: number
  lowStock: number
  orders?: number
  revenue?: number
  customers?: number
}

export async function getAdminStats(): Promise<AdminStats> {
  if (isDemoMode) {
    return {
      products: demoProducts.length,
      categories: demoCategories.length,
      brands: demoBrands.length,
      catalogValue: demoProducts.reduce((s, p) => s + p.price * p.stock, 0),
      lowStock: demoProducts.filter((p) => p.stock <= 12).length
    }
  }

  const [products, categories, brands, customers, orders, agg, stockAgg, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.findMany({ select: { price: true, stock: true } }),
      prisma.product.count({ where: { stock: { lte: 12 } } })
    ])

  return {
    products,
    categories,
    brands,
    customers,
    orders,
    revenue: toNumber(agg._sum.total ?? 0),
    catalogValue: stockAgg.reduce((s, p) => s + toNumber(p.price) * p.stock, 0),
    lowStock
  }
}

export async function getAdminProducts(search?: string): Promise<ProductDTO[]> {
  if (isDemoMode) {
    const q = search?.toLowerCase().trim()
    return q ? demoProducts.filter((p) => p.name.toLowerCase().includes(q)) : demoProducts
  }
  const rows = await prisma.product.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    include: { category: true, brand: true },
    orderBy: { createdAt: 'desc' }
  })
  return rows.map((p) => ({
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
  }))
}

export interface AdminProductDetail extends ProductDTO {
  categoryId: string
  brandId: string | null
}

export async function getAdminProductById(id: string): Promise<AdminProductDetail | null> {
  if (isDemoMode) {
    const p = demoProductById(id)
    if (!p) return null
    return { ...p, categoryId: p.category.slug, brandId: p.brand?.slug ?? null }
  }
  const p = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true }
  })
  if (!p) return null
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
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug } : null,
    categoryId: p.categoryId,
    brandId: p.brandId
  }
}
