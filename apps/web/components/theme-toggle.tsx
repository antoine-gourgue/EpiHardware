'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@epihardware/ui'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="Basculer le thème"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500/50 dark:hover:text-brand-300 inline-grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
        className
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
