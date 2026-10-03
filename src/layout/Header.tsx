import { useEffect, useState } from 'react'
import { Menu, PanelLeftOpen, Search } from 'lucide-react'
import { CommandPalette } from './CommandPalette'
import { NotificationsMenu } from './NotificationsMenu'
import { ThemeSwitcher } from '@/theme/ThemeSwitcher'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  onMenuClick: () => void
  /** Whether the full navigation is currently shown (for the toggle label). */
  navigationExpanded: boolean
}

/**
 * Header bar: navigation toggle, global command palette, notifications,
 * color mode, and the account menu. Search opens the palette on every
 * viewport (dialog replaces the inline search row).
 */
export function Header({ onMenuClick, navigationExpanded }: HeaderProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((current) => !current)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <>
      <header className="bg-background/95 sticky top-0 z-40 border-b border-border backdrop-blur">
        <div className="flex min-h-16 items-center gap-1 px-2 sm:px-4">
          <button
            aria-expanded={navigationExpanded}
            aria-label={navigationExpanded ? 'Collapse navigation' : 'Expand navigation'}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground grid size-11 shrink-0 place-items-center rounded-lg"
            onClick={onMenuClick}
            title={navigationExpanded ? 'Collapse navigation' : 'Expand navigation'}
            type="button"
          >
            {navigationExpanded ? (
              <PanelLeftOpen aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>

          <button
            aria-label="Search pages and records"
            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground ml-1 hidden min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 text-sm sm:flex sm:max-w-[440px]"
            onClick={() => {
              setPaletteOpen(true)
            }}
            type="button"
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">Search orders, patients, doctors…</span>
            <kbd className="bg-muted ml-auto hidden shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs lg:block">
              ⌘K
            </kbd>
          </button>
          <div className="flex-1 sm:hidden" />

          <button
            aria-label="Search pages and records"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground grid size-11 shrink-0 place-items-center rounded-lg sm:hidden"
            onClick={() => {
              setPaletteOpen(true)
            }}
            type="button"
          >
            <Search aria-hidden="true" className="size-5" />
          </button>

          <NotificationsMenu />
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  )
}
