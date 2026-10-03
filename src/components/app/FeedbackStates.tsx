import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Inbox, Info, TriangleAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  rows?: number
}

/** Skeleton placeholder for a data surface. */
export function LoadingState({ label = 'Loading…', rows = 3 }: LoadingStateProps) {
  return (
    <div aria-label={label} className="py-2" role="status">
      <p className="text-muted-foreground mb-2 text-sm">{label}</p>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton className="mb-2 h-11" key={`loading-row-${String(index)}`} />
      ))}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/** Shown when a data surface has no rows/content. */
export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center" role="status">
      <Inbox aria-hidden="true" className="text-muted-foreground size-8" />
      <p className="text-section font-semibold">{title}</p>
      {description != null && <p className="text-muted-foreground text-sm leading-6">{description}</p>}
      {actionLabel != null && onAction != null && (
        <Button className="mt-2" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

/** Shown when a data surface fails to load, with Retry. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center" role="alert">
      <TriangleAlert aria-hidden="true" className="text-destructive size-8" />
      <p className="text-section font-semibold">{title}</p>
      <p className="text-muted-foreground text-sm leading-6">{message}</p>
      {onRetry != null && (
        <Button className="mt-2" onClick={onRetry} variant="primary">
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

type InlineAlertSeverity = 'info' | 'success' | 'warning' | 'error'

const SEVERITY_STYLE: Record<InlineAlertSeverity, string> = {
  info: 'border-status-info-foreground/30 bg-status-info-background text-status-info-foreground',
  success: 'border-status-success-foreground/30 bg-status-success-background text-status-success-foreground',
  warning: 'border-status-warning-foreground/30 bg-status-warning-background text-status-warning-foreground',
  error: 'border-status-error-foreground/30 bg-status-error-background text-status-error-foreground',
}

const SEVERITY_ICON = {
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  error: TriangleAlert,
}

interface InlineAlertProps {
  severity: InlineAlertSeverity
  children: ReactNode
  action?: ReactNode
  onClose?: () => void
}

/** In-page message (validation summaries, upload results, notices). */
export function InlineAlert({ severity, children, action, onClose }: InlineAlertProps) {
  const Icon = SEVERITY_ICON[severity]
  return (
    <div
      className={cn('flex items-start gap-2 rounded-xl border px-4 py-3 text-sm leading-6', SEVERITY_STYLE[severity])}
      role={severity === 'error' ? 'alert' : 'status'}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
      {onClose != null && (
        <button
          aria-label="Dismiss message"
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg hover:opacity-80"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  )
}
