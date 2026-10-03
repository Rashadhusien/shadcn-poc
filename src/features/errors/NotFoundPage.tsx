import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { ROUTES } from '@/app/routes'

/** 404 page for unknown routes inside the app shell. */
export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" />
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="bg-muted mx-auto grid size-12 place-items-center rounded-full">
          <SearchX aria-hidden="true" className="text-muted-foreground size-6" />
        </span>
        <h2 className="text-section mt-4 font-semibold">This page does not exist</h2>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          The link may be out of date, or the address was mistyped.
        </p>
        <Link
          className="bg-primary text-primary-foreground mt-5 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold"
          to={ROUTES.dashboard}
        >
          Back to dashboard
        </Link>
      </div>
    </>
  )
}
