import Link from 'next/link'
import { Container } from '@epihardware/ui'
import { Logo } from './logo'
import { BackToTop } from './back-to-top'
import { isDemoMode } from '@/lib/env'

const columns = [
  {
    title: 'Acheter',
    links: [
      { label: 'Cartes graphiques', href: '/products?category=gpu' },
      { label: 'Processeurs', href: '/products?category=cpu' },
      { label: 'Écrans', href: '/products?category=monitors' },
      { label: 'Périphériques', href: '/products?category=keyboards' }
    ]
  },
  {
    title: 'Mon compte',
    links: [
      { label: 'Mon profil', href: '/account' },
      { label: 'Mes commandes', href: '/account/orders' },
      { label: 'Mon panier', href: '/cart' },
      { label: 'Se connecter', href: '/login' }
    ]
  },
  {
    title: 'Service client',
    links: [
      { label: 'Livraison', href: '#' },
      { label: 'Retours & remboursements', href: '#' },
      { label: 'Garantie', href: '#' },
      { label: 'Nous contacter', href: '#' }
    ]
  },
  {
    title: 'À propos',
    links: [
      { label: 'Qui sommes-nous', href: '#' },
      { label: 'Nos engagements', href: '#' },
      { label: 'Carrières', href: '#' },
      { label: 'Presse', href: '#' }
    ]
  }
]

export function Footer() {
  return (
    <footer className="mt-16">
      <BackToTop />

      <div className="bg-navy-800 text-slate-300">
        <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-base font-bold text-white">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </div>

      <div className="border-t border-white/10 bg-navy-950 text-slate-400">
        <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <Logo onDark />
          <div className="flex items-center gap-4 text-sm">
            {isDemoMode && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-brand-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                Mode démo
              </span>
            )}
            <span>© {new Date().getFullYear()} EpiHardware</span>
          </div>
        </Container>
      </div>
    </footer>
  )
}
