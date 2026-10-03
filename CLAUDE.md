# CLAUDE.md — Diagnostix shadcn port

## Mission and authority

Build the third dental-diagnostics UI port in this folder. Follow user instructions first; then this file's hard rules; then `docs/analysis/BASELINES.md` for MUI behavior; then the Kendo port as a review/lesson source; then Angular background only for domain context. MUI is the behavior authority unless the owner explicitly approves a documented improvement. Read `PLAN.md`, `TASKS.md`, and phase evidence before implementation.

## Hard rules

- Never use secrets, credentials, or real patient/customer data. Fixtures and simulations only.
- No installs or app code during Phase 0. Do not start a phase until the user says `start Phase N`.
- Git rules are in `GIT_WORKFLOW.md`. One phase branch and one commit message; only the user stages, commits, pushes, and merges. Do not run add, commit, push, pull, fetch, merge, rebase, reset, restore, checkout, stash, tag, clean, config, or force options.
- Dependency review/approval rules are in `DEPENDENCIES.md`. No second UI kit. No unapproved dependency additions.
- Never mechanically translate MUI JSX. Copy the listed framework-neutral domain/data sources only; hash and disclose all copies and patches.
- No real logo redraw, remote fonts, or remote images. Use text wordmark unless supplied official art is found.

## Stack and theme

React + Vite + strict TypeScript (`noUncheckedIndexedAccess`), `react-router-dom`, Tailwind CSS v4, shadcn/ui. `src/components/ui` contains locally owned registry components; app compositions live in `src/components/app` or feature folders. Use `@/` imports.

Diagnostix warm graphite + diagnostic brass direction is specified in `THEME_PROPOSAL.md`. `src/theme/tokens.ts` is the only color-value source; derive shadcn CSS variables from it. No color literals in `src/features` or `src/components`. Avoid both existing hue families. Minimum body text 12px, touch targets 44px, breakpoints 768 / 1024 / 1280 / 1536. Scale: body 14/20, secondary 13/18, caption 12/16, section 16/24, page title 22/28, KPI 24/32; spacing 4/8/12/16/24/32/48.

Dark mode uses `.dark` on `html`, supports Light / Dark / System, persists as `app-theme`, has prepaint initialization and correct `color-scheme`, and follows OS changes in System mode. All portals (dialogs, popovers, selects, command palette, calendar, toasts) must use the same variables. Design dark values directly: no pure black or white surfaces and no pure white body text.

## Build rules

- Professional product bar: strict types; no `any`, dead code or console logs; feature-based folders; small components; lazy routes; route error boundaries; semantic landmarks; visible focus; keyboard operation for every flow; labels/aria for controls; reduced motion; loading skeletons; empty/error+Retry on every data surface; ConfirmDialog for destructive actions.
- Status always combines icon and label. One icon family (lucide-react), 16/20/24 size scale. One PageHeader pattern. One shared DataTable; card fallback below 768 with no clipped desktop table. No horizontal page scroll 360–1536.
- Charts consume theme tokens, retain accessible labels/data summaries and table alternatives. Test chart colors after changing theme.
- Use CSS breakpoints/container layout, not ad hoc `innerWidth` loops. Keyboard “Move to…” must operate the board without drag. Pointer dragging is an enhancement.
- Prefer shadcn registry component before custom primitive. `components/ui` code is ours to edit. Keep domain rules independent from UI.
- `npm run verify` from P01: ESLint, `tsc --noEmit`, Vite production build, token-literal scanner. Manual accessibility/responsive checks are recorded; do not add tests or Storybook unless owner approves.

## Files and naming

Feature code belongs in `src/features/<feature>/`. Shared generated primitives: `src/components/ui/<name>.tsx`; product compositions: `src/components/app/<PascalCase>.tsx`. Domain/data modules never import UI. Use PascalCase React components, camelCase functions, named exports, typed props, and no barrel files that create cycles. Keep route-specific error boundaries and loading/error/empty state components near features or the app kit.

## Phase routine

1. Confirm current branch and phase matches `TASKS.md`. Work only on the active user-started phase.
2. Complete only its checkboxes. Add a concise, factual per-task entry to `AI_USAGE_LOG.md`.
3. Update `docs/PARITY_VS_MUI.md`, `docs/DEVIATIONS.md`, `docs/COPY_MANIFEST.md`, and evidence as applicable.
4. At phase end, check the gate in `TASKS.md`. From P01, run `npm run verify`; record output, bundle sizes, manual checks, limitations, and exact commit message. Save `.handoff/phase-NN-commit.txt` and print the required handoff block. Stop for the user's commit and next phase instruction.
5. Append factual notes to `docs/EVIDENCE.md` at every phase end: changed files, approximate lines, custom components, libraries and their reason, config steps, workarounds, pain points, commands/results. Do not claim a manual check not performed.

## Evidence and communication

Keep reports short, concrete, and free of marketing language. Mark every unverified fact `[NEEDS VERIFICATION]`. Record screens/viewports/theme/input and observed result in `docs/EVIDENCE_CHECKLIST.md`; leave user-only checks unchecked. Preserve failure output and source snapshots rather than hiding gaps. Update `AI_USAGE_LOG.md` with task id, prompt summary, tool/model, files, verification, and any limitation. No token, environment secret, or patient fixture is copied into logs.
