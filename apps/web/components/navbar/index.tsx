import Link from 'next/link'
import { Container } from '@epihardware/ui'
import { getCart } from '@/lib/data/cart'
import { getCategories } from '@/lib/data/catalog'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from './search-bar'
import { UserMenu } from './user-menu'
import { CartLink } from './cart-link'
import { MobileNav } from './mobile-nav'

const DARK_ICON_BTN =
  'border-white/15 bg-white/5 text-slate-100 hover:border-white/30 hover:bg-white/10 hover:text-white dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10'

export async function Navbar() {
  const [cart, categories] = await Promise.all([getCart(), getCategories()])

  return (
    <header className="bg-navy-900 sticky top-0 z-50 text-white">
      <Container className="flex h-16 items-center gap-3 sm:gap-4">
        <Logo onDark className="flex-none" />

        <SearchBar className="hidden max-w-2xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className={DARK_ICON_BTN} />
          <CartLink count={cart.itemCount} onDark />
          <div className="hidden sm:block">
            <UserMenu onDark />
          </div>
          <MobileNav categories={categories} />
        </div>
      </Container>

      {/* Department strip (Amazon-like secondary nav) */}
      <div className="bg-navy-700 hidden border-t border-white/10 lg:block">
        <Container className="flex h-10 items-center gap-0.5 text-sm">
          <Link
            href="/products"
            className="rounded px-2.5 py-1 font-semibold text-white transition hover:bg-white/10"
          >
            Tous les rayons
          </Link>
          {categories.slice(0, 7).map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="rounded px-2.5 py-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/products?sort=newest"
            className="text-brand-400 ml-auto rounded px-2.5 py-1 font-semibold transition hover:bg-white/10"
          >
            Nouveautés
          </Link>
        </Container>
      </div>
    </header>
  )
}
