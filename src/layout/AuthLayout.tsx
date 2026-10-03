import type { ReactNode } from 'react'
import { CircleCheck, Stethoscope } from 'lucide-react'

const POINTS = [
  'Orders, services and scans in one workflow',
  'Live status from intake to delivery',
  'Patients, clinics and billing side by side',
]

function BrandMark() {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-lg">
        <Stethoscope className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Diagnostix</span>
    </span>
  )
}

/**
 * Signed-out page frame: brand panel beside the form on wide screens, the
 * form alone with the brand mark above it on phones. The panel states what
 * the platform does, with no invented numbers and no remote imagery.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-background grid min-h-dvh md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="bg-sidebar text-sidebar-foreground hidden flex-col justify-between p-12 md:flex">
        <BrandMark />
        <div>
          <p className="text-page-title max-w-md font-semibold tracking-tight">
            The digital dental laboratory, end to end.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li className="flex items-center gap-2 text-sm" key={point}>
                <CircleCheck aria-hidden="true" className="text-sidebar-primary size-4 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sidebar-foreground/70 text-xs">Diagnostix · Dental diagnostics workspace</p>
      </div>
      <div className="grid place-items-center p-4 sm:p-8">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="md:hidden">
            <BrandMark />
          </div>
          <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </main>
  )
}
