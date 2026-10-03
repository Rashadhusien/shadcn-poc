import * as Dialog from '@radix-ui/react-dialog'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { TableControls } from '@/hooks/useTableControls'
import { DetailList } from './DataTable'
import type { AppColumnDef } from './DataTable'

interface DataTableCardsProps<T> {
  rows: readonly T[]
  columns: readonly AppColumnDef<T>[]
  getRowId: (row: T) => string
  controls: TableControls
  ariaLabel: string
  loading: boolean
  getRowHref?: (row: T) => string
  selectable?: boolean
  renderActions?: (row: T) => ReactNode
  renderExpanded?: (row: T) => ReactNode
  expandable: boolean
}

/**
 * Mobile card list (<768px): title, status, primary fields, actions and a
 * details dialog holding every other field. No clipped desktop table.
 */
export function DataTableCards<T>({
  rows,
  columns,
  getRowId,
  controls,
  ariaLabel,
  loading,
  getRowHref,
  selectable = false,
  renderActions,
  renderExpanded,
  expandable,
}: DataTableCardsProps<T>) {
  const [detailRow, setDetailRow] = useState<T | null>(null)
  const titleColumn = columns.find((column) => column.role === 'title') ?? columns[0]
  const statusColumn = columns.find((column) => column.role === 'status')

  if (loading) {
    return (
      <div aria-label={ariaLabel} className="space-y-3 p-4 md:hidden" role="status">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="bg-muted h-[120px] animate-pulse rounded-xl" key={index} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div aria-label={ariaLabel} className="space-y-3 p-4 md:hidden" role="list">
        {rows.map((row) => {
          const id = getRowId(row)
          const href = getRowHref?.(row)
          const cardFields = columns.filter(
            (column) =>
              column.priority === 'primary' && column !== titleColumn && column !== statusColumn,
          )
          return (
            <article className="border-border bg-card rounded-xl border p-4" key={id} role="listitem">
              <div className="flex items-start gap-2">
                {selectable && (
                  <Checkbox
                    aria-label="Select row"
                    checked={controls.selectedIds.has(id)}
                    className="mt-0.5"
                    onCheckedChange={() => {
                      const next = new Set(controls.selectedIds)
                      if (next.has(id)) next.delete(id)
                      else next.add(id)
                      controls.setSelectedIds(next)
                    }}
                  />
                )}
                <div className="min-w-0 flex-1 text-sm">
                  {titleColumn &&
                    (href ? (
                      <Link className="font-semibold hover:underline" to={href}>
                        {titleColumn.render(row)}
                      </Link>
                    ) : (
                      <span className="font-semibold">{titleColumn.render(row)}</span>
                    ))}
                </div>
                {statusColumn && statusColumn !== titleColumn && (
                  <div className="shrink-0">{statusColumn.render(row)}</div>
                )}
              </div>
              {cardFields.length > 0 && (
                <div className="mt-3">
                  <DetailList
                    dense
                    columns={2}
                    items={cardFields.map((column) => ({
                      label: column.header,
                      value: column.render(row),
                    }))}
                  />
                </div>
              )}
              {(expandable || renderActions) && (
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  {expandable && (
                    <Button
                      onClick={() => {
                        setDetailRow(row)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Details
                    </Button>
                  )}
                  {renderActions?.(row)}
                </div>
              )}
            </article>
          )
        })}
      </div>
      <Dialog.Root
        open={detailRow != null}
        onOpenChange={(next) => {
          if (!next) setDetailRow(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="overlay-backdrop" />
          <Dialog.Content
            aria-label="Record details"
            className="overlay-panel max-h-[85vh] overflow-y-auto"
          >
            {detailRow != null && (
              <>
                <div className="mb-4 flex items-start gap-2 pr-10">
                  <div className="min-w-0 flex-1 text-lg font-semibold">
                    {titleColumn?.render(detailRow)}
                  </div>
                  {statusColumn?.render(detailRow)}
                </div>
                <DetailList
                  columns={2}
                  items={columns
                    .filter((column) => column !== titleColumn && column !== statusColumn)
                    .map((column) => ({ label: column.header, value: column.render(detailRow) }))}
                />
                {renderExpanded?.(detailRow)}
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  {renderActions?.(detailRow)}
                  <Button
                    onClick={() => {
                      setDetailRow(null)
                    }}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
            <Dialog.Close
              aria-label="Close details"
              className="text-muted-foreground hover:bg-action-hover hover:text-foreground absolute top-4 right-4 grid size-11 place-items-center rounded-lg"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
