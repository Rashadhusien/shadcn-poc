import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/app/auth'

export interface LoginRedirectState {
  from?: string
}

/**
 * Route guard: signed-out users go to /login. The page they asked for
 * travels in router state so sign-in returns them to it.
 */
export function AuthBoundary({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (isAuthenticated()) return <>{children}</>
  const state: LoginRedirectState = {
    from: `${location.pathname}${location.search}`,
  }
  return <Navigate to="/login" replace state={state} />
}
