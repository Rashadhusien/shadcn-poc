import { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { EmptyState, ErrorState } from '@/components/app/FeedbackStates'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface ChartTable {
  columns: readonly string[]
  rows: readonly (readonly (string | number)[])[]
}

interface ChartCardProps {
  title: string
  subtitle?: string
  table: ChartTable
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  /** Shown instead of the chart when there is nothing to plot. */
  emptyText?: string
  height?: number
  /** Below the chart, e.g. a link to the full list. */
  footer?: React.ReactNode
  children: React.ReactNode
}

/**
 * Titled chart panel with loading, error and empty states and a Chart /
 * Table switch — every chart has a table view with the same numbers.
 */
export function ChartCard({
  title,
  subtitle,
  table,
  loading = false,
  error = null,
  onRetry,
  emptyText = 'No data for this period.',
  height = 280,
  footer,
  children,
}: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const isEmpty = !loading && !error && table.rows.length === 0

  return (
    <section aria-label={title} className="border-border bg-card rounded-2xl border p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-section font-semibold tracking-tight">{title}</h3>
          {subtitle != null && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        {!error && !loading && !isEmpty && (
          <div aria-label={`${title} view`} className="bg-muted inline-flex rounded-lg p-0.5" role="group">
            {(
              [
                { value: 'chart', label: 'Chart view', Icon: BarChart3 },
                { value: 'table', label: 'Table view', Icon: Table2 },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                aria-label={label}
                aria-pressed={view === value}
                className={cn(
                  'grid size-11 cursor-pointer place-items-center rounded-md',
                  view === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
                key={value}
                onClick={() => {
                  setView(value)
                }}
                type="button"
              >
                <Icon aria-hidden="true" className="size-4" />
              </button>
            ))}
          </div>
        )}
      </div>
      {error ? (
        <ErrorState title={`Could not load ${title}`} message={error} onRetry={onRetry} />
      ) : loading ? (
        <Skeleton aria-label={`Loading ${title}`} className="w-full" role="status" style={{ height }} />
      ) : isEmpty ? (
        <EmptyState title={emptyText} />
      ) : view === 'table' ? (
        <div className="overflow-y-auto" style={{ maxHeight: height + 40 }}>
          <table aria-label={`${title} data`} className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-border">
                {table.columns.map((column, index) => (
                  <th
                    className={cn('text-muted-foreground px-3 py-2 text-xs font-semibold tracking-[0.06em] uppercase', index > 0 && 'text-right')}
                    key={column}
                    scope="col"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr className="border-b border-border last:border-0" key={String(row[0])}>
                  {row.map((cell, index) => (
                    <td
                      className={cn('break-words px-3 py-2 tabular-nums', index > 0 && 'text-right')}
                      key={`${String(row[0])}-${String(index)}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
      {footer != null && <div className="mt-4">{footer}</div>}
    </section>
  )
}
