import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getBrands, getCategories } from '@/lib/data/catalog'
import { getAdminProductById } from '@/lib/data/admin'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Modifier un produit' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
    getBrands()
  ])
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="hover:text-brand-600 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux produits
      </Link>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {product.name}
      </h1>
      <ProductForm categories={categories} brands={brands} product={product} />
    </div>
  )
}
