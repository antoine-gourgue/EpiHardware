'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button, Spinner } from '@epihardware/ui'
import { deleteProductAction } from '@/lib/actions/admin'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function remove() {
    startTransition(async () => {
      const res = await deleteProductAction(id)
      if (!res.ok) {
        toast.error(res.error ?? 'Suppression impossible')
        setConfirming(false)
        return
      }
      toast.success('Produit supprimé')
      router.refresh()
    })
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Button size="sm" variant="danger" onClick={remove} disabled={pending}>
          {pending ? <Spinner className="h-3.5 w-3.5" /> : 'Confirmer'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>
          Annuler
        </Button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Supprimer ${name}`}
      className="inline-grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
