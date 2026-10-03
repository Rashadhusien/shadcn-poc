# TASKS.md — Diagnostix shadcn port

## How to use

- One phase = one branch named below = one commit message. Create the next branch only after the user writes `start Phase N`.
- The user commits. Agent does not stage, commit, push or merge.
- MUI behavior is the baseline in `docs/analysis/BASELINES.md`; Kendo lessons inform quality rules only.
- Tick a task when its deliverable exists and the phase's verification gate passes. Phase 0 is docs-only and has no app verification script.
- Every task has MUI source, Kendo lesson, shadcn target, observable acceptance, concrete file paths, and an AI_USAGE_LOG update.
- Phase gate: from P01, `npm run verify` passes; parity rows updated; evidence appended; manual checks listed; commit message saved under `.handoff/`; handoff printed.

## Phase 00: Baselines and plan

Branch: `docs/p00-baselines-and-plan` | Depends on: — | Estimate: 7 h | Status: complete, awaiting user review/commit

Goal: record the MUI comparison contract, Diagnostix direction, dependency proposal, and implementation plan without application code or installs.

- [x] P0.1 Read the four Kendo analysis sources first and spot-check against sibling source. MUI source: `../mui/src/app/router.tsx`, `src/theme/tokens.ts`, `src/features/**`. Kendo lesson: REVIEW_FINDINGS `G1`, `K1–K3`, `I1–I3`. shadcn: docs only. Acceptance: `docs/analysis/BASELINES.md` separates baseline facts, deltas, and lessons. Files: `docs/analysis/BASELINES.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.2 Record routes, per-screen behaviors, reusable layers, kit/shell, form/chart choices, dependency overlap and Kendo comparison table. MUI source: `../mui/src/**`. Kendo lesson: parity and review findings. shadcn: docs only. Acceptance: all baseline routes and proposed Kendo improvements are traceable. Files: `docs/analysis/BASELINES.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.3 Propose unique Diagnostix theme and hue-distance table. MUI source: `../mui/src/theme/tokens.ts`. Kendo lesson: avoid the teal direction. shadcn: CSS-variable mapping. Acceptance: hue distances ≥35° and palette is explicitly proposed. Files: `THEME_PROPOSAL.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.4 Write architecture, folder, quality, accessibility, risks, performance and decision plan. MUI source: baseline docs. Kendo lesson: unused deps, missing lazy routes, theme/overlay coverage. shadcn: stack. Acceptance: all required PLAN sections exist. Files: `PLAN.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.5 Define every phase and task with source, lessons, acceptance and file paths. MUI source: route groups/screens. Kendo lesson: tasks from adapted phase structure. shadcn: all port phases. Acceptance: P00–P12, estimates, branch names and phase log table exist. Files: `TASKS.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.6 Write compact future-session rules. MUI source: parity baseline. Kendo lesson: review rule mapping. shadcn: component/folder/theme workflow. Acceptance: under 200 lines; includes authority, hard rules and phase routine. Files: `CLAUDE.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.7 Adapt Git workflow, propose dependencies, add minimum safety ignore rules, and create documentation shells. MUI source: `../kendo-react-app/GIT_WORKFLOW.md`. Kendo lesson: keep license/env secrets out of history. shadcn: planned dependencies pending approval. Acceptance: workflow rules retained/adapted; metadata gaps flagged; handoff/license/env files ignored; all requested docs exist. Files: `GIT_WORKFLOW.md`, `DEPENDENCIES.md`, `.gitignore`, `AI_USAGE_LOG.md`, `docs/DEVIATIONS.md`, `docs/PARITY_VS_MUI.md`, `docs/COPY_MANIFEST.md`, `docs/EVIDENCE.md`, `docs/EVIDENCE_CHECKLIST.md`, `docs/LICENSING_REVIEW.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P0.8 Record the handoff and stop before implementation. MUI source: —. Kendo lesson: one gate per phase. shadcn: docs only. Acceptance: handoff includes branch, base, verify status, commit, commands, MR info and manual checks. Files: `.handoff/phase-00-commit.txt`.
  - [x] AI_USAGE_LOG.md updated

Phase gate: documentation reviewed; no `npm run verify` is defined until P01; no app code/install. Owner manual review: approve dependency list, answer plan decisions, then start P01 explicitly.

## Phase 01: Scaffold and tooling

Branch: `chore/p01-scaffold-tooling` | Depends on: P00 approval | Estimate: 5 h | Status: done

Goal: create a strict empty SPA, shadcn/Tailwind v4 setup, lint, token-literal check and verify command.

- [x] P1.1 Vite + React + strict TS (`noUncheckedIndexedAccess`) + `@/` alias and feature folders. MUI source: `vite.config.ts`, `tsconfig.app.json`. Kendo lesson: jsx-a11y/ESLint compatibility. shadcn: Vite, Tailwind v4, shadcn CLI. Acceptance: app starts and builds; locally owned component generation is configured. Files: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `components.json`.
  - [x] AI_USAGE_LOG.md updated
- [x] P1.2 ESLint/Prettier including TypeScript, hooks, jsx-a11y and Tailwind class sorter; choose compatible ESLint major. MUI source: `eslint.config.js`, `.prettierrc`. Kendo lesson: record peer conflict if any. shadcn: dev tooling. Acceptance: lint/format scripts work. Files: `eslint.config.js`, `.prettierrc`, `.prettierignore`, `package.json`.
  - [x] AI_USAGE_LOG.md updated
- [x] P1.3 Complete ignore rules and add verify scripts/token-literal scanner. MUI source: `package.json`, `.gitignore`. Kendo lesson: one gate; protect secrets and license/env files. shadcn: `check-tokens.mjs`. Acceptance: verify = lint + tsc + build + token check; `.handoff/`, license/env patterns ignored. Files: `package.json`, `scripts/check-tokens.mjs`, `.gitignore`, `DEPENDENCIES.md`.
  - [x] AI_USAGE_LOG.md updated

Phase gate: verify passes; dependency metadata approved; parity/evidence updated; manual checks: dev server, empty route, verify and ignore patterns.

## Phase 02: Diagnostix theme

Branch: `feat/p02-theme-diagnostix` | Depends on: P01 | Estimate: 8 h | Status: done (verify green; manual browser checks pending owner)

Goal: implement accessible token-driven light/dark/system theme and visible dev review page.

- [x] P2.1 Create typed token source and deterministic shadcn variable mapping. MUI source: `src/theme/tokens.ts` (shape only). Kendo lesson: tokens only, overlay coverage. shadcn: Tailwind v4 CSS variables. Acceptance: no copied color values across files. Files: `src/theme/tokens.ts`, `src/theme/theme.css`, `scripts/build-theme-css.mjs`.
  - [x] AI_USAGE_LOG.md updated
- [x] P2.2 Contrast checker and full token table. MUI source: `docs/DESIGN_TOKENS.md`. Kendo lesson: verify all text, borders, badges, chart colors and focus. shadcn: dependency-free Node script. Acceptance: checks AA pairs and exits non-zero for a planted bad color. Files: `scripts/contrast.mjs`, `docs/DESIGN_TOKENS.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P2.3 Self-host fonts and build ThemeProvider/Switcher. MUI source: `src/app/providers.tsx`, `components/basic/ThemeModeSelect.tsx`. Kendo lesson: prepaint and System subscription. shadcn: html class, local fonts. Acceptance: persists `app-theme`, no flash, reacts to OS; portals inherit. Files: `index.html`, `src/main.tsx`, `src/theme/ThemeProvider.tsx`, `src/theme/ThemeSwitcher.tsx`, `src/theme/fonts.css`.
  - [x] AI_USAGE_LOG.md updated
- [x] P2.4 Theme check page, including portaled controls and charts. MUI source: MUI shared kit. Kendo lesson: dark-mode portal regressions. shadcn: dev route, Radix, Sonner. Acceptance: every planned primitive inspected in both modes. Files: `src/features/dev/ThemeCheckPage.tsx`, `src/app/router.tsx`, `docs/EVIDENCE_CHECKLIST.md`.
  - [x] AI_USAGE_LOG.md updated

Phase gate: verify and contrast pass; manual light/dark/system + OS change + all overlays; parity/evidence updated.

## Phase 03: Domain and data

Branch: `feat/p03-domain-data` | Depends on: P01 | Estimate: 5 h | Status: done (verify green incl. seed check; manual sim checks pending owner)

Goal: reproduce the MUI model and deterministic data behavior from copied sources.

- [x] P3.1 Copy neutral source roots and produce source/destination hash manifest. MUI source: `src/domain/**`, `src/data/**`, `src/lib/download.ts`, named hooks/app utilities. Kendo lesson: distinguish used from installed. shadcn: no UI code. Acceptance: all copies listed and seeds identical. Files: `src/domain/**`, `src/data/**`, `src/lib/download.ts`, `src/hooks/useTableControls.ts`, `src/hooks/useTabParam.ts`, `src/app/{auth,routes,breadcrumbs}.ts`, `docs/COPY_MANIFEST.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P3.2 Add seed identity check and only documented TS compatibility edits. MUI source: copied data and rules. Kendo lesson: review source/destination facts. shadcn: scripts. Acceptance: 13/13 seed hashes match; all patches are isolated and behavior-preserving. Files: `scripts/check-seed.mjs`, copied `src/domain/**`, `src/data/**`, `docs/COPY_MANIFEST.md`.
  - [x] AI_USAGE_LOG.md updated
- [x] P3.3 Restore provider and simulation state. MUI source: `src/data/AppDataProvider.tsx`, reducers/repositories. Kendo lesson: every surface has reachable test states. shadcn: React context. Acceptance: all documented `?sim=` modes match baseline. Files: `src/data/AppDataProvider.tsx`, `src/app/AppProviders.tsx`, `docs/EVIDENCE_CHECKLIST.md`.
  - [x] AI_USAGE_LOG.md updated

Phase gate: verify, seed check and parity; manual normal/loading/empty/error simulation.

## Phase 04: App shell

Branch: `feat/p04-app-shell` | Depends on: P02, P03 | Estimate: 8 h | Status: todo

Goal: implement protected route shell, responsive navigation, shared headers and real global command search.

- [ ] P4.1 Router, auth boundary, lazy route modules, per-route error boundary and Not Found. MUI source: `src/app/router.tsx`, `AuthBoundary.tsx`, `features/errors/*`. Kendo lesson: avoid eager route bundle. shadcn: React Router, ErrorBoundary. Acceptance: baseline route map resolves; signed-out redirect retains destination. Files: `src/app/router.tsx`, `src/app/routes.ts`, `src/app/AuthBoundary.tsx`, `src/app/RouteErrorBoundary.tsx`, `src/features/errors/NotFoundPage.tsx`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P4.2 Sidebar/header/breadcrumbs/PageHeader and responsive modes. MUI source: `src/components/layout/*`. Kendo lesson: one page heading; avoid resize listeners. shadcn: Sidebar, Sheet, Breadcrumb. Acceptance: persistent ≥1024, rail 768–1023, drawer <768. Files: `src/layout/*`, `src/components/app/PageHeader.tsx`, `src/app/AppShell.tsx`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P4.3 Login, user/notification menu, theme switch, command palette. MUI source: `features/auth/LoginPage.tsx`, `GlobalSearch.tsx`, header menus. Kendo lesson: single icon set; keyboard operation. shadcn: Command/cmdk, Dialog, lucide. Acceptance: Cmd/Ctrl+K opens; route navigation and order results work; Esc restores focus. Files: `src/features/auth/*`, `src/layout/Header.tsx`, `src/layout/CommandPalette.tsx`, `src/layout/UserMenu.tsx`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify and shell route smoke; manual 360/768/1024/1536 + keyboard/sidebar + sign-in/out.

## Phase 05: Component kit

Branch: `feat/p05-component-kit` | Depends on: P02, P04 | Estimate: 12 h | Status: todo

Goal: establish tested-by-inspection reusable product compositions without page-specific duplicates.

- [ ] P5.1 Add shadcn registry primitives used by the app; add icon, status and confirmation compositions. MUI source: `components/basic`, `components/composite`. Kendo lesson: no mixed icons; confirm destructive actions. shadcn: Button, Badge, Input, Select, Dialog, AlertDialog, Tabs, Tooltip. Acceptance: focus/keyboard/theme documented. Files: `src/components/ui/**`, `src/components/app/StatusBadge.tsx`, `src/components/app/ConfirmDialog.tsx`, `docs/PARITY_VS_MUI.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P5.2 Build DataTable and feedback patterns. MUI source: `components/data-display/*`, `components/feedback/*`. Kendo lesson: mobile fallback, all data states, no untracked resize. shadcn: TanStack Table, Skeleton, Sonner. Acceptance: sort/page/select/visibility, card fallback below 768, loading/empty/error+Retry. Files: `src/components/app/DataTable.tsx`, `DataTableCards.tsx`, `DataTableStates.tsx`, `FeedbackStates.tsx`, `ToastProvider.tsx`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P5.3 Build chart wrapper and form primitives. MUI source: `components/charts/*`, validation forms. Kendo lesson: charts must follow tokens; avoid unused deps. shadcn: Recharts, RHF/Zod. Acceptance: theme-change colors, accessible table alternative and MUI message parity. Files: `src/components/app/charts/*`, `src/components/app/forms/*`, `docs/DEVIATIONS.md`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; component pages in both themes; manually inspect focus, portal, table card, chart and toast.

## Phase 06: Orders list

Branch: `feat/p06-orders-list` | Depends on: P05 | Estimate: 10 h | Status: todo

Goal: reproduce order list behavior and responsive priority from MUI.

- [ ] P6.1 Header, URL search/filter/sort/page and columns. MUI source: `features/orders/list/OrdersPage.tsx`, `orderColumns.tsx`, `domain/rules/table.ts`, `useTableControls.ts`. Kendo lesson: custom grids can have hidden feature pitfalls. shadcn: DataTable, URL hook. Acceptance: exact fields, filters and query behavior. Files: `src/features/orders/list/*`, `docs/PARITY_VS_MUI.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P6.2 Selection, row menu/expansion, archive/delete confirmation, CSV, refresh and create link. MUI source: orders list actions. Kendo lesson: every destructive action confirmed. shadcn: DropdownMenu, AlertDialog, download. Acceptance: same resulting state and copy. Files: `src/features/orders/list/*`, `docs/EVIDENCE_CHECKLIST.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P6.3 Loading, error+Retry, both empty states, mobile cards. MUI source: OrdersPage states. Kendo lesson: usable mobile table and per-state feedback. shadcn: DataTable states. Acceptance: state simulations work at 360–1536. Files: `src/features/orders/list/*`, `docs/DEVIATIONS.md`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; parity/evidence; manual query refresh/back, filter draft cancellation, bulk actions and 360/768/1024/1536.

## Phase 07: Dashboard

Branch: `feat/p07-dashboard` | Depends on: P06 | Estimate: 5 h | Status: todo

Goal: reproduce dashboard metrics, charts and recent activity.

- [ ] P7.1 Seven KPIs, links and per-card states. MUI source: `features/dashboard/DashboardPage.tsx`. Kendo lesson: do not hide errors/loading counts. shadcn: Card, Skeleton. Acceptance: same metric values/captions and independent states. Files: `src/features/dashboard/DashboardPage.tsx`, `KpiCard.tsx`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P7.2 Alert, order volume and workflow charts, table alternatives. MUI source: dashboard charts. Kendo lesson: theme/chart contrast and mounted theme changes. shadcn: chart wrapper/Recharts. Acceptance: series and labels match baseline. Files: `src/features/dashboard/*`, `src/components/app/charts/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P7.3 Recent orders (7) and activity (6). MUI source: dashboard sections. Kendo lesson: shared DataTable and navigation. shadcn: DataTable, notification list. Acceptance: same rows/actions. Files: `src/features/dashboard/*`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; manual theme switch with charts mounted and dashboard simulations.

## Phase 08: Order details and workflow

Branch: `feat/p08-order-details` | Depends on: P07 | Estimate: 12 h | Status: todo

Goal: implement view, lifecycle, files and sub-order routes.

- [ ] P8.1 Order detail, export, progress, services, related entities, notes and delete confirmation. MUI source: `features/orders/view/*`. Kendo lesson: future steps must not look erroneous. shadcn: Card, Stepper composition, AlertDialog. Acceptance: all fields/actions match. Files: `src/features/orders/view/*`, `src/features/orders/shared/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P8.2 Workflow progression, current/next step and cancelled state. MUI source: `features/orders/workflow/*`. Kendo lesson: `G1` incomplete stages neutral. shadcn: Stepper, Alert. Acceptance: only actual invalid state displays error. Files: `src/features/orders/workflow/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P8.3 Files upload/validation/list/preview/download/delete and sub-order tabs/teeth chart. MUI source: `features/orders/files/*`, `sub-order/*`, domain file rules. Kendo lesson: native input/popup styling; keep validation texts. shadcn: Dropzone composition, Tabs, Dialog. Acceptance: same rejection behavior, simulation and tab query. Files: `src/features/orders/files/*`, `src/features/orders/sub-order/*`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; manual upload limits/errors, delete confirm, workflow transitions and sub-order tabs.

## Phase 09: Create and edit order

Branch: `feat/p09-create-order` | Depends on: P08 | Estimate: 12 h | Status: todo

Goal: reproduce create wizard and edit form with unchanged rules/messages.

- [ ] P9.1 Wizard shell, seven-step gating, back/cancel/continue/create and phone progress. MUI source: `features/orders/create/OrderCreatePage.tsx`, `useOrderWizard.ts`. Kendo lesson: future-step error coloring. shadcn: RHF, Progress. Acceptance: same transitions and blocked-step behavior. Files: `src/features/orders/create/OrderCreatePage.tsx`, `useOrderWizard.ts`, `WizardProgress.tsx`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P9.2 Seven step forms, patient prefill, review and domain planner. MUI source: `features/orders/create/*`, `domain/rules/order-creation.ts`. Kendo lesson: native popups and validation. shadcn: Form, Select, Calendar, teeth chart. Acceptance: same plan/output for equivalent inputs. Files: `src/features/orders/create/steps/*`, `src/domain/rules/order-creation.ts` (copy manifest rules).
  - [ ] AI_USAGE_LOG.md updated
- [ ] P9.3 Edit form and error summary. MUI source: `features/orders/edit/*`, `domain/rules/order-edit.ts`. Kendo lesson: use installed form system intentionally. shadcn: RHF/Zod. Acceptance: exact validation messages and save outcome. Files: `src/features/orders/edit/*`, `src/domain/rules/order-edit.ts`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; manual each step, validation messages, patient prefill, cancellation and edit save.

## Phase 10: Remaining screens

Branch: `feat/p10-remaining-screens` | Depends on: P09 | Estimate: 20 h | Status: todo

Goal: complete every non-order MUI screen and URL-only showcases.

- [ ] P10.1 Cases/table-grid/detail tabs, workflow board and scan center. MUI source: `features/cases/*`, `workflow-board/*`, `scan-center/*`. Kendo lesson: keyboard board action, no drag-only path. shadcn: DataTable, Tabs, dnd-kit only if approved. Acceptance: baseline statuses, filters and responsive behavior; keyboard move works. Files: `src/features/cases/*`, `src/features/workflow-board/*`, `src/features/scan-center/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P10.2 Patient, doctor, clinic lists/add dialogs/details/related tables. MUI source: `features/patients/*`, `doctors/*`, `clinics/*`, `directory/*`. Kendo lesson: shared table behavior and confirmations. shadcn: DataTable, Dialog, Tabs. Acceptance: same tabs/counts/relations. Files: `src/features/{patients,doctors,clinics,directory}/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P10.3 Documents, billing, change requests. MUI source: corresponding feature folders. Kendo lesson: upload dependency and destructive confirms. shadcn: DataTable, AlertDialog, CSV helper. Acceptance: validation, approvals, exports, states match. Files: `src/features/{documents,billing,change-requests}/*`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P10.4 Reports hub and four report routes. MUI source: `features/reports/*`, `domain/rules/reporting.ts`. Kendo lesson: charts follow tokens, month columns reflow. shadcn: Recharts, Calendar, DataTable. Acceptance: KPIs, filters, charts, tables and pagination match. Files: `src/features/reports/*`, `src/domain/rules/reporting.ts`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P10.5 Notifications, six settings sections, /forms and /grid. MUI source: corresponding feature folders. Kendo lesson: avoid unused controls; respect URL tabs. shadcn: Tabs, Switch, forms. Acceptance: same settings drafts, notifications, showcase routes. Files: `src/features/{notifications,settings,showcase}/*`, `src/app/router.tsx`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; parity/evidence; manual every route, URL tab state, approvals, notifications, settings, responsive sweep.

## Phase 11: QA and polish

Branch: `fix/p11-qa-polish` | Depends on: P10 | Estimate: 10 h | Status: todo

Goal: close manual QA gaps, improve responsive/accessibility states, and remove/hide dev pages.

- [ ] P11.1 Sweep all routes from 360 to 1536 in light/dark/system and keyboard; resolve material issues. MUI source: all feature routes. Kendo lesson: board exception documented, no hidden mobile overflow. shadcn: responsive shell/table/overlays. Acceptance: no horizontal page scroll and evidence per checklist. Files: `src/features/**`, `src/layout/**`, `docs/EVIDENCE_CHECKLIST.md`, `docs/DEVIATIONS.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P11.2 Accessibility, reduced-motion, focus, labels, status semantics and destructive actions. MUI source: shared component requirements. Kendo lesson: manual paths and state mapping. shadcn: Radix, ARIA. Acceptance: every core flow keyboard-operable; findings recorded. Files: `src/components/**`, `src/features/**`, `docs/EVIDENCE_CHECKLIST.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P11.3 Review bundle sizes, route splitting, token literals, remove/hide /dev pages. MUI source: routes/build. Kendo lesson: >500 kB chunks and late split. shadcn: Vite build. Acceptance: verify passes; chunk sizes recorded; no dev nav in production. Files: `vite.config.ts`, `src/app/router.tsx`, `src/features/dev/**`, `docs/EVIDENCE.md`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify; complete manual checklist or list unverified gaps; parity/evidence updated.

## Phase 12: Evidence and docs

Branch: `docs/p12-evidence-and-docs` | Depends on: P11 | Estimate: 5 h | Status: todo

Goal: publish accurate final port evidence, parity status and maintenance/licensing record.

- [ ] P12.1 Finalize evidence, deviations, parity, and dependency license/maintenance review. MUI source: all baseline routes/components. Kendo lesson: match claims to imports and evidence. shadcn: documentation. Acceptance: no unsupported `verified` status; dependency review complete. Files: `docs/EVIDENCE.md`, `docs/DEVIATIONS.md`, `docs/PARITY_VS_MUI.md`, `docs/LICENSING_REVIEW.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P12.2 README with setup, route list, theme and comparison notes; screenshot list for owner. MUI source: baseline README and parity. Kendo lesson: pending screenshots/manual checks surfaced. shadcn: README. Acceptance: clean install/run/verify instructions and screenshots requested listed. Files: `README.md`, `docs/EVIDENCE_CHECKLIST.md`, `TASKS.md`.
  - [ ] AI_USAGE_LOG.md updated
- [ ] P12.3 Final verify, bundle capture and handoff. MUI source: parity matrix. Kendo lesson: phase gate. shadcn: release documentation. Acceptance: verify green and no unresolved unreported deviations. Files: `docs/EVIDENCE.md`, `docs/PARITY_VS_MUI.md`, `.handoff/phase-12-commit.txt`.
  - [ ] AI_USAGE_LOG.md updated

Phase gate: verify passes; final docs accurate; screenshots/manual checks for owner; handoff printed.

## Phase log

| Phase | Branch | Commit header | MR link (owner) | Merged (owner) |
|---|---|---|---|---|
| P00 | `docs/p00-baselines-and-plan` | `docs(plan): record Diagnostix baseline and phase plan` | — | — |
| P01 | `chore/p01-scaffold-tooling` | — | — | — |
| P02 | `feat/p02-theme-diagnostix` | — | — | — |
| P03 | `feat/p03-domain-data` | — | — | — |
| P04 | `feat/p04-app-shell` | — | — | — |
| P05 | `feat/p05-component-kit` | — | — | — |
| P06 | `feat/p06-orders-list` | — | — | — |
| P07 | `feat/p07-dashboard` | — | — | — |
| P08 | `feat/p08-order-details` | — | — | — |
| P09 | `feat/p09-create-order` | — | — | — |
| P10 | `feat/p10-remaining-screens` | — | — | — |
| P11 | `fix/p11-qa-polish` | — | — | — |
| P12 | `docs/p12-evidence-and-docs` | — | — | — |
