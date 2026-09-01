'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@epihardware/ui'

export function FilterDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="lg:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filtres
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="shadow-soft-lg absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white p-5 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-extrabold">Filtres</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="inline-grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="ec-scroll overflow-auto" onClick={() => setOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
