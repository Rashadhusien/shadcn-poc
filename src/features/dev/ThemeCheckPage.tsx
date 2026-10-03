import * as Dialog from '@radix-ui/react-dialog'
import * as Popover from '@radix-ui/react-popover'
import * as Select from '@radix-ui/react-select'
import {
  Activity,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Info,
  X,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { ThemeSwitcher } from '@/theme/ThemeSwitcher'
import { useTheme } from '@/theme/ThemeProvider'
import { tokens } from '@/theme/tokens'

const procedureCounts = [34, 52, 44, 70, 58, 82, 63, 91, 74, 100, 87, 110]
const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div
        aria-label={`${label}: ${value}`}
        className="border-border/70 h-12 rounded-lg border"
        role="img"
        style={{ backgroundColor: value }}
      />
      <p className="text-foreground mt-2 truncate text-xs font-medium">
        {label}
      </p>
      <p className="text-muted-foreground font-mono text-xs leading-4">
        {value}
      </p>
    </div>
  )
}

function StatusChip({
  name,
}: {
  name: keyof typeof tokens.modes.light.statusBadges
}) {
  const { resolvedTheme } = useTheme()
  const badge = tokens.modes[resolvedTheme].statusBadges[name]
  const Icon =
    name === 'success'
      ? CircleCheck
      : name === 'warning' || name === 'error'
        ? CircleAlert
        : name === 'info'
          ? Info
          : CircleHelp

  return (
    <span
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold capitalize"
      style={{ backgroundColor: badge.background, color: badge.foreground }}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {name}
    </span>
  )
}

function ColorSystem() {
  const { resolvedTheme } = useTheme()
  const palette = tokens.modes[resolvedTheme]

  return (
    <section aria-labelledby="color-system-title" className="space-y-5">
      <div>
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
          Color system
        </p>
        <h2
          className="text-section mt-1 font-semibold tracking-tight"
          id="color-system-title"
        >
          Purposeful color, tuned for daily review
        </h2>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="border-border bg-card rounded-2xl border p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Brand and surfaces</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Opal surfaces, Royal Navy actions, readable clinical states.
              </p>
            </div>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 font-mono text-xs">
              {resolvedTheme}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <Swatch label="Primary" value={palette.primary.main} />
            <Swatch label="Primary tint" value={palette.primary.tint} />
            <Swatch label="Secondary" value={palette.secondary.main} />
            <Swatch label="Canvas" value={palette.background} />
            <Swatch label="Surface" value={palette.surface} />
            <Swatch label="Elevated" value={palette.surfaceElevated} />
            <Swatch label="Border" value={palette.border} />
            <Swatch label="Focus ring" value={palette.focusRing} />
          </div>
          <div
            className="mt-5 flex flex-wrap gap-2"
            aria-label="Status examples"
          >
            <StatusChip name="success" />
            <StatusChip name="warning" />
            <StatusChip name="error" />
            <StatusChip name="info" />
            <StatusChip name="neutral" />
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-5 md:p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Diagnostic series</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Nine categorical colors remain legible on both surfaces.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-3 gap-y-4 md:grid-cols-5">
            {palette.charts.map((color, index) => (
              <Swatch
                key={color}
                label={`Series ${String(index + 1).padStart(2, '0')}`}
                value={color}
              />
            ))}
          </div>
          <p className="border-border bg-muted/60 text-muted-foreground mt-5 rounded-lg border px-3 py-2 text-xs leading-5">
            Trend area:{' '}
            <span className="text-foreground font-mono">
              {palette.trendArea}
            </span>
            . Chart labels and data summaries must accompany color in production
            charts.
          </p>
        </div>
      </div>
    </section>
  )
}

function TypographyAndControls() {
  return (
    <section
      aria-labelledby="type-controls-title"
      className="grid gap-5 xl:grid-cols-2"
    >
      <div className="border-border bg-card rounded-2xl border p-5 md:p-6">
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
        Typography
        </p>
        <h2
          className="text-section mt-1 font-semibold tracking-tight"
          id="type-controls-title"
        >
          A quiet, information-first type scale
        </h2>
        <div className="border-border mt-5 space-y-4 border-t pt-4">
          <div>
            <p className="text-page-title font-semibold tracking-tight">
              Diagnostic review
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Page title · 22 / 28 · Inter 600
            </p>
          </div>
          <div className="border-border flex items-end justify-between gap-4 border-t pt-4">
            <div>
              <p className="text-kpi font-semibold tracking-tight">1,248</p>
              <p className="text-muted-foreground text-xs">
                Scans reviewed this month
              </p>
            </div>
            <p className="text-muted-foreground font-mono text-sm">DX-02481</p>
          </div>
          <p className="border-border text-secondary-foreground border-t pt-4 text-sm leading-5">
            Primary text stays measured and clear. Supporting copy preserves
            enough contrast for long clinical work sessions.
          </p>
          <p className="text-muted-foreground text-xs leading-4">
            Captions, field labels and table headers remain at least 12 px.
          </p>
        </div>
      </div>

      <div className="border-border bg-card rounded-2xl border p-5 md:p-6">
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
        Interactive states
        </p>
        <h2 className="text-section mt-1 font-semibold tracking-tight">
          Actions, boundaries and status cues
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary-hover min-h-11 rounded-lg px-4 font-semibold"
            onClick={() =>
              toast.success('Review saved', {
                description: 'The theme tokens also style this toast.',
              })
            }
            type="button"
          >
            Save review
          </button>
          <button
            className="border-border bg-secondary text-secondary-foreground hover:bg-secondary-hover min-h-11 rounded-lg border px-4 font-semibold"
            onClick={() => toast('No changes to review')}
            type="button"
          >
            Secondary action
          </button>
          <button
            className="border-destructive/40 text-destructive hover:bg-destructive/10 min-h-11 rounded-lg border px-4 font-semibold"
            onClick={() =>
              toast.error('Preview only', {
                description: 'No record was changed.',
              })
            }
            type="button"
          >
            Destructive state
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium" htmlFor="example-field">
            Search a diagnostic record
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground mt-2 min-h-11 w-full rounded-lg border px-3"
              id="example-field"
              placeholder="Case ID or scan code"
            />
          </label>
          <div className="flex items-end">
            <div className="border-border text-muted-foreground w-full rounded-lg border border-dashed px-3 py-2.5 text-xs leading-5">
              <span className="text-foreground font-medium">
                Keyboard check:
              </span>{' '}
              Tab through controls; focus uses the same diagnostic ring in both
              themes.
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusChip name="success" />
          <StatusChip name="warning" />
          <StatusChip name="error" />
        </div>
      </div>
    </section>
  )
}

function ChartPreview() {
  const { resolvedTheme } = useTheme()
  const palette = tokens.modes[resolvedTheme]
  const points = procedureCounts
    .map((count, index) => `${index * 42},${118 - count * 0.78}`)
    .join(' ')

  return (
    <section
      aria-labelledby="chart-preview-title"
      className="border-border bg-card rounded-2xl border p-5 md:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
            Chart surfaces
          </p>
          <h2
            className="text-section mt-1 font-semibold tracking-tight"
            id="chart-preview-title"
          >
            Monthly imaging activity
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            A token-driven preview; the chart library wrapper is introduced with
            the shared kit.
          </p>
        </div>
        <span className="border-border text-muted-foreground rounded-full border px-3 py-1.5 font-mono text-xs">
          12 months · mock data
        </span>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="border-border bg-background min-w-0 rounded-xl border p-4">
          <div
            className="flex h-40 items-end gap-2 md:gap-3"
            role="img"
            aria-label="Monthly imaging activity increases gradually across twelve months"
          >
            {procedureCounts.map((count, index) => (
              <div
                className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
                key={monthLabels[index]}
              >
                <div className="flex h-full items-end">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${count / 1.1}%`,
                      backgroundColor: palette.charts[0],
                    }}
                  />
                </div>
                <span className="text-muted-foreground truncate text-center font-mono text-xs">
                  {monthLabels[index]}
                </span>
              </div>
            ))}
          </div>
          <svg
            aria-hidden="true"
            className="mt-4 h-10 w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 462 120"
          >
            <polyline
              fill="none"
              points={points}
              stroke={palette.charts[0]}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </svg>
        </div>
        <div className="space-y-3" aria-label="Chart summary">
          <div className="border-border flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
            <span className="text-secondary-foreground flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: palette.charts[0] }}
              />
              Reviewed studies
            </span>
            <span className="text-muted-foreground font-mono text-xs">865</span>
          </div>
          <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-xs leading-5">
            Always pair chart color with a readable label and data summary.
          </p>
        </div>
      </div>
    </section>
  )
}

function OverlayPreview() {
  return (
    <section
      aria-labelledby="overlay-preview-title"
      className="border-border bg-card rounded-2xl border p-5 md:p-6"
    >
      <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
        Portals and overlays
      </p>
      <h2
        className="text-section mt-1 font-semibold tracking-tight"
        id="overlay-preview-title"
      >
        Portaled controls inherit the document theme
      </h2>
      <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
        Open each control in light and dark mode. Dialog, popover, select and
        toast content render outside the local component tree.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="border-border bg-background text-foreground hover:bg-action-hover min-h-11 rounded-lg border px-4 font-medium"
              type="button"
            >
              Open dialog
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay-backdrop" />
            <Dialog.Content className="overlay-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-lg font-semibold">
                    Review scan quality
                  </Dialog.Title>
                  <Dialog.Description className="text-muted-foreground mt-1 text-sm">
                    Dialog surfaces and text should follow the active theme.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close dialog"
                  className="text-muted-foreground hover:bg-action-hover hover:text-foreground inline-flex size-11 shrink-0 items-center justify-center rounded-lg"
                >
                  <X aria-hidden="true" className="size-4" />
                </Dialog.Close>
              </div>
              <div className="border-border bg-muted mt-5 rounded-lg border p-3 text-sm">
                No patient data is shown in this preview.
              </div>
              <Dialog.Close
                className="bg-primary text-primary-foreground mt-5 min-h-11 rounded-lg px-4 font-semibold"
                type="button"
              >
                Done
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className="border-border bg-background text-foreground hover:bg-action-hover inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 font-medium"
              type="button"
            >
              Filter menu <ChevronDown aria-hidden="true" className="size-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              className="theme-popover"
              sideOffset={8}
            >
              <p className="text-foreground text-sm font-semibold">
                Review status
              </p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">
                Popover inherits the active document variables.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusChip name="success" />
                <StatusChip name="warning" />
              </div>
              <Popover.Arrow className="fill-popover" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <Select.Root defaultValue="ready">
          <Select.Trigger
            aria-label="Select scan status"
            className="border-input bg-background text-foreground focus-visible:ring-ring inline-flex min-h-11 min-w-40 items-center justify-between gap-2 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDown
                aria-hidden="true"
                className="text-muted-foreground size-4"
              />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="theme-select-content"
              position="popper"
              sideOffset={6}
            >
              <Select.Viewport>
                <Select.Item
                  className="theme-select-item text-sm"
                  value="ready"
                >
                  <Select.ItemText>Ready for review</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item
                  className="theme-select-item text-sm"
                  value="processing"
                >
                  <Select.ItemText>Processing</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item
                  className="theme-select-item text-sm"
                  value="needs-attention"
                >
                  <Select.ItemText>Needs attention</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button
          className="text-primary hover:bg-primary-tint min-h-11 rounded-lg px-4 font-medium"
          onClick={() =>
            toast('Theme check', {
              description: 'This toast is rendered in a portal.',
            })
          }
          type="button"
        >
          Show toast
        </button>
      </div>
    </section>
  )
}

function ToothScanPreview() {
  return (
    <figure className="border-border bg-card w-full rounded-xl border p-4 md:p-5">
      <div className="flex items-center gap-4">
        <svg
          aria-label="Illustrative occlusal tooth scan diagram"
          className="text-primary h-36 w-32 shrink-0"
          role="img"
          viewBox="0 0 180 190"
        >
          <path
            d="M90 18C69 9 47 19 40 40c-9 26 4 44 13 62 8 18 9 53 23 66 9 9 16-18 24-24 8 6 15 33 24 24 14-13 15-48 23-66 9-18 22-36 13-62-7-21-29-31-50-22-9 4-11 4-20 0Z"
            fill="var(--primary-tint)"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M55 66c13-17 28-23 36-20 8-3 23 3 36 20M72 63c5 12 11 18 19 18 8 0 14-6 19-18m-19 21v22m-18-13c5-6 11-9 18-9 7 0 13 3 18 9"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity=".7"
            strokeWidth="2"
          />
          <circle cx="91" cy="100" r="4" fill="currentColor" />
        </svg>
        <div className="min-w-0">
          <p className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
            FDI · 26
          </p>
          <h2 className="text-foreground mt-1 text-lg font-semibold tracking-tight">
            Upper first molar
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-5">
            Occlusal scan · Review ready
          </p>
          <span className="bg-status-success-background text-status-success-foreground mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold">
            <CircleCheck aria-hidden="true" className="size-3.5" />
            Surface captured
          </span>
        </div>
      </div>
      <div aria-label="Nearby tooth positions" className="mt-4 flex gap-2">
        {['24', '25', '26', '27', '28'].map((number) => (
          <span
            aria-current={number === '26' ? 'true' : undefined}
            className={
              number === '26'
                ? 'bg-primary text-primary-foreground inline-flex size-9 items-center justify-center rounded-md font-mono text-xs font-semibold'
                : 'bg-muted text-muted-foreground inline-flex size-9 items-center justify-center rounded-md font-mono text-xs'
            }
            key={number}
          >
            {number}
          </span>
        ))}
      </div>
      <figcaption className="text-muted-foreground mt-3 text-xs leading-4">
        Illustrative tooth geometry · no patient data
      </figcaption>
    </figure>
  )
}

export default function ThemeCheckPage() {
  const { resolvedTheme } = useTheme()

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-6 md:py-8 lg:px-8">
      <Toaster position="top-right" theme={resolvedTheme} />
      <header className="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div>
          <p className="leading-5 font-semibold tracking-tight">Diagnostix</p>
          <p className="text-muted-foreground text-xs">
            Dental diagnostics workspace
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground hidden items-center gap-1.5 font-mono text-xs tracking-wider uppercase md:inline-flex">
            <Activity aria-hidden="true" className="size-3.5" /> Theme lab
          </span>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="grid gap-6 py-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
        <div className="py-2">
          <h1 className="text-page-title max-w-2xl font-semibold tracking-tight">
            Clarity at the level of every tooth.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            A clinical review workspace shaped by deep navy and clean opal
            surfaces. Review the palette, chart series and controls in Light,
            Dark and System modes.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span className="text-secondary-foreground inline-flex items-center gap-2">
              <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
              Enamel &amp; occlusion
            </span>
            <span className="text-muted-foreground">System Inter stack · local mono · no patient data</span>
          </div>
        </div>
        <ToothScanPreview />
      </div>

      <div className="space-y-8 pb-8">
        <ColorSystem />
        <TypographyAndControls />
        <ChartPreview />
        <OverlayPreview />
      </div>
      <footer className="border-border text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t py-4 text-xs">
        <span>Diagnostix · Theme review</span>
        <span className="font-mono">
          Local fonts · semantic tokens · keyboard-ready previews
        </span>
      </footer>
    </main>
  )
}
