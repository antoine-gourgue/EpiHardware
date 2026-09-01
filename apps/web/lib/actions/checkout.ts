'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/session'
import { checkout } from '@/lib/data/orders'
import { clearCart } from '@/lib/data/cart'

export async function placeOrderAction(): Promise<{ ok: false; error: string } | never> {
  const user = await getCurrentUser()
  if (!user) redirect('/login?callbackUrl=/cart')

  const orderId = await checkout(user)
  if (!orderId) return { ok: false, error: 'Votre panier est vide.' }

  await clearCart()
  revalidatePath('/', 'layout')
  revalidatePath('/account/orders')
  redirect(`/account/orders/${orderId}?success=1`)
}
