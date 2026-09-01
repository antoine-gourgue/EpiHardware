import Link from 'next/link'
import { Button } from '@epihardware/ui'
import { Logo } from '@/components/logo'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="font-display text-gradient mt-10 text-7xl font-extrabold sm:text-8xl">404</p>
      <h1 className="font-display mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
        Page introuvable
      </h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        La page que vous cherchez a peut-être été déplacée ou n’existe plus.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg">
          <Link href="/">Retour à l’accueil</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products">Voir la boutique</Link>
        </Button>
      </div>
    </div>
  )
}
