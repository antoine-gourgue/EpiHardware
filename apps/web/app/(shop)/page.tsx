import Link from 'next/link'
import { ArrowRight, Sparkles, Truck, ShieldCheck, Headset, RotateCcw } from 'lucide-react'
import { Badge, Button, Container } from '@epihardware/ui'
import { getBrands, getCategories, getFeaturedProducts } from '@/lib/data/catalog'
import { formatPrice } from '@/lib/format'
import { ProductCard } from '@/components/product-card'
import { ProductImage } from '@/components/product-image'
import { CategoryIcon } from '@/components/category-icon'
import { SectionHeading } from '@/components/section-heading'
import { RatingStars } from '@/components/rating-stars'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Reveal } from '@/components/reveal'

const VALUE_PROPS = [
  {
    icon: Truck,
    title: 'Livraison 24-48h',
    text: 'Expédition rapide et suivie partout en France.'
  },
  {
    icon: ShieldCheck,
    title: 'Garantie 2 ans',
    text: 'Tous nos composants sont garantis constructeur.'
  },
  {
    icon: RotateCcw,
    title: 'Retour 30 jours',
    text: 'Changé d’avis ? Retour gratuit sous 30 jours.'
  },
  { icon: Headset, title: 'Support expert', text: 'Une équipe de passionnés pour vous conseiller.' }
]

export default async function HomePage() {
  const [featured, categories, brands] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getBrands()
  ])
  const hero = featured[0]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="blob bg-brand-500/25 left-[-10%] top-[-20%] h-[420px] w-[420px]" />
        <div className="blob right-[-5%] top-[10%] h-[360px] w-[360px] bg-violet-500/20" />
        <Container className="relative grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Nouvelle collection RTX 40 & Ryzen 7000
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Montez le PC de <span className="text-gradient">vos rêves</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-500 dark:text-slate-400">
              Cartes graphiques, processeurs et périphériques haut de gamme, sélectionnés par des
              experts. La performance sans compromis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Découvrir la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/products?sort=featured">Les best-sellers</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                { n: '28+', l: 'Produits' },
                { n: '10', l: 'Marques' },
                { n: '4.8/5', l: 'Satisfaction' }
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                    {s.n}
                  </dt>
                  <dd className="text-sm text-slate-500 dark:text-slate-400">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {hero && (
            <div className="animate-fade-up relative [animation-delay:120ms]">
              <div className="from-brand-500/20 absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[2rem] bg-gradient-to-br to-violet-500/20 blur-2xl" />
              <div className="shadow-soft-lg rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                  <ProductImage
                    src={hero.imageUrl}
                    alt={hero.name}
                    priority
                    fit="contain"
                    className="p-6"
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                  <Badge variant="brand" className="shadow-soft absolute left-4 top-4">
                    Coup de cœur
                  </Badge>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <RatingStars rating={hero.rating} showValue className="mb-1" />
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                      {hero.name}
                    </h3>
                    <p className="font-display text-brand-600 dark:text-brand-400 text-xl font-extrabold">
                      {formatPrice(hero.price)}
                    </p>
                  </div>
                  <AddToCartButton
                    productId={hero.id}
                    productName={hero.name}
                    className="flex-none"
                  />
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Brand marquee */}
      <section className="border-y border-slate-200/70 bg-white/60 py-6 dark:border-slate-800/70 dark:bg-slate-900/40">
        <div className="mask-fade-r overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-14 pr-14">
            {[...brands, ...brands].map((b, i) => (
              <span
                key={`${b.id}-${i}`}
                className="font-display text-xl font-bold text-slate-400 dark:text-slate-600"
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Explorer"
            title="Toutes les catégories"
            description="Trouvez exactement le composant qu’il vous faut."
            action={{ label: 'Tout voir', href: '/products' }}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.04}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="hover:border-brand-200 hover:shadow-soft dark:hover:border-brand-500/40 group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="bg-brand-50 text-brand-600 group-hover:bg-brand-600 dark:bg-brand-500/10 dark:text-brand-300 grid h-12 w-12 place-items-center rounded-xl transition-colors group-hover:text-white">
                    <CategoryIcon name={c.icon} className="h-6 w-6" />
                  </span>
                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {c.productCount ?? 0} produits
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="py-4 sm:py-8">
        <Container>
          <SectionHeading
            eyebrow="Sélection"
            title="Nos coups de cœur"
            description="Les composants qui font la différence, choisis pour vous."
            action={{ label: 'Toute la boutique', href: '/products' }}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 grid h-11 w-11 place-items-center rounded-xl">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="pb-8">
        <Container>
          <div className="from-brand-600 relative overflow-hidden rounded-[2rem] bg-gradient-to-br to-violet-600 px-8 py-14 text-center sm:px-16 sm:py-20">
            <div className="blob left-[10%] top-[-30%] h-64 w-64 bg-white/20" />
            <div className="blob bg-brand-950/30 bottom-[-40%] right-[10%] h-72 w-72" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Prêt à passer au niveau supérieur ?
              </h2>
              <p className="text-brand-100 mt-4 text-lg">
                Rejoignez EpiHardware et profitez d’offres exclusives sur les meilleurs composants
                du marché.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register">Créer un compte</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  <Link href="/products">Parcourir la boutique</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
