'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button, FieldError, Input, Label, Select, Spinner, Textarea } from '@epihardware/ui'
import { createProductAction, updateProductAction } from '@/lib/actions/admin'
import type { BrandDTO, CategoryDTO } from '@/lib/types'
import type { AdminProductDetail } from '@/lib/data/admin'

export function ProductForm({
  categories,
  brands,
  product
}: {
  categories: CategoryDTO[]
  brands: BrandDTO[]
  product?: AdminProductDetail
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '',
    imageUrl: product?.imageUrl ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    brandId: product?.brandId ?? '',
    featured: product?.featured ?? false
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const payload = { ...form, brandId: form.brandId || null }
    const res = product
      ? await updateProductAction(product.id, payload)
      : await createProductAction(payload)
    setLoading(false)
    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors)
      if (res.error) toast.error(res.error)
      return
    }
    toast.success(product ? 'Produit mis à jour' : 'Produit créé')
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            <FieldError>{errors.description}</FieldError>
          </div>
          <div>
            <Label htmlFor="imageUrl">URL de l’image</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…"
            />
            <FieldError>{errors.imageUrl}</FieldError>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
              <FieldError>{errors.price}</FieldError>
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
              />
              <FieldError>{errors.stock}</FieldError>
            </div>
          </div>
          <div>
            <Label htmlFor="categoryId">Catégorie</Label>
            <Select
              id="categoryId"
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <FieldError>{errors.categoryId}</FieldError>
          </div>
          <div>
            <Label htmlFor="brandId">Marque</Label>
            <Select
              id="brandId"
              value={form.brandId}
              onChange={(e) => set('brandId', e.target.value)}
            >
              <option value="">— Aucune —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-slate-300"
            />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Mettre en avant (coup de cœur)
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          {product ? 'Enregistrer' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  )
}
