import { TriangleAlert } from 'lucide-react'
import { COLLECTION_KEYS } from '@/data/api'
import { useAppActions, useAppData } from '@/data/app-data-context'

/**
 * App-wide load feedback for the shared data store: a thin loading bar while
 * any collection loads, plus one error banner per failed collection with Retry.
 */
export function DataStatusBar() {
  const { meta } = useAppData()
  const { reload } = useAppActions()
  const loading = COLLECTION_KEYS.some((key) => meta[key].status === 'loading')
  const failed = COLLECTION_KEYS.filter((key) => meta[key].status === 'error')

  return (
    <>
      <div className="mb-2 h-0.5" aria-hidden={!loading}>
        {loading && (
          <div aria-label="Loading data" className="bg-primary h-full animate-pulse rounded-full" role="progressbar" />
        )}
      </div>
      {failed.length > 0 && (
        <div className="mb-4 space-y-2">
          {failed.map((key) => (
            <div
              className="border-destructive/40 bg-destructive/5 text-foreground flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-sm"
              key={key}
              role="alert"
            >
              <TriangleAlert aria-hidden="true" className="text-destructive size-4 shrink-0" />
              <p className="min-w-0 flex-1">{meta[key].error}</p>
              <button
                className="text-destructive hover:bg-destructive/10 min-h-11 rounded-lg px-3 font-semibold"
                onClick={() => {
                  reload(key)
                }}
                type="button"
              >
                Retry
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
