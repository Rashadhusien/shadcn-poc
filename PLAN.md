# Diagnostix shadcn port — project plan

## Goals and non-goals

Build a third, independently branded React port that can be compared fairly with `../mui` and `../kendo-react-app`. Match MUI's route inventory, domain behavior, labels, seed data, simulations, validation rules, and important responsive states; replace its UI implementation with shadcn/ui + Tailwind and a distinct Diagnostix identity. Work proceeds only after the user starts each phase. Phase 0 is documentation only.

Non-goals: backend/API, real patient data, production authentication, SSR/Next.js, unrelated domain redesign, automated tests or Storybook unless the user approves the explicit open decision, and copying/translating MUI JSX. Use mock data only. No remote fonts or images.

## Scope

All routes and screen groups documented in [BASELINES.md](docs/analysis/BASELINES.md): auth/login; dashboard; orders list, seven-step create, details, edit, workflow, files, sub-orders; cases/list/details; workflow board; scan center; patients/doctors/clinics and detail views; documents; billing; change requests; reports hub and four report routes; notifications; settings; unlinked forms/grid showcases; Not Found. Deliberate deltas: 768px table-card breakpoint required for this port; shadcn/RHF form implementation; Recharts; command-palette order lookup; optional keyboard “Move to…” board path from Kendo (user decision).

## Architecture decisions

| Decision | Choice | Reason | Alternative rejected |
|---|---|---|---|
| SPA foundation | Vite + React + strict TypeScript, `noUncheckedIndexedAccess`, `@/` alias | Matches the existing ports and requested stack | SSR/Next.js and a framework change |
| Routing | `react-router-dom`, route-level lazy modules | Same route model, smaller initial bundle | Eager all-pages bundle |
| UI foundation | Tailwind CSS v4 + shadcn registry components copied into `src/components/ui` and owned by this repo | Editable, accessible primitives with a consistent token system | A second packaged UI kit |
| CSS tokens | `src/theme/tokens.ts` is the sole value source; deterministic CSS generation | Avoid cross-file value drift and color literals | Hand-maintained duplicate values |
| Domain/data | Copy MUI domain/data and selected helpers, byte-for-byte except import paths, manifest every source hash | Fair comparison and identical deterministic behavior | Reimplementing equivalent rules |
| Tables | TanStack Table in one app-owned DataTable, including mobile cards under 768 | Sort/page/select/visibility plus predictable states | One-off page tables or premium grid |
| Forms | React Hook Form + Zod + resolver, shadcn form controls | Real schema-driven accessible forms; domain rules remain authoritative | Hand-maintained per-field state |
| Charts | shadcn chart pattern backed by Recharts | Official shadcn chart pattern while keeping data/table alternatives | Independent chart code per page; exact MUI X Charts library reuse |
| Icons/toasts | lucide-react only; Sonner | One icon family and dedicated toast UX | Mixed icon libraries or custom toaster |
| Dates | shadcn Calendar/date-picker based on react-day-picker/date-fns | Themed keyboard-capable date popover | Browser-native date popup |
| Board | dnd-kit if pointer drag is required; keyboard “Move to…” menu always available | Keyboard path is complete operation, drag is enhancement | HTML5-only drag/drop |
| Dark mode | Class strategy on `html`; light/dark/system, `app-theme`, prepaint script | Portals share CSS variables and no first-paint flash | Component-level dark toggles or invert filter |
| Responsive shell | shadcn Sidebar persistent ≥1024, rail 768–1023, sheet below 768 | Matches the requested behavior and supports touch | Desktop-only fixed navigation |
| Quality gates | ESLint with TS, hooks, jsx-a11y; Prettier Tailwind sorter; verify = lint + typecheck + build + token check | Repeatable static and production-build quality | Storybook or automated test suite without approval |

### Stack

React + React DOM + TypeScript; Vite; react-router-dom; Tailwind CSS v4 + shadcn/ui (Radix-based registry source, locally owned); TanStack Table; React Hook Form + Zod; Recharts; lucide-react; Sonner; cmdk/shadcn Command; react-day-picker/date-fns; dnd-kit for board drag; read-only react-odontogram pending its license review; self-hosted DM Sans + IBM Plex Mono; ESLint, typescript-eslint, react-hooks, jsx-a11y, Prettier with Tailwind class sorting. Exact versions and licensing facts are gated in [DEPENDENCIES.md](DEPENDENCIES.md). shadcn [Vite setup](https://ui.shadcn.com/docs/installation/vite), [CLI options](https://ui.shadcn.com/docs/cli) and Tailwind's [Vite integration](https://tailwindcss.com/docs/installation/using-vite) were checked on 2026-10-03: the current docs show the Vite template, `--base` choices, `@tailwindcss/vite`, and CSS import setup. Runtime package versions/release/download metadata remain `[NEEDS VERIFICATION]` because npm registry access is cache-only in this environment.

## Folder structure

```text
src/
  app/             router, route boundaries, providers, auth and route metadata
  components/ui/   shadcn-generated primitives; owned and editable
  components/app/  DataTable, PageHeader, StatusBadge, ConfirmDialog, charts, feedback
  data/ domain/    copied seeds, repositories, state, domain rules
  features/        auth, dashboard, orders, cases, workflow-board, directories,
                   documents, billing, change-requests, scan-center, reports,
                   notifications, settings, showcase, errors
  hooks/ lib/      URL state and pure utilities
  layout/ theme/   application shell and sole token source/provider
scripts/           contrast.mjs, check-tokens.mjs, deterministic CSS build helper
docs/              baselines, decisions, parity, evidence, licensing and design
```

Feature-specific UI stays in its feature folder. `components/ui` holds only registry primitives. `components/app` holds reusable product compositions. Domain rules do not import React or UI components. Use named exports, semantic HTML, small components, no `any`, no dead code, no console logging, route error boundaries, and consistent PascalCase component / camelCase utility naming.

## Data, tables, forms, charts

MUI data/domain semantics are the source of truth. Copy selected neutral modules and seeds with sha256 manifest and identical-seed check. Keep the MUI simulation query behavior. Tables share a TanStack-backed DataTable with single-sort, pagination, row selection, column visibility, and URL-controlled list state where the baseline has it. At <768px render cards with prioritized title/status/details/actions, not a horizontally clipped desktop table. Every list handles loading, empty, error with Retry, and populated states. RHF/Zod controls mirror the same labels, rules, and exact messages in `domain/rules/`. Charts use shared token-driven Recharts wrapper, carry data labels/accessible summaries, and expose equivalent data tables.

## Accessibility and quality bar

WCAG 2.2 AA contrast gates; semantic landmarks; skip link; visible focus; full keyboard operation; labels and aria for all controls; at least 44px touch targets; minimum 12px text; status never color-only; reduced motion respected; destructive actions use AlertDialog confirmation; every data surface has loading, empty and error+Retry; no horizontal page scroll from 360 to 1536; route error boundary; screen-reader announcement for async save/status; verify overlays and portals in light and dark. Manual evidence is recorded in `docs/EVIDENCE_CHECKLIST.md`; no tests are added unless approved.

## Performance and measurements

Use `React.lazy`/route-level splitting; avoid loading Recharts on routes that do not chart; self-host font subsets/weights; keep seeded mock payloads unchanged; avoid unnecessary provider-wide rerenders. Record `vite build` total and largest chunks at P01 and each feature gate; avoid new chunk warnings and investigate any initial chunk above 500kB. No unmeasured performance claims.

## Risks

1. MUI baseline's `noUncheckedIndexedAccess` gap may require small, behavior-preserving fixes; log every touched copied file as modified in COPY_MANIFEST.
2. shadcn CLI and Tailwind v4 APIs evolve; current official install steps were verified, but pin actual package/CLI versions only after Gate 0 approval.
3. Existing MUI chart library differs; chart labels, theme and series parity require visual checks.
4. The explicit 768px card breakpoint differs from MUI's current 640px edge; record this known comparison delta.
5. React-odontogram licensing/maintenance and generated registry components need review before use.
6. npm metadata could not be fetched in the isolated npm cache. Dependency approval remains incomplete until versions, licenses, latest release dates and weekly downloads are verified.

## Phase overview

Estimates are person-hours, planning only; phase branches start only on the user's `start Phase N` message.

| Phase | Title | Branch | Estimate |
|---|---|---|---:|
| P00 | Baselines and plan | `docs/p00-baselines-and-plan` | 7 h |
| P01 | Scaffold and tooling | `chore/p01-scaffold-tooling` | 5 h |
| P02 | Diagnostix theme | `feat/p02-theme-diagnostix` | 8 h |
| P03 | Domain and data | `feat/p03-domain-data` | 5 h |
| P04 | App shell | `feat/p04-app-shell` | 8 h |
| P05 | Component kit | `feat/p05-component-kit` | 12 h |
| P06 | Orders list | `feat/p06-orders-list` | 10 h |
| P07 | Dashboard | `feat/p07-dashboard` | 5 h |
| P08 | Order details and workflow | `feat/p08-order-details` | 12 h |
| P09 | Create and edit order | `feat/p09-create-order` | 12 h |
| P10 | Remaining records and screens | `feat/p10-remaining-screens` | 20 h |
| P11 | QA and polish | `fix/p11-qa-polish` | 10 h |
| P12 | Evidence and docs | `docs/p12-evidence-and-docs` | 5 h |

## Planned dependencies

See [DEPENDENCIES.md](DEPENDENCIES.md) for the planned allowlist, alternatives, and approval status. Gate 0 needs a decision on accepting the packages after metadata verification; no package install is part of Phase 0.

## Open decisions for the owner

1. **Kendo improvements:** approve the accessible keyboard “Move to…” workflow-board action; recommendation: yes. Approve Undo as a parity expansion; recommendation: defer unless explicitly wanted.
2. **Charts:** Recharts through the shadcn chart pattern vs retaining MUI X Charts; recommendation: Recharts, with table and label parity.
3. **Automated tests:** add a small domain/data test suite vs match Kendo's no-automated-tests plan; recommendation: approve focused domain/data tests for a professional result, but do not add until you decide.
4. **Dependency approval:** dependency metadata rows are marked `[NEEDS VERIFICATION]`; approve only after exact versions, license, latest release and weekly downloads have been fetched.
5. **noUncheckedIndexedAccess:** permit small documented type-only fixes in copied MUI modules; recommendation: yes, with manifest diffs and behavior untouched.
6. **Font license:** `@fontsource/dm-sans` and `@fontsource/ibm-plex-mono` publish under OFL-1.1, while the dependency rule permits only MIT/Apache-2.0/ISC/BSD. Recommendation: approve an explicit OFL exception for the bundled font assets so the required self-hosted pairing can remain; otherwise choose the system-font fallback and record that as an approved theme deviation.
