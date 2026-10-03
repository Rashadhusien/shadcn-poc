import {
  flexRender,
  type ColumnVisibilityState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy'
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  MoreVertical,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { clampPage, paginateRows, sortRows, totalPages } from '@/domain/rules/table'
import type { TableControls } from '@/hooks/useTableControls'
import { cn } from '@/lib/utils'
import { DataTableCards } from './DataTableCards'
import { DataTableStates, type TableEmptyContent } from './DataTableStates'

export type { TableEmptyContent }
export type ColumnPriority = 'primary' | 'secondary' | 'tertiary'

export interface AppColumnDef<T> {
  id: string
  header: string
  /** primary: always shown; secondary: desktop; tertiary: details only. */
  priority: ColumnPriority
  render: (row: T) => ReactNode
  /** Enables sorting by this column. */
  sortValue?: (row: T) => unknown
  align?: 'left' | 'center' | 'right'
  /** Width hint for the desktop table. */
  width?: number | string
  /** Card placement on mobile: the heading or the status slot. */
  role?: 'title' | 'status'
  /**
   * Secondary columns only: desktop width needed to appear in the table
   * (else the details row). Default 'lg' (1280): at 1024 the full sidebar
   * leaves the table narrow, so only columns that opt in with 'md' join.
   */
  showFrom?: 'md' | 'lg' | 'xl'
}

// ---------------------------------------------------------------------------
// Breakpoints + column layout (single matchMedia subscription set)
// ---------------------------------------------------------------------------

export type TableLayout = 'desktop' | 'tablet' | 'mobile'

function useDesktopBands(): { md: boolean; lg: boolean; xl: boolean; xxl: boolean } {
  const read = () => ({
    md: window.matchMedia('(min-width: 48rem)').matches,
    lg: window.matchMedia('(min-width: 64rem)').matches,
    xl: window.matchMedia('(min-width: 80rem)').matches,
    xxl: window.matchMedia('(min-width: 96rem)').matches,
  })
  const [bands, setBands] = useState(read)
  useEffect(() => {
    const queries: [keyof ReturnType<typeof read>, MediaQueryList][] = [
      ['md', window.matchMedia('(min-width: 48rem)')],
      ['lg', window.matchMedia('(min-width: 64rem)')],
      ['xl', window.matchMedia('(min-width: 80rem)')],
      ['xxl', window.matchMedia('(min-width: 96rem)')],
    ]
    const onChange = () => {
      setBands(read())
    }
    queries.forEach(([, media]) => {
      media.addEventListener('change', onChange)
    })
    return () => {
      queries.forEach(([, media]) => {
        media.removeEventListener('change', onChange)
      })
    }
  }, [])
  return bands
}

export interface ColumnLayout<T> {
  layout: TableLayout
  tableColumns: AppColumnDef<T>[]
  detailColumns: AppColumnDef<T>[]
  /** Secondary columns the user can toggle at this width. */
  toggleableColumns: AppColumnDef<T>[]
}

export function useColumnLayout<T>(
  columns: readonly AppColumnDef<T>[],
  controls: TableControls,
): ColumnLayout<T> {
  const bands = useDesktopBands()
  // px-preserving map of the MUI authoring scale (md 1024 / lg 1280 / xl 1536)
  // onto this port's bands (lg 1024 / xl 1280 / 2xl 1536).
  const widthAllows = (column: AppColumnDef<T>) => {
    if (column.showFrom === 'xl') return bands.xxl
    if (column.showFrom === 'md') return bands.lg
    return bands.xl
  }
  const layout: TableLayout = !bands.md ? 'mobile' : bands.lg ? 'desktop' : 'tablet'
  const toggleableColumns =
    layout === 'desktop'
      ? columns.filter((column) => column.priority === 'secondary' && widthAllows(column))
      : []
  const tableColumns = columns.filter((column) =>
    column.priority === 'primary'
      ? true
      : layout === 'desktop' &&
        toggleableColumns.includes(column) &&
        !controls.hiddenColumns.has(column.id),
  )
  return {
    layout,
    tableColumns,
    detailColumns: columns.filter((column) => !tableColumns.includes(column)),
    toggleableColumns,
  }
}

// ---------------------------------------------------------------------------
// DetailList
// ---------------------------------------------------------------------------

export interface DetailItem {
  label: string
  value: ReactNode
  /** Span the full row (long text such as notes). */
  wide?: boolean
}

const DETAIL_GRID: Record<1 | 2 | 3 | 4, string> = {
  1: 'md:grid-cols-1 lg:grid-cols-1',
  2: 'md:grid-cols-2 lg:grid-cols-2',
  3: 'md:grid-cols-3 lg:grid-cols-3',
  4: 'md:grid-cols-3 lg:grid-cols-4',
}

function isEmptyValue(value: ReactNode): boolean {
  return value == null || value === '' || value === false
}

export function DetailList({
  items,
  columns = 3,
  dense = false,
}: {
  items: readonly DetailItem[]
  columns?: 1 | 2 | 3 | 4
  dense?: boolean
}) {
  return (
    <dl className={cn('grid grid-cols-2', DETAIL_GRID[columns], dense ? 'gap-3' : 'gap-4')}>
      {items.map((item) => (
        <div className={cn('min-w-0', item.wide && 'col-span-full')} key={item.label}>
          <dt className="text-muted-foreground text-xs">{item.label}</dt>
          <dd className="mt-0.5 text-sm break-words">
            {isEmptyValue(item.value) ? '—' : item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// ---------------------------------------------------------------------------
// Toolbar / pager / menus
// ---------------------------------------------------------------------------

export interface FilterChip {
  key: string
  label: string
  onDelete: () => void
}

interface DataTableToolbarProps {
  title?: string
  /** e.g. "64 orders". */
  count?: string
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** Selects / toggles shown next to the search. */
  filters?: ReactNode
  chips?: readonly FilterChip[]
  onClearAll?: () => void
  /** Right-aligned actions (export, refresh, columns). */
  actions?: ReactNode
  selectedCount?: number
  /** Bulk actions shown while rows are selected. */
  selectionActions?: ReactNode
  onClearSelection?: () => void
}

export function DataTableToolbar({
  title,
  count,
  search,
  onSearchChange,
  searchPlaceholder = 'Search',
  filters,
  chips = [],
  onClearAll,
  actions,
  selectedCount = 0,
  selectionActions,
  onClearSelection,
}: DataTableToolbarProps) {
  return (
    <div className="border-b border-border">
      {(title != null || actions != null) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
          {title != null && (
            <div className="min-w-0">
              <h2 className="text-section font-semibold tracking-tight">{title}</h2>
              {count != null && (
                <p aria-live="polite" className="text-muted-foreground text-xs">
                  {count}
                </p>
              )}
            </div>
          )}
          {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {(onSearchChange != null || filters != null) && (
        <div className="flex flex-wrap gap-3 px-4 py-4">
          {onSearchChange != null && (
            <div className="relative min-w-0 flex-1 basis-full sm:basis-auto sm:grow sm:max-w-[420px]">
              <Search aria-hidden="true" className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                aria-label={searchPlaceholder}
                className="border-input bg-background text-foreground placeholder:text-muted-foreground min-h-11 w-full rounded-lg border pr-3 pl-9 text-sm outline-none"
                onChange={(event) => {
                  onSearchChange(event.target.value)
                }}
                placeholder={searchPlaceholder}
                type="search"
                value={search ?? ''}
              />
            </div>
          )}
          {filters}
        </div>
      )}
      {chips.length > 0 && (
        <div aria-label="Active filters" className="flex flex-wrap items-center gap-2 px-4 pb-4">
          {chips.map((chip) => (
            <span className="border-border inline-flex min-h-8 items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-xs font-medium" key={chip.key}>
              {chip.label}
              <button
                aria-label={`Remove filter ${chip.label}`}
                className="hover:bg-accent grid size-8 cursor-pointer place-items-center rounded-full text-base leading-none"
                onClick={chip.onDelete}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
          {onClearAll != null && (
            <Button onClick={onClearAll} size="sm" variant="ghost">
              Clear all
            </Button>
          )}
        </div>
      )}
      {selectedCount > 0 && (
        <div
          aria-label="Selection actions"
          className="bg-action-selected flex flex-wrap items-center gap-2 px-4 py-2"
          role="region"
        >
          <p className="mr-auto text-sm font-semibold">{selectedCount} selected</p>
          {selectionActions}
          {onClearSelection != null && (
            <Button onClick={onClearSelection} size="sm" variant="ghost">
              Clear selection
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface DataTablePagerProps {
  total: number
  page: number
  pageSize: number
  pageSizeOptions: readonly number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function DataTablePager({
  total,
  page,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DataTablePagerProps) {
  const pages = totalPages(total, pageSize)
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  const windowed: number[] = []
  for (let candidate = Math.max(1, page - 1); candidate <= Math.min(pages, page + 1); candidate += 1) {
    windowed.push(candidate)
  }
  const numbered = [...new Set([1, ...windowed, pages])].sort((a, b) => a - b)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
      <p aria-live="polite" className="text-muted-foreground text-sm">
        {`${String(first)}–${String(last)} of ${String(total)}`}
      </p>
      <div className="flex items-center gap-3">
        {pageSizeOptions.length > 1 && (
          <label className="hidden items-center gap-2 text-sm md:flex">
            <span className="text-muted-foreground">Rows per page</span>
            <select
              aria-label="Rows per page"
              className="border-input bg-background min-h-11 cursor-pointer rounded-lg border px-2 text-sm"
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value))
              }}
              value={pageSize}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
        {pages > 1 && (
          <nav aria-label="Table pages" className="flex items-center gap-1">
            <Button
              aria-label="First page"
              disabled={page <= 1}
              onClick={() => {
                onPageChange(1)
              }}
              size="sm"
              variant="ghost"
            >
              <ChevronsLeft aria-hidden="true" />
            </Button>
            <Button
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => {
                onPageChange(page - 1)
              }}
              size="sm"
              variant="ghost"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            {numbered.map((candidate, position) => (
              <Fragment key={candidate}>
                {position > 0 && numbered[position - 1] !== candidate - 1 && (
                  <span aria-hidden="true" className="text-muted-foreground px-1 text-sm">
                    …
                  </span>
                )}
                <Button
                  aria-current={candidate === page ? 'page' : undefined}
                  aria-label={`Page ${String(candidate)}`}
                  onClick={() => {
                    onPageChange(candidate)
                  }}
                  size="sm"
                  variant={candidate === page ? 'secondary' : 'ghost'}
                >
                  {candidate}
                </Button>
              </Fragment>
            ))}
            <Button
              aria-label="Next page"
              disabled={page >= pages}
              onClick={() => {
                onPageChange(page + 1)
              }}
              size="sm"
              variant="ghost"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button
              aria-label="Last page"
              disabled={page >= pages}
              onClick={() => {
                onPageChange(pages)
              }}
              size="sm"
              variant="ghost"
            >
              <ChevronsRight aria-hidden="true" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  )
}

export function ColumnVisibilityMenu<T>({
  columns,
  controls,
}: {
  columns: readonly AppColumnDef<T>[]
  controls: TableControls
}) {
  const { toggleableColumns } = useColumnLayout(columns, controls)
  if (toggleableColumns.length === 0) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Columns3 aria-hidden="true" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Visible columns">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {toggleableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={!controls.hiddenColumns.has(column.id)}
            key={column.id}
            onCheckedChange={() => {
              controls.toggleColumn(column.id)
            }}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface RowAction {
  label: string
  icon?: ReactNode
  /** Navigates when set; otherwise onClick runs. */
  to?: string
  onClick?: () => void
  destructive?: boolean
  disabled?: boolean
}

export function RowActionsMenu({ label, actions }: { label: string; actions: readonly RowAction[] }) {
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={label}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground grid size-11 cursor-pointer place-items-center rounded-lg"
          type="button"
        >
          <MoreVertical aria-hidden="true" className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={label}>
        {actions.map((action) => (
          <DropdownMenuItem
            destructive={action.destructive}
            disabled={action.disabled}
            key={action.label}
            onSelect={() => {
              if (action.to != null) void navigate(action.to)
              else action.onClick?.()
            }}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

interface DataTableProps<T> {
  rows: readonly T[]
  columns: readonly AppColumnDef<T>[]
  getRowId: (row: T) => string
  controls: TableControls
  ariaLabel: string
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  empty?: TableEmptyContent
  /** Makes the title column a link and the row clickable. */
  getRowHref?: (row: T) => string
  selectable?: boolean
  renderActions?: (row: T) => ReactNode
  actionsWidth?: number
  /** Extra content in the details row / dialog (e.g. sub-orders). */
  renderExpanded?: (row: T) => ReactNode
  /** Name for the details disclosure ("Show services"). */
  expandLabel?: (row: T) => string
  paginate?: boolean
  /** Rendered inside the table surface above the rows (toolbar). */
  toolbar?: ReactNode
}

function isInteractiveTarget(target: EventTarget): boolean {
  return (
    target instanceof Element &&
    target.closest('a, button, input, label, [role="checkbox"], [role="menuitem"], [role="menuitemcheckbox"]') != null
  )
}

/**
 * The one shared data table: TanStack-backed with single-column sort,
 * pagination, page-scoped selection and column visibility, driven by the
 * shared `useTableControls` state. Column priority drives layout — nothing
 * ever scrolls horizontally: desktop shows primary + visible secondary
 * columns with an expandable details row, mobile (<768px) renders cards.
 */
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  controls,
  ariaLabel,
  loading = false,
  error = null,
  onRetry,
  empty,
  getRowHref,
  selectable = false,
  renderActions,
  renderExpanded,
  expandLabel,
  paginate = true,
  toolbar,
}: DataTableProps<T>) {
  const navigate = useNavigate()
  const { layout, tableColumns, detailColumns } = useColumnLayout(columns, controls)

  const sortColumn = columns.find((column) => column.id === controls.sort?.column)
  const sorted =
    controls.sort && sortColumn?.sortValue
      ? sortRows(rows, sortColumn.sortValue, controls.sort.direction)
      : [...rows]
  const page = clampPage(controls.page, sorted.length, controls.pageSize)
  const pageRows = paginate ? paginateRows(sorted, page, controls.pageSize) : sorted

  const sorting: SortingState = controls.sort
    ? [{ id: controls.sort.column, desc: controls.sort.direction === 'desc' }]
    : []
  const rowSelection: RowSelectionState = Object.fromEntries(
    [...controls.selectedIds].map((id) => [id, true]),
  )
  const columnVisibility: ColumnVisibilityState = Object.fromEntries(
    columns.map((column) => [column.id, !controls.hiddenColumns.has(column.id)]),
  )

  const expandable = detailColumns.length > 0 || renderExpanded != null
  const titleColumn = columns.find((column) => column.role === 'title') ?? columns[0]

  const renderTitle = (row: T) => {
    if (!titleColumn) return null
    const content = titleColumn.render(row)
    const href = getRowHref?.(row)
    return href ? (
      <Link className="font-semibold hover:underline" to={href}>
        {content}
      </Link>
    ) : (
      content
    )
  }

  // TanStack v9 constrains rows to RowData (Record<string, any> | any[]),
  // which our domain interfaces do not extend. The casts below are the only
  // boundary: feature code stays fully typed through AppColumnDef<T>.
  type TableRow = Record<string, unknown>
  const toTableRow = (row: T): TableRow => row as unknown as TableRow
  const fromTableRow = (row: TableRow): T => row as unknown as T

  const tableDef: LegacyColumnDef<TableRow>[] = tableColumns.map((column) => ({
    id: column.id,
    header: column.header,
    cell: ({ row }) => {
      const original = fromTableRow(row.original)
      return column === titleColumn ? renderTitle(original) : column.render(original)
    },
    enableSorting: column.sortValue != null,
  }))

  const table = useLegacyTable<TableRow>({
    data: pageRows.map(toTableRow),
    columns: tableDef,
    getRowId: (originalRow) => getRowId(fromTableRow(originalRow)),
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: totalPages(sorted.length, controls.pageSize),
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize: controls.pageSize },
      rowSelection,
      columnVisibility,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      const first = next[0]
      if (first) controls.setSort(first.id)
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: page - 1, pageSize: controls.pageSize }
      const next = typeof updater === 'function' ? updater(current) : updater
      if (next.pageIndex !== current.pageIndex) controls.setPage(next.pageIndex + 1)
      if (next.pageSize !== current.pageSize) controls.setPageSize(next.pageSize)
    },
    onRowSelectionChange: (updater) => {
      const current = rowSelection
      const next = typeof updater === 'function' ? updater(current) : updater
      controls.setSelectedIds(
        new Set(Object.entries(next).filter(([, selected]) => selected).map(([id]) => id)),
      )
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater
      Object.entries(next).forEach(([id, visible]) => {
        if (visible === controls.hiddenColumns.has(id)) controls.toggleColumn(id)
      })
    },
    enableRowSelection: selectable,
  })

  const pageIds = pageRows.map(getRowId)
  const selectedOnPage = pageIds.filter((id) => controls.selectedIds.has(id)).length
  const toggleRow = (id: string) => {
    const next = new Set(controls.selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    controls.setSelectedIds(next)
  }
  const togglePage = () => {
    const next = new Set(controls.selectedIds)
    const allSelected = pageIds.length > 0 && selectedOnPage === pageIds.length
    pageIds.forEach((id) => {
      if (allSelected) next.delete(id)
      else next.add(id)
    })
    controls.setSelectedIds(next)
  }

  const details = (row: T) => (
    <div className="space-y-4">
      {detailColumns.length > 0 && (
        <DetailList
          dense
          columns={4}
          items={detailColumns.map((column) => ({
            label: column.header,
            value: column.render(row),
          }))}
        />
      )}
      {renderExpanded?.(row)}
    </div>
  )

  if (error) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        {toolbar}
        <DataTableStates error={error} onRetry={onRetry} state="error" />
      </div>
    )
  }
  if (!loading && rows.length === 0) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        {toolbar}
        <DataTableStates empty={empty} state="empty" />
      </div>
    )
  }

  if (layout === 'mobile') {
    return (
      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        {toolbar}
        <DataTableCards
          ariaLabel={ariaLabel}
          columns={columns}
          controls={controls}
          expandable={expandable}
          getRowHref={getRowHref}
          getRowId={getRowId}
          loading={loading}
          renderActions={renderActions}
          renderExpanded={renderExpanded}
          rows={pageRows}
          selectable={selectable}
        />
        {paginate && sorted.length > 0 && (
          <DataTablePager
            onPageChange={controls.setPage}
            onPageSizeChange={controls.setPageSize}
            page={page}
            pageSize={controls.pageSize}
            pageSizeOptions={controls.pageSizeOptions}
            total={sorted.length}
          />
        )}
      </div>
    )
  }

  const headerGroups = table.getHeaderGroups()
  const bodyRows = table.getRowModel().rows
  const visibleLeafCount =
    table.getVisibleLeafColumns().length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (renderActions ? 1 : 0)

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      {toolbar}
      <div className="hidden overflow-x-visible md:block">
        <table aria-label={ariaLabel} className="w-full table-fixed">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr className="border-b border-border" key={headerGroup.id}>
                {expandable && (
                  <th className="w-[52px] px-2">
                    <span className="sr-only">Details</span>
                  </th>
                )}
                {selectable && (
                  <th className="w-12 px-2">
                    <Checkbox
                      aria-label="Select all rows on this page"
                      checked={
                        pageIds.length > 0 && selectedOnPage === pageIds.length
                          ? true
                          : selectedOnPage > 0
                            ? 'indeterminate'
                            : false
                      }
                      disabled={loading || pageIds.length === 0}
                      onCheckedChange={togglePage}
                    />
                  </th>
                )}
                {headerGroup.headers.map((header) => {
                  const def = tableColumns.find((column) => column.id === header.id)
                  const active = controls.sort?.column === header.id
                  return (
                    <th
                      aria-sort={active ? (controls.sort?.direction === 'desc' ? 'descending' : 'ascending') : def?.sortValue ? 'none' : undefined}
                      className={cn(
                        'text-muted-foreground px-3 py-3 text-xs font-semibold tracking-[0.06em] uppercase',
                        def?.align === 'right' && 'text-right',
                        def?.align === 'center' && 'text-center',
                      )}
                      key={header.id}
                      style={def?.width != null ? { width: def.width } : undefined}
                    >
                      {def?.sortValue ? (
                        <button
                          className="hover:text-foreground inline-flex cursor-pointer items-center gap-1 uppercase"
                          onClick={() => {
                            controls.setSort(header.id)
                          }}
                          type="button"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {active ? (
                            controls.sort?.direction === 'desc' ? (
                              <ArrowDown aria-hidden="true" className="size-3.5" />
                            ) : (
                              <ArrowUp aria-hidden="true" className="size-3.5" />
                            )
                          ) : (
                            <ArrowUpDown aria-hidden="true" className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
                {renderActions && (
                  <th className="w-28 px-3 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, index) => (
                  <tr className="border-b border-border last:border-0" key={index}>
                    <td className="px-3 py-3" colSpan={visibleLeafCount}>
                      <div className="bg-muted h-7 animate-pulse rounded-lg" role="status" aria-label="Loading row" />
                    </td>
                  </tr>
                ))
              : bodyRows.map((bodyRow) => {
                  const row = fromTableRow(bodyRow.original)
                  const id = getRowId(row)
                  const expanded = controls.expandedIds.has(id)
                  const href = getRowHref?.(row)
                  return (
                    <Fragment key={id}>
                      <tr
                        className={cn(
                          'border-b border-border last:border-0',
                          controls.selectedIds.has(id) && 'bg-table-row-selected',
                          href && 'cursor-pointer',
                        )}
                        onClick={(event) => {
                          if (href && !isInteractiveTarget(event.target)) void navigate(href)
                        }}
                      >
                        {expandable && (
                          <td className="px-2 py-1">
                            <button
                              aria-expanded={expanded}
                              aria-label={expandLabel?.(row) ?? (expanded ? 'Hide details' : 'Show details')}
                              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground grid size-11 cursor-pointer place-items-center rounded-lg"
                              onClick={() => {
                                controls.toggleExpanded(id)
                              }}
                              type="button"
                            >
                              <ChevronDown
                                aria-hidden="true"
                                className={cn('size-4 transition-transform', expanded && 'rotate-180')}
                              />
                            </button>
                          </td>
                        )}
                        {selectable && (
                          <td className="px-2 py-1">
                            <Checkbox
                              aria-label="Select row"
                              checked={controls.selectedIds.has(id)}
                              onCheckedChange={() => {
                                toggleRow(id)
                              }}
                            />
                          </td>
                        )}
                        {bodyRow.getVisibleCells().map((cell) => {
                          const def = tableColumns.find((column) => column.id === cell.column.id)
                          return (
                            <td
                              className={cn(
                                'overflow-hidden px-3 py-3 text-sm break-words',
                                def?.align === 'right' && 'text-right',
                                def?.align === 'center' && 'text-center',
                              )}
                              key={cell.id}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                        })}
                        {renderActions && (
                          <td className="px-3 py-1 text-right">{renderActions(row)}</td>
                        )}
                      </tr>
                      {expandable && expanded && (
                        <tr className="border-b border-border">
                          <td className="bg-action-hover px-4 py-4" colSpan={visibleLeafCount}>
                            {details(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden">
        <DataTableCards
          ariaLabel={ariaLabel}
          columns={columns}
          controls={controls}
          expandable={expandable}
          getRowHref={getRowHref}
          getRowId={getRowId}
          loading={loading}
          renderActions={renderActions}
          renderExpanded={renderExpanded}
          rows={pageRows}
          selectable={selectable}
        />
      </div>
      {paginate && sorted.length > 0 && (
        <DataTablePager
          onPageChange={controls.setPage}
          onPageSizeChange={controls.setPageSize}
          page={page}
          pageSize={controls.pageSize}
          pageSizeOptions={controls.pageSizeOptions}
          total={sorted.length}
        />
      )}
    </div>
  )
}
