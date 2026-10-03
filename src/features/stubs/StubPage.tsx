import { PageHeader } from '@/components/app/PageHeader'

interface StubPageProps {
  title: string
  phase: string
}

/**
 * Placeholder for baseline routes whose feature phase has not run yet.
 * Keeps the full route map resolvable from P04; replaced phase by phase.
 */
export function StubPage({ title, phase }: StubPageProps) {
  return (
    <>
      <PageHeader title={title} description={`Ships in ${phase}.`} />
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <p className="text-muted-foreground text-sm leading-6">
          This screen is part of the baseline route map and arrives in {phase}. No patient data is shown here.
        </p>
      </div>
    </>
  )
}
