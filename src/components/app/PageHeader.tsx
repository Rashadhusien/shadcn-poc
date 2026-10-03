import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
  description?: string
  /** Inline facts under the title, e.g. status and priority badges. */
  meta?: ReactNode
}

export function PageHeader({ title, action, description, meta }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-page-title font-semibold tracking-tight">{title}</h1>
        {meta != null && (
          <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>
        )}
        {description != null && (
          <p className="text-muted-foreground mt-1 text-sm leading-6">{description}</p>
        )}
      </div>
      {action != null && (
        <div className="flex flex-wrap items-center gap-2">{action}</div>
      )}
    </div>
  )
}
