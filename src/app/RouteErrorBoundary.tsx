import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { ROUTES } from '@/app/routes'

interface RouteErrorBoundaryProps {
  children: ReactNode
}

interface RouteErrorBoundaryState {
  error: Error | null
}

/**
 * Per-route error boundary: a crashing route shows a recovery panel instead
 * of blanking the shell. Navigation resets it via the router key.
 */
export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error }
  }

  render(): ReactNode {
    const { error } = this.state
    if (error == null) return this.props.children
    return (
      <div className="mx-auto max-w-xl py-10 text-center" role="alert">
        <span className="bg-destructive/10 mx-auto grid size-12 place-items-center rounded-full">
          <TriangleAlert aria-hidden="true" className="text-destructive size-6" />
        </span>
        <h1 className="text-section mt-4 font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          This page hit an unexpected error. Your data is safe — try again or go back to the dashboard.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            className="bg-primary text-primary-foreground min-h-11 rounded-lg px-4 text-sm font-semibold"
            onClick={() => {
              this.setState({ error: null })
            }}
            type="button"
          >
            Try again
          </button>
          <Link
            className="bg-secondary text-secondary-foreground inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold"
            to={ROUTES.dashboard}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }
}
