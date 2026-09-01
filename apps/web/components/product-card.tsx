import Link from 'next/link'
import type { ProductDTO } from '@/lib/types'
import { ProductImage } from './product-image'
import { RatingStars } from './rating-stars'
import { AddToCartButton } from './add-to-cart-button'
import { Price } from './price'

/** Deterministic pseudo review count so cards show an Amazon-like "(1 234)". */
function reviewCount(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return 42 + (h % 3958)
}

export function ProductCard({ product, priority }: { product: ProductDTO; priority?: boolean }) {
  const outOfStock = product.stock <= 0
  const reviews = reviewCount(product.slug)

  return (
    <div className="group relative flex flex-col rounded border border-slate-200 bg-white p-3 transition hover:shadow-soft-lg dark:border-slate-800 dark:bg-slate-900">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          priority={priority}
          fit="contain"
          className="p-3 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {product.featured && (
          <span className="absolute left-1 top-1 rounded bg-brand-500 px-1.5 py-0.5 text-[11px] font-bold text-navy-900">
            Populaire
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            Rupture
          </span>
        )}
      </Link>

      <div className="mt-2 flex flex-1 flex-col">
        <span className="text-xs text-slate-500">
          {product.brand?.name ?? product.category.name}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-slate-800 transition-colors group-hover:text-link-hover dark:text-slate-100"
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-link dark:text-brand-300">
            {reviews.toLocaleString('fr-FR')}
          </span>
        </div>

        <div className="mt-1.5">
          <Price value={product.price} />
        </div>

        <p className="mt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Livraison GRATUITE
          </span>{' '}
          dès 100 €
        </p>

        <div className="mt-2.5">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            size="sm"
            className="w-full rounded-full"
            disabled={outOfStock}
          />
        </div>
      </div>
    </div>
  )
}
