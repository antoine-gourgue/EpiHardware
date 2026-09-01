import Link from 'next/link'
import { Container } from '@epihardware/ui'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { Logo } from './logo'
import { isDemoMode } from '@/lib/env'

const columns = [
  {
    title: 'Boutique',
    links: [
      { label: 'Cartes graphiques', href: '/products?category=gpu' },
      { label: 'Processeurs', href: '/products?category=cpu' },
      { label: 'Écrans', href: '/products?category=monitors' },
      { label: 'Périphériques', href: '/products?category=keyboards' }
    ]
  },
  {
    title: 'Compte',
    links: [
      { label: 'Mon profil', href: '/account' },
      { label: 'Mes commandes', href: '/account/orders' },
      { label: 'Panier', href: '/cart' },
      { label: 'Connexion', href: '/login' }
    ]
  },
  {
    title: 'Aide',
    links: [
      { label: 'Livraison', href: '#' },
      { label: 'Retours', href: '#' },
      { label: 'Garantie', href: '#' },
      { label: 'Nous contacter', href: '#' }
    ]
  }
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Composants et périphériques PC sélectionnés par des passionnés. Le meilleur du
              hardware, livré rapidement.
            </p>
            <div className="mt-5 flex gap-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500/50 inline-grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition dark:border-slate-700 dark:text-slate-400"
                  aria-label="Réseau social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-brand-600 dark:hover:text-brand-300 text-sm text-slate-500 transition dark:text-slate-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} EpiHardware. Projet de démonstration.</p>
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Mode démo
              </span>
            )}
            <span>Conçu avec Next.js</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
