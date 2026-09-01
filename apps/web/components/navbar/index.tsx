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
import { CategoriesDropdown } from './categories-dropdown'

export async function Navbar() {
  const [cart, categories] = await Promise.all([getCart(), getCategories()])

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70">
      <Container className="flex h-16 items-center gap-3 sm:gap-4">
        <Logo />

        <nav className="hidden items-center lg:flex">
          <Link
            href="/products"
            className="hover:text-brand-700 dark:hover:text-brand-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition dark:text-slate-300"
          >
            Boutique
          </Link>
          <CategoriesDropdown categories={categories} />
          <Link
            href="/products?sort=newest"
            className="hover:text-brand-700 dark:hover:text-brand-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition dark:text-slate-300"
          >
            Nouveautés
          </Link>
        </nav>

        <SearchBar className="ml-auto hidden max-w-md flex-1 md:block" />

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle />
          <CartLink count={cart.itemCount} />
          <div className="hidden sm:block">
            <UserMenu />
          </div>
          <MobileNav categories={categories} />
        </div>
      </Container>
    </header>
  )
}
