import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { buildBreadcrumbs } from '@/app/breadcrumbs'
import { useAppData } from '@/data/app-data-context'

/**
 * Route-aware breadcrumbs. Shown only on nested pages: a top-level page's
 * single crumb would repeat its page title.
 */
export function AppBreadcrumbs() {
  const location = useLocation()
  const data = useAppData()
  const crumbs = buildBreadcrumbs(location.pathname, data)
  if (crumbs.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li className="flex min-w-0 items-center gap-1" key={crumb.label}>
              {index > 0 && (
                <ChevronRight aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
              )}
              {last || crumb.to == null ? (
                <span aria-current={last ? 'page' : undefined} className="text-foreground truncate font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link className="text-muted-foreground hover:text-foreground truncate hover:underline" to={crumb.to}>
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
