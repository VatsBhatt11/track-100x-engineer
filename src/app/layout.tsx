import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { QueryProvider } from '@/components/providers/query-provider'

export const metadata:Metadata = {
  title: 'Track100xEngineers',
  description: 'Track GenAI journey for 100xEngineers participants',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{backgroundColor: 'hsl(220 ,33%, 12%)',color: 'hsl(0, 0%, 98%)'}}>
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
