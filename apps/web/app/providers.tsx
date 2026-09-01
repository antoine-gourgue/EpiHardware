'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                'rounded-xl border border-slate-200 bg-white text-slate-900 shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
            }
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}
