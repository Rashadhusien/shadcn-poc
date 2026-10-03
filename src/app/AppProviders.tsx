import type { ReactNode } from 'react'
import AppDataProvider from '@/data/AppDataProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppDataProvider>{children}</AppDataProvider>
}
