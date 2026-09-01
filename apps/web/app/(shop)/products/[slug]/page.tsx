import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { Badge, Container, Separator } from '@epihardware/ui'
import { getProductBySlug, getRelatedProducts } from '@/lib/data/catalog'
import { formatPrice } from '@/lib/format'
import { ProductImage } from '@/components/product-image'
import { RatingStars } from '@/components/rating-stars'
import { ProductCard } from '@/components/product-card'
import { ProductPurchase } from '@/components/product/product-purchase'
import { SectionHeading } from '@/components/section-heading'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produit introuvable' }
  return { title: product.name, description: product.description }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)
  const inStock = product.stock > 0

  return (
    <Container className="py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-brand-600">
          Boutique
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-slate-700 dark:text-slate-300">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              priority
              fit="contain"
              className="p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.featured && (
              <Badge variant="brand" className="shadow-soft absolute left-4 top-4">
                Coup de cœur
              </Badge>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="text-brand-600 dark:text-brand-400 text-sm font-semibold uppercase tracking-wide hover:underline"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} showValue />
            <Separator className="h-4 w-px" />
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" /> En stock
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600">Rupture de stock</span>
            )}
          </div>

          <p className="font-display mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(product.price)}
            <span className="ml-2 align-middle text-sm font-medium text-slate-400">TTC</span>
          </p>

          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <div className="mt-7">
            <ProductPurchase
              productId={product.id}
              productName={product.name}
              stock={product.stock}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, label: 'Livraison 24-48h' },
              { icon: ShieldCheck, label: 'Garantie 2 ans' },
              { icon: RotateCcw, label: 'Retour 30 jours' }
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <f.icon className="text-brand-600 dark:text-brand-400 h-4 w-4 flex-none" />
                <span className="text-slate-600 dark:text-slate-300">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="Vous aimerez aussi" eyebrow={product.category.name} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
