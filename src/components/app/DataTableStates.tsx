import { EmptyState, ErrorState, LoadingState } from './FeedbackStates'

export interface TableEmptyContent {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

interface DataTableStatesProps {
  state: 'loading' | 'empty' | 'error'
  error?: string | null
  onRetry?: () => void
  empty?: TableEmptyContent
}

/** Loading / empty / error surfaces for data tables (table and cards share them). */
export function DataTableStates({ state, error, onRetry, empty }: DataTableStatesProps) {
  if (state === 'loading') return <LoadingState label="Loading records…" rows={5} />
  if (state === 'error') {
    return <ErrorState title="Could not load records" message={error ?? undefined} onRetry={onRetry} />
  }
  return (
    <EmptyState
      title={empty?.title ?? 'No records found'}
      description={empty?.description ?? 'There is nothing to display yet.'}
      actionLabel={empty?.actionLabel}
      onAction={empty?.onAction}
    />
  )
}
