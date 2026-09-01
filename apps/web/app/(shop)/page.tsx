import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headset } from 'lucide-react'
import { Button, Container } from '@epihardware/ui'
import { getCategories, getFeaturedProducts, getProducts } from '@/lib/data/catalog'
import type { ProductDTO } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { ProductImage } from '@/components/product-image'
import { SectionHeading } from '@/components/section-heading'
import { Price } from '@/components/price'

const VALUE_PROPS = [
  { icon: Truck, title: 'Livraison 24-48h', text: 'Suivie partout en France.' },
  { icon: ShieldCheck, title: 'Garantie 2 ans', text: 'Sur tous les composants.' },
  { icon: RotateCcw, title: 'Retour 30 jours', text: 'Gratuit, sans condition.' },
  { icon: Headset, title: 'Support expert', text: 'Des passionnés à l’écoute.' }
]

export default async function HomePage() {
  const [{ products: all }, featured, categories] = await Promise.all([
    getProducts({ perPage: 200, sort: 'featured' }),
    getFeaturedProducts(10),
    getCategories()
  ])
  const hero = featured[0]

  const byCategory = new Map<string, ProductDTO[]>()
  for (const p of all) {
    const list = byCategory.get(p.category.slug) ?? []
    if (list.length < 4) list.push(p)
    byCategory.set(p.category.slug, list)
  }

  return (
    <div className="pb-10">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950">
        <div className="blob left-1/2 top-[-30%] h-[380px] w-[520px] -translate-x-1/2 bg-brand-500/25" />
        <Container className="relative grid grid-cols-1 items-center gap-8 pb-28 pt-12 lg:grid-cols-2 lg:pb-32 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-brand-300">
              Nouvelle collection RTX 40 & Ryzen 7000
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Le hardware au{' '}
              <span className="bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
                meilleur prix
              </span>
              .
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-300">
              Cartes graphiques, processeurs et périphériques gaming — sélectionnés par des experts,
              livrés en 24-48h.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Découvrir la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
              >
                <Link href="/products?sort=featured">Les best-sellers</Link>
              </Button>
            </div>
          </div>

          {hero && (
            <Link
              href={`/products/${hero.slug}`}
              className="group hidden justify-self-end rounded-lg bg-white p-5 shadow-soft-lg lg:block lg:w-[22rem]"
            >
              <div className="relative aspect-square overflow-hidden rounded bg-white">
                <ProductImage
                  src={hero.imageUrl}
                  alt={hero.name}
                  priority
                  fit="contain"
                  className="p-3 transition-transform duration-300 group-hover:scale-105"
                  sizes="360px"
                />
                <span className="absolute left-1 top-1 rounded bg-brand-500 px-1.5 py-0.5 text-[11px] font-bold text-navy-900">
                  Coup de cœur
                </span>
              </div>
              <p className="mt-3 line-clamp-1 text-sm font-medium text-slate-800">{hero.name}</p>
              <div className="mt-1">
                <Price value={hero.price} />
              </div>
            </Link>
          )}
        </Container>
      </section>

      {/* Department cards — overlap the banner */}
      <Container className="relative z-10 -mt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => {
            const items = byCategory.get(c.slug) ?? []
            return (
              <div
                key={c.id}
                className="flex flex-col rounded border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  {c.name}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group flex flex-col"
                      title={p.name}
                    >
                      <span className="relative block aspect-square overflow-hidden rounded bg-white">
                        <ProductImage
                          src={p.imageUrl}
                          alt={p.name}
                          fit="contain"
                          className="p-2 transition-transform duration-300 group-hover:scale-105"
                          sizes="140px"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="a-link mt-3 inline-block text-sm font-medium"
                >
                  Voir tout {c.name.toLowerCase()}
                </Link>
              </div>
            )
          })}
        </div>
      </Container>

      {/* Featured */}
      <section className="pt-12">
        <Container>
          <div className="rounded border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <SectionHeading
              title="Nos coups de cœur"
              description="Les composants qui font la différence."
              action={{ label: 'Toute la boutique', href: '/products' }}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {featured.slice(0, 10).map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 5} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section className="pt-8">
        <Container>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div
                key={v.title}
                className="flex items-center gap-3 rounded border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <v.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
