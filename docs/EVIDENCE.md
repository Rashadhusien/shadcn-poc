# Evidence log

Append a dated phase entry with facts only: files and approximate LOC changed; custom components; dependency additions and reason; configuration steps; commands and output; screenshots/manual checks; workarounds; pain points; unverified items. Never claim a check that was not performed.

## Phase 00 — 2026-10-03

- Minimal `.gitignore` introduced in P00 to keep the required `.handoff` artifact and secret/license files out of the commit; P01 will complete it with tooling-specific ignores.

- Documentation authored: BASELINES, THEME_PROPOSAL, PLAN, TASKS, CLAUDE, GIT_WORKFLOW, DEPENDENCIES, parity/copy/deviation/evidence/licensing shells, AI usage log.
- Repository preflight: clean `main` with HEAD `14822bc1376e4aed689c98b7d6a6fb283fb07a20`; branch created as requested.
- Reused: Kendo MUI baseline/parity/review/tasks; spot-checked routers, package dependency names, source feature imports. MUI source count 189 files; Kendo 239 files. Node v22.20.0, npm 11.6.1.
- Official setup references: shadcn Vite install and CLI docs; Tailwind Vite installation docs. `npm view` failed with `ENOTCACHED`; dependency release dates/download counts unavailable.
- Application code changed: none. Dependencies installed: none. Automated tests: none run.

## Phase 01 progress — dependency gate (2026-10-03)

- Public npm metadata retrieved read-only for proposed packages: exact versions, licenses, release dates and weekly downloads (2026-09-25 to 2026-10-01) recorded in `DEPENDENCIES.md` and `LICENSING_REVIEW.md`.
- Compatibility checked: `eslint-plugin-jsx-a11y@6.10.2` peer range ends at ESLint 9; `typescript-eslint@8.71.0` supports TypeScript `<6.1.0`. Proposed pins are ESLint 9.39.5 and TypeScript 6.0.3.
- GitHub API archive/push checks run for older-release libraries listed in the dependency matrix.
- Gate result: two `@fontsource` packages are OFL-1.1, outside the allowed license set. Owner decision required. No package installs or app-code changes made; verify not run.

## Phase 01 — 2026-10-03

- Files added: package/TypeScript/Vite/shadcn setup, root app and stylesheet, ESLint/Prettier config, token scanner and `cn` utility; approval, task, evidence and licensing docs updated.
- Direct dependencies installed at approved exact versions for the P01 scaffold, router, shadcn utility and icon configuration; remaining approved libraries are phased later. `package-lock.json` records the install.
- Verification command: `npm run verify` passed: ESLint, TypeScript app/node checks, Vite 8.3.2 production build (JS 257.85 kB / gzip 81.99 kB; CSS 9.42 kB / gzip 2.58 kB), token-literal scanner. `npm install` printed 7 high severity advisories; a subsequent `npm audit` reported 0 vulnerabilities, so the discrepancy is recorded for follow-up.
- CLI setup: `shadcn init` confirmed but could not retrieve its preset config from the preset API (`ECONNREFUSED 127.0.0.1:9`). The Nova/Radix/Lucide config was written locally; actual registry component generation is deferred to P05.
- Manual checks: not performed in browser. Node v22.20.0 and npm 11.6.1.

## Phase 02 — Royal Navy / Opal theme (2026-10-03)

- Owner-directed theme replacement (brass → Royal Navy / Opal) on branch
  `feat/p02-theme-diagnostix`.
- Files changed: `src/theme/tokens.json` (full navy/opal token table, 9 charts,
  Inter/JetBrains Mono stacks); `src/theme/theme.css` (regenerated);
  `scripts/contrast.mjs` (hue references prior-brass 37° / Kendo teal 186°, navy
  direction copy); `THEME_PROPOSAL.md` (rewritten direction); `docs/DESIGN_TOKENS.md`
  (regenerated 110-pair report); `src/features/dev/ThemeCheckPage.tsx` (copy);
  `docs/DEVIATIONS.md` (DEV-01/02/03); `docs/PARITY_VS_MUI.md` (THEME-01 done);
  `TASKS.md` (P2.1–P2.4 done); `AI_USAGE_LOG.md` (Phase 02 record).
- Custom components: none added; ThemeProvider/Switcher unchanged.
- Libraries: none added (no unapproved installs; Inter/JetBrains Mono packages pending).
- Config steps: none beyond token source + `npm run theme:build`.
- Commands/results: `npm run verify` passed — ESLint clean; `tsc` app+node clean; Vite
  8.3.2 build JS 417.58 kB / gzip 129.85 kB, CSS 41.27 kB / gzip 7.69 kB (growth vs P01
  from Radix/Sonner/lucide on the theme-check route); token scanner clean;
  contrast 110/110 pass, hue 223.6°, distances 173.4°/37.6°, max saturation 74.1%.
- Screenshots/manual checks: not performed in browser (light/dark/system + OS change +
  all overlays at 360–1536 left for owner).
- Workarounds: supplied boundary/sidebar/focus/warning values adjusted for gates
  (DEV-02); hue references repointed after owner overrode the brass direction (DEV-01).
- Unverified: visual review of the navy theme in browser, both modes and all portals.

## Phase 03 — Domain and data (2026-10-03)

- Branch `feat/p03-domain-data`, based on `main` at P02 commit.
- Files copied byte-for-byte from `../mui/src` (43 total, `@/` paths work unchanged):
  `src/domain/**` (19 .ts: models, catalog, status, priority, notifications, formatters,
  13 rule modules), `src/data/**` (api, context, reducer, AppDataProvider, fixtures,
  13 seed JSONs), `src/lib/download.ts`, `src/hooks/useTableControls.ts`,
  `src/hooks/useTabParam.ts`, `src/app/auth.ts`, `src/app/routes.ts`,
  `src/app/breadcrumbs.ts`. No MUI JSX translated.
- 39/43 files byte-identical; 4 type-only `noUncheckedIndexedAccess` patches (P03-A–E in
  `docs/COPY_MANIFEST.md`): parallel-array guards in order-creation, service/month-label
  guards in reporting, details lookup guard in app-data-reducer, empty-tabs throw in
  useTabParam. All behavior-preserving (guards never trigger at runtime).
- New: `scripts/check-seed.mjs` (13/13 seed hashes match; wired into `npm run verify`
  via `check:seed`), `src/app/AppProviders.tsx` (AppDataProvider composition, wired into
  `src/main.tsx` so `?sim=loading|error|empty` + `&simTarget=` work in dev exactly as MUI).
- Custom components: none. Libraries: none added (react + react-router-dom already approved).
- Config steps: added `check:seed` script; no dependency changes.
- Commands/results: `npm run verify` passed — ESLint clean; `tsc` app+node clean (11
  strict-index errors fixed by P03-A–E); Vite build green (JS 609.56 kB / gzip 158.59 kB —
  seed JSONs now bundled, chunk >500 kB warning noted for P11 route-splitting work; CSS
  41.30 kB / gzip 7.70 kB); token scanner clean; seed check
  13/13; contrast 110/110 unchanged. First verify run flagged a stale DESIGN_TOKENS.md
  (line endings); regenerated with `npm run contrast -- --write`, second run fully green.
- Screenshots/manual checks: not performed (`?sim=` mode matrix left for owner per
  `docs/EVIDENCE_CHECKLIST.md`).
- Unverified: runtime data loading in browser (provider now mounted in dev).

## Phase 04 — App shell (2026-10-03)

- Branch `feat/p04-app-shell`, based on `main` at P03 commit.
- New: `src/app/router.tsx` (full 30-route baseline map, all routes lazy with per-route
  error boundary that resets on navigation, stub pages for P06–P10), `src/app/AuthBoundary.tsx`
  (deep-link return via location state), `src/app/RouteErrorBoundary.tsx`,
  `src/app/AppShell.tsx` (matchMedia desktop subscription, remembered collapse, single
  sidebar instance), `src/layout/` (navigation, Sidebar full/rail/overlay, Header,
  CommandPalette, NotificationsMenu, UserMenu, AppBreadcrumbs, SkipLink, DataStatusBar,
  AuthLayout), `src/components/app/PageHeader.tsx`, `src/features/auth/LoginPage.tsx`
  (same validation/messages/800ms/remember/return behavior as MUI, controlled inputs —
  RHF adoption at P09), `src/features/errors/NotFoundPage.tsx`, `src/features/stubs/StubPage.tsx`.
- No new dependencies (Radix Dialog/Popover/Select + lucide already approved); cmdk not
  installed — palette is a Radix Dialog composition (DEV-05). No shadcn registry
  primitives yet (P05).
- Deltas recorded: DEV-04 (Diagnostix wordmark), DEV-05 (palette-on-mobile, solid panel).
- Commands/results: `npm run verify` passed — ESLint clean (fixed label association and
  two set-state-in-effect cases by moving resets into event handlers); `tsc` clean; Vite
  build with lazy chunks (LoginPage 6.3 kB, NotFound 1.1 kB, Stub 0.5 kB, ThemeCheck 80.7 kB,
  main 575.9 kB); token scanner clean; seed 13/13; contrast 110/110. Dev-server smoke:
  `/`, `/login`, `/dashboard`, `/orders`, `/does-not-exist`, `/dev/theme-check` → 200.
- Screenshots/manual checks: responsive sweep, keyboard walkthrough, sign-in/out and
  palette operation left for owner per `docs/EVIDENCE_CHECKLIST.md`.
- Unverified: browser rendering of shell in both modes; overlay focus behavior.

## Phase 05 — Component kit (2026-10-03)

- Branch `feat/p05-component-kit`, based on `main` at P04 commit.
- Installed approved P05 pins (62 packages added): 8 Radix primitives, `@tanstack/react-table`
  9.2.4, `recharts` 3.10.1, `sonner` 2.0.8, `react-hook-form` 7.89.0, `zod` 4.6.5,
  `@hookform/resolvers` 5.9.1, `react-day-picker` 10.0.2, `date-fns` 4.4.0. `npm install`
  printed 7 high severity advisories (same pattern as P01; follow-up at P12 licensing).
- New `src/components/ui/` (15 owned primitives: button, badge, input, label, textarea,
  select, dialog, alert-dialog, tabs, tooltip, separator, checkbox, switch, dropdown-menu,
  skeleton) + `src/components/app/` (StatusBadge icon+label per domain/status, ConfirmDialog
  on AlertDialog with loading-blocked Esc, FeedbackStates, ToastProvider mounted in
  `main.tsx`, DataTableStates, DataTableCards with details dialog, TanStack DataTable with
  toolbar/pager/visibility menu/row actions/detail list, charts ChartCard/Bar/Donut +
  useSeriesColors, forms Field/FormTextField/FormSelect).
- DataTable keeps domain `sortRows`/`paginateRows`/`clampPage` authoritative and the
  `useTableControls` contract; TanStack owns model/selection/visibility. Deltas: DEV-06
  (v9 legacy layer + RowData boundary casts), DEV-07 (no autoFocus prop).
- Commands/results: `npm run verify` passed — ESLint clean; `tsc` clean (fixed v9 export
  names, RowData constraint, duplicate block); build green (main 608.8 kB, CSS 55.7 kB);
  token scanner clean; seed 13/13; contrast 110/110.
- Manual component inspection left for owner (no tests per plan).
- Unverified: kit rendering in browser both modes; chart theme-switch with Recharts mounted.
