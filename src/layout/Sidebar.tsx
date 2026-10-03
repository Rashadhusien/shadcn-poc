import * as Dialog from '@radix-ui/react-dialog'
import { NavLink, useLocation } from 'react-router-dom'
import { Stethoscope, X } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { useAppData } from '@/data/app-data-context'
import { isChangeRequestActionable } from '@/domain/rules/metrics'
import { NAV_GROUPS, type NavBadge, type NavEntry } from './navigation'
import { cn } from '@/lib/utils'

export type SidebarVariant = 'full' | 'rail' | 'overlay'

function isActivePath(pathname: string, to: string): boolean {
  if (to === ROUTES.dashboard) return pathname === ROUTES.dashboard || pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function initialsOf(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

interface SidebarContentProps {
  rail: boolean
  onNavigate?: () => void
}

function SidebarContent({ rail, onNavigate }: SidebarContentProps) {
  const { pathname } = useLocation()
  const { changeRequests, settings } = useAppData()
  const badges: Record<NavBadge, number> = {
    openChangeRequests: changeRequests.filter((row) => isChangeRequestActionable(row.status)).length,
  }
  const { firstName, lastName, role } = settings.profile

  const renderEntry = (entry: NavEntry) => {
    const active = isActivePath(pathname, entry.to)
    const count = entry.badge ? badges[entry.badge] : 0
    const Icon = entry.icon
    return (
      <li className="px-2 py-0.5" key={entry.to}>
        <NavLink
          aria-current={active ? 'page' : undefined}
          aria-label={count > 0 ? `${entry.label}, ${String(count)} open` : undefined}
          className={cn(
            'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium',
            rail && 'justify-center px-0',
            active
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
          )}
          onClick={onNavigate}
          title={rail ? entry.label : undefined}
          to={entry.to}
        >
          <span className="relative shrink-0">
            <Icon aria-hidden="true" className="size-5" />
            {rail && count > 0 && (
              <span aria-hidden="true" className="bg-destructive absolute -top-1 -right-1 size-2 rounded-full" />
            )}
          </span>
          {!rail && <span className="min-w-0 flex-1 truncate">{entry.label}</span>}
          {!rail && count > 0 && (
            <span aria-hidden="true" className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 font-mono text-xs font-semibold">
              {count}
            </span>
          )}
        </NavLink>
      </li>
    )
  }

  return (
    <nav aria-label="Primary" className="flex h-full flex-col">
      <div className={cn('flex min-h-16 items-center gap-2 border-b border-sidebar-border px-5', rail && 'justify-center px-0')}>
        <span aria-hidden="true" className="bg-sidebar-primary text-sidebar-primary-foreground grid size-9 shrink-0 place-items-center rounded-lg">
          <Stethoscope className="size-5" />
        </span>
        {!rail && <span className="truncate text-base font-semibold tracking-tight">Diagnostix</span>}
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto py-2">
        {NAV_GROUPS.map((group, index) => (
          <section aria-label={group.label} key={group.label}>
            {rail ? (
              index > 0 && <hr className="border-sidebar-border mx-4 my-2" />
            ) : (
              <p className="text-sidebar-foreground/70 px-5 pt-3 pb-1 text-xs font-semibold tracking-[0.06em] uppercase">
                {group.label}
              </p>
            )}
            <ul>{group.entries.map(renderEntry)}</ul>
          </section>
        ))}
      </div>
      <div className={cn('flex items-center gap-3 border-t border-sidebar-border p-4', rail && 'justify-center p-3')}>
        <span aria-hidden="true" className="bg-sidebar-primary text-sidebar-primary-foreground grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold">
          {initialsOf(firstName, lastName)}
        </span>
        {!rail && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {firstName} {lastName}
            </span>
            <span className="text-sidebar-foreground/70 block truncate text-xs">{role}</span>
          </span>
        )}
      </div>
    </nav>
  )
}

interface SidebarProps {
  variant: SidebarVariant
  /** Overlay drawer visibility. */
  open: boolean
  onClose: () => void
}

/**
 * Sidebar navigation. Variants are chosen by AppShell with CSS breakpoints:
 * `full` persistent 260px (desktop), `rail` persistent 72px icon rail
 * (tablet, or collapsed desktop), `overlay` temporary drawer (mobile, or
 * expanded tablet). The sidebar stays dark navy in both color modes.
 */
export function Sidebar({ variant, open, onClose }: SidebarProps) {
  if (variant === 'overlay') {
    return (
      <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay-backdrop" />
          <Dialog.Content
            aria-label="Primary navigation"
            className="bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-[51] w-[260px] max-w-[82vw] overflow-y-auto border-r border-sidebar-border focus:outline-none"
          >
            <Dialog.Title className="sr-only">Primary navigation</Dialog.Title>
            <button
              aria-label="Close navigation"
              className="text-sidebar-foreground hover:bg-sidebar-accent absolute top-3 right-3 grid size-11 place-items-center rounded-lg"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <SidebarContent rail={false} onNavigate={onClose} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border',
        variant === 'rail' ? 'md:flex md:w-[72px]' : 'lg:flex lg:w-[260px]',
      )}
    >
      <SidebarContent rail={variant === 'rail'} />
    </aside>
  )
}
