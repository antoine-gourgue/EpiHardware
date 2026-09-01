import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Logo } from '@/components/logo'

const PERKS = [
  'Suivi de commandes et historique',
  'Paiement express en un clic',
  'Offres réservées aux membres',
  'Support technique prioritaire'
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="from-brand-500 via-brand-600 to-brand-700 relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br p-12 text-white lg:flex">
        <div className="blob left-[-10%] top-[-10%] h-80 w-80 bg-white/15" />
        <div className="blob bg-brand-950/30 bottom-[-15%] right-[-5%] h-96 w-96" />
        <div className="relative">
          <Logo
            href="/"
            className="[&_.text-brand-600]:text-brand-200 [&_span:last-child]:text-white"
          />
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Le hardware qui fait la différence.
          </h1>
          <p className="text-brand-100 mt-4 text-lg">
            Rejoignez la communauté EpiHardware et équipez-vous des meilleurs composants.
          </p>
          <ul className="mt-8 space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="text-brand-50 flex items-center gap-3">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white/20">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-brand-200 relative text-sm">© {new Date().getFullYear()} EpiHardware</p>
      </div>

      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
        </div>
        <Link
          href="/"
          className="hover:text-brand-600 mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition lg:mt-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
