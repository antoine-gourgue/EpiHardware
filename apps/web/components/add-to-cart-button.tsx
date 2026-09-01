'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Button, Spinner, type ButtonProps } from '@epihardware/ui'
import { addToCartAction } from '@/lib/actions/cart'

interface Props extends Omit<ButtonProps, 'onClick'> {
  productId: string
  productName: string
  quantity?: number
  label?: string
  iconOnly?: boolean
}

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  label = 'Ajouter au panier',
  iconOnly = false,
  ...buttonProps
}: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await addToCartAction(productId, quantity)
      toast.success('Ajouté au panier', { description: productName })
    })
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={iconOnly ? label : undefined}
      {...buttonProps}
    >
      {pending ? <Spinner className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {!iconOnly && <span>{label}</span>}
    </Button>
  )
}
