import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getBrands, getCategories } from '@/lib/data/catalog'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Nouveau produit' }

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()])

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
        Nouveau produit
      </h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
