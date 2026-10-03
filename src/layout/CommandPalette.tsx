import * as Dialog from '@radix-ui/react-dialog'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { useAppData } from '@/data/app-data-context'
import { cn } from '@/lib/utils'

interface PaletteResult {
  id: string
  group: 'Pages' | 'Orders' | 'Patients' | 'Doctors' | 'Cases'
  title: string
  subtitle: string
  to: string
  haystack: string
}

const PER_GROUP = 5

const PAGE_ENTRIES: { title: string; subtitle: string; to: string; haystack: string }[] = [
  { title: 'Dashboard', subtitle: 'Workspace', to: ROUTES.dashboard, haystack: 'dashboard home workspace' },
  { title: 'Orders', subtitle: 'Workspace', to: ROUTES.orders, haystack: 'orders list workspace' },
  { title: 'Create order', subtitle: 'Workspace', to: ROUTES.orderCreate, haystack: 'create order new workspace' },
  { title: 'Cases', subtitle: 'Workspace', to: ROUTES.cases, haystack: 'cases workspace' },
  { title: 'Workflow Board', subtitle: 'Workspace', to: ROUTES.workflowBoard, haystack: 'workflow board stages workspace' },
  { title: 'Scan Center', subtitle: 'Workspace', to: ROUTES.scanCenter, haystack: 'scan center workspace' },
  { title: 'Patients', subtitle: 'Directory', to: ROUTES.patients, haystack: 'patients directory' },
  { title: 'Doctors', subtitle: 'Directory', to: ROUTES.doctors, haystack: 'doctors directory' },
  { title: 'Clinics', subtitle: 'Directory', to: ROUTES.clinics, haystack: 'clinics directory' },
  { title: 'Documents', subtitle: 'Directory', to: ROUTES.documents, haystack: 'documents directory' },
  { title: 'Billing', subtitle: 'Operations', to: ROUTES.billing, haystack: 'billing operations' },
  { title: 'Change Requests', subtitle: 'Operations', to: ROUTES.changeRequests, haystack: 'change requests approvals operations' },
  { title: 'Reports', subtitle: 'Operations', to: ROUTES.reports, haystack: 'reports operations' },
  { title: 'Notifications', subtitle: 'System', to: ROUTES.notifications, haystack: 'notifications system' },
  { title: 'Settings', subtitle: 'System', to: ROUTES.settings, haystack: 'settings system' },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Global command palette: quick-open over pages, orders, patients, doctors,
 * and cases. Opens with Cmd/Ctrl+K; Enter opens the highlighted result; Esc
 * closes and returns focus to the trigger.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { orders, patients, doctors, cases } = useAppData()
  const [input, setInput] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo<PaletteResult[]>(
    () => [
      ...PAGE_ENTRIES.map((page, position) => ({
        id: `page-${position}`,
        group: 'Pages' as const,
        title: page.title,
        subtitle: page.subtitle,
        to: page.to,
        haystack: page.haystack,
      })),
      ...orders.map((order) => ({
        id: `order-${order.id}`,
        group: 'Orders' as const,
        title: order.orderNumber,
        subtitle: `${order.patientName} · ${order.status}`,
        to: `/orders/${order.id}`,
        haystack:
          `${order.orderNumber} ${order.patientName} ${order.doctorName} ${order.clinicName}`.toLowerCase(),
      })),
      ...patients.map((patient) => ({
        id: `patient-${patient.id}`,
        group: 'Patients' as const,
        title: patient.name,
        subtitle: `${patient.clinicName} · ${patient.email}`,
        to: `/patients/${patient.id}`,
        haystack: `${patient.name} ${patient.email} ${patient.clinicName}`.toLowerCase(),
      })),
      ...doctors.map((doctor) => ({
        id: `doctor-${doctor.id}`,
        group: 'Doctors' as const,
        title: doctor.name,
        subtitle: `${doctor.specialty} · ${doctor.clinicName}`,
        to: `/doctors/${doctor.id}`,
        haystack: `${doctor.name} ${doctor.specialty} ${doctor.clinicName}`.toLowerCase(),
      })),
      ...cases.map((item) => ({
        id: `case-${item.id}`,
        group: 'Cases' as const,
        title: item.caseNumber,
        subtitle: item.title,
        to: `/cases/${item.id}`,
        haystack: `${item.caseNumber} ${item.title} ${item.patientName}`.toLowerCase(),
      })),
    ],
    [orders, patients, doctors, cases],
  )

  const results = useMemo(() => {
    const query = input.trim().toLowerCase()
    if (!query) return []
    const counts = new Map<PaletteResult['group'], number>()
    return index.filter((row) => {
      if (!row.haystack.includes(query)) return false
      const count = counts.get(row.group) ?? 0
      if (count >= PER_GROUP) return false
      counts.set(row.group, count + 1)
      return true
    })
  }, [index, input])

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setInput('')
      setActiveIndex(0)
    }
    onOpenChange(next)
  }

  const go = (to: string) => {
    onOpenChange(false)
    void navigate(to)
  }

  const active = results[activeIndex]
  let lastGroup: PaletteResult['group'] | null = null

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay-backdrop" />
        <Dialog.Content
          aria-label="Command palette"
          className="bg-popover text-popover-foreground fixed top-[12vh] left-1/2 z-[51] w-[min(92vw,36rem)] -translate-x-1/2 rounded-2xl border border-border p-2 shadow-xl focus:outline-none"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus()
          }}
        >
          <Dialog.Title className="sr-only">Search pages and records</Dialog.Title>
          <div className="flex items-center gap-2 rounded-xl px-2">
            <Search aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
            <input
              aria-label="Search pages, orders, patients, doctors and cases"
              aria-expanded={results.length > 0}
              aria-controls="command-palette-list"
              aria-activedescendant={active ? `palette-${active.id}` : undefined}
              autoComplete="off"
              className="min-h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(event) => {
                setInput(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setActiveIndex((current) => Math.min(current + 1, results.length - 1))
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  setActiveIndex((current) => Math.max(current - 1, 0))
                } else if (event.key === 'Enter' && active) {
                  event.preventDefault()
                  go(active.to)
                }
              }}
              placeholder="Search pages, orders, patients…"
              ref={inputRef}
              role="combobox"
              spellCheck={false}
              type="text"
              value={input}
            />
            <kbd className="bg-muted text-muted-foreground hidden rounded-md px-1.5 py-0.5 font-mono text-xs sm:block">
              esc
            </kbd>
          </div>
          {input.trim().length > 0 && (
            <div className="mt-1 max-h-[50vh] overflow-y-auto border-t border-border pt-1">
              {results.length === 0 ? (
                <p className="text-muted-foreground px-3 py-6 text-center text-sm" role="status">
                  No matching pages, orders, patients, doctors, or cases
                </p>
              ) : (
                <ul aria-label="Results" id="command-palette-list" role="listbox">
                  {results.map((row, position) => {
                    const header = row.group !== lastGroup
                    lastGroup = row.group
                    return (
                      <li key={row.id}>
                        {header && (
                          <p aria-hidden="true" className="text-muted-foreground px-3 pt-2 pb-1 text-xs font-semibold tracking-[0.06em] uppercase">
                            {row.group}
                          </p>
                        )}
                        <button
                          aria-selected={position === activeIndex}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                            position === activeIndex && 'bg-accent text-accent-foreground',
                          )}
                          id={`palette-${row.id}`}
                          onClick={() => {
                            go(row.to)
                          }}
                          onMouseMove={() => {
                            setActiveIndex(position)
                          }}
                          role="option"
                          type="button"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{row.title}</span>
                            <span className="text-muted-foreground block truncate text-xs">{row.subtitle}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
