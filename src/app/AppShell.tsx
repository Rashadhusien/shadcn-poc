import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppBreadcrumbs } from '@/layout/AppBreadcrumbs'
import { DataStatusBar } from '@/layout/DataStatusBar'
import { Header } from '@/layout/Header'
import { Sidebar } from '@/layout/Sidebar'
import { SkipLink } from '@/layout/SkipLink'

const COLLAPSED_KEY = 'dentalab-sidebar-collapsed'
const DESKTOP_QUERY = '(min-width: 64rem)'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

function writeCollapsed(value: boolean): void {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(value))
  } catch {
    // Preference simply isn't remembered.
  }
}

/** Desktop band subscription (same pattern as the theme System subscription). */
function useDesktop(): boolean {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  )
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      setDesktop(event.matches)
    }
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [])
  return desktop
}

/**
 * App shell: sidebar + header + main content landmark.
 * - mobile (<768): overlay drawer from the header menu button
 * - tablet (768–1023): icon rail; the menu button opens the full drawer
 * - desktop (≥1024): full sidebar; the menu button collapses it to the rail
 *   and the choice is remembered.
 */
export function AppShell() {
  const desktop = useDesktop()
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const closeOverlay = () => {
    setOverlayOpen(false)
  }

  const toggleNavigation = () => {
    if (desktop) {
      setCollapsed((current) => {
        writeCollapsed(!current)
        return !current
      })
      return
    }
    setOverlayOpen((current) => !current)
  }

  const navigationExpanded = desktop ? !collapsed : overlayOpen

  return (
    <div className="flex min-h-screen">
      <SkipLink />
      {desktop ? (
        <Sidebar variant={collapsed ? 'rail' : 'full'} open={false} onClose={closeOverlay} />
      ) : (
        <>
          <Sidebar variant="rail" open={false} onClose={closeOverlay} />
          {overlayOpen && <Sidebar variant="overlay" open onClose={closeOverlay} />}
        </>
      )}
      <div className="min-w-0 flex-1">
        <Header onMenuClick={toggleNavigation} navigationExpanded={navigationExpanded} />
        <main className="mx-auto w-full max-w-[90rem] px-4 py-6 md:px-6" id="main-content" tabIndex={-1}>
          <DataStatusBar />
          <AppBreadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
