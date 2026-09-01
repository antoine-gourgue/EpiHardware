'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'
import { Button, Spinner } from '@epihardware/ui'
import { placeOrderAction } from '@/lib/actions/checkout'

export function CheckoutButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [pending, startTransition] = useTransition()

  function checkout() {
    startTransition(async () => {
      // On success or when unauthenticated, the action redirects; it only
      // returns here on a handled error (e.g. empty cart).
      const result = await placeOrderAction()
      if (result && !result.ok) toast.error(result.error)
    })
  }

  return (
    <Button size="lg" variant="cart" className="w-full" onClick={checkout} disabled={pending}>
      {pending ? <Spinner className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      {isAuthenticated ? 'Valider la commande' : 'Se connecter pour commander'}
    </Button>
  )
}
