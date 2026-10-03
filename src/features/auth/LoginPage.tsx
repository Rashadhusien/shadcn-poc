import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { isAuthenticated, signIn } from '@/app/auth'
import type { LoginRedirectState } from '@/app/AuthBoundary'
import { ROUTES } from '@/app/routes'
import { AuthLayout } from '@/layout/AuthLayout'
import { cn } from '@/lib/utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Mock sign-in with the demo account pre-filled. Email format and password
 * are validated with field errors; "Keep me signed in" decides whether the
 * session survives closing the browser; after sign-in the visitor returns to
 * the page they asked for, else the dashboard.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const requested = (location.state as LoginRedirectState | null)?.from
  // Only in-app paths; never an external URL.
  const destination =
    requested?.startsWith('/') && !requested.startsWith('//') ? requested : ROUTES.dashboard
  const [email, setEmail] = useState('jessica.ruiz@dentalab.com')
  const [password, setPassword] = useState('demo-password')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) return <Navigate to={destination} replace />

  const errors = {
    email: !email.trim()
      ? 'Enter your email address.'
      : EMAIL.test(email.trim())
        ? undefined
        : 'Enter a valid email address.',
    password: password ? undefined : 'Enter your password.',
  }
  const shown = submitted ? errors : { email: undefined, password: undefined }

  const submit = () => {
    setSubmitted(true)
    if (errors.email || errors.password) return
    setLoading(true)
    window.setTimeout(() => {
      signIn(remember)
      void navigate(destination, { replace: true })
    }, 800)
  }

  const fieldClass = (invalid: boolean) =>
    cn(
      'border-input bg-background text-foreground placeholder:text-muted-foreground mt-1.5 min-h-11 w-full rounded-lg border px-3 text-sm',
      invalid && 'border-destructive',
    )

  return (
    <AuthLayout>
      <form
        aria-labelledby="login-title"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="space-y-5">
          <div>
            <h1 className="text-section font-semibold tracking-tight" id="login-title">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your laboratory portal</p>
          </div>
          {submitted && (errors.email ?? errors.password) && (
            <p className="border-destructive/40 bg-destructive/5 rounded-lg border px-3 py-2 text-sm" role="alert">
              {errors.email ?? errors.password}
            </p>
          )}
          <div>
            <label className="text-sm font-medium" htmlFor="login-email">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              aria-describedby={shown.email ? 'login-email-error' : undefined}
              aria-invalid={shown.email != null}
              aria-required="true"
              autoComplete="email"
              className={fieldClass(shown.email != null)}
              disabled={loading}
              id="login-email"
              onChange={(event) => {
                setEmail(event.target.value)
              }}
              required
              type="email"
              value={email}
            />
            {shown.email && (
              <p className="text-destructive mt-1 text-xs" id="login-email-error">
                {shown.email}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="login-password">
              Password <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                aria-describedby={shown.password ? 'login-password-error' : undefined}
                aria-invalid={shown.password != null}
                aria-required="true"
                autoComplete="current-password"
                className={cn(fieldClass(shown.password != null), 'pr-12')}
                disabled={loading}
                id="login-password"
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-lg"
                disabled={loading}
                onClick={() => {
                  setShowPassword((current) => !current)
                }}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {shown.password && (
              <p className="text-destructive mt-1 text-xs" id="login-password-error">
                {shown.password}
              </p>
            )}
          </div>
          <div className="flex min-h-11 items-center gap-3">
            <input
              aria-describedby="login-remember-description"
              checked={remember}
              className="border-input accent-primary size-5 shrink-0 cursor-pointer"
              disabled={loading}
              id="login-remember"
              onChange={(event) => {
                setRemember(event.target.checked)
              }}
              type="checkbox"
            />
            <div>
              <label className="cursor-pointer text-sm font-medium" htmlFor="login-remember">
                Keep me signed in
              </label>
              <p className="text-muted-foreground text-xs" id="login-remember-description">
                {remember ? 'Stay signed in on this device' : 'Sign out when the browser closes'}
              </p>
            </div>
          </div>
          <button
            className="bg-primary text-primary-foreground disabled:bg-primary/60 min-h-11 w-full rounded-lg px-4 text-sm font-semibold"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-muted-foreground text-xs leading-5">
            Demo environment: the account above is pre-filled and any password signs in.
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
