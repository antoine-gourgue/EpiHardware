import Link from 'next/link'
import { Badge } from '@epihardware/ui'
import type { ProductDTO } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { ProductImage } from './product-image'
import { RatingStars } from './rating-stars'
import { AddToCartButton } from './add-to-cart-button'

export function ProductCard({ product, priority }: { product: ProductDTO; priority?: boolean }) {
  const outOfStock = product.stock <= 0
  return (
    <div className="hover:border-brand-300 hover:shadow-soft-lg dark:hover:border-brand-500/40 group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-white"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          priority={priority}
          fit="contain"
          className="p-5 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.featured && <Badge variant="brand">Populaire</Badge>}
          {outOfStock && <Badge variant="danger">Rupture</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-brand-600 dark:text-brand-400 text-xs font-medium uppercase tracking-wide">
            {product.brand?.name ?? product.category.name}
          </span>
          <RatingStars rating={product.rating} showValue />
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="group-hover:text-brand-700 dark:group-hover:text-brand-300 line-clamp-2 font-semibold leading-snug text-slate-900 transition-colors dark:text-white">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            size="icon"
            iconOnly
            disabled={outOfStock}
            label="Ajouter au panier"
          />
        </div>
      </div>
    </div>
  )
}
