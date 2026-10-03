# AI Usage Log — Diagnostix shadcn port

Phase 0 created a minimum `.gitignore` early so the required `.handoff` file and secrets/license patterns remain outside the commit; P01 will complete it with generated-output/tooling patterns.

Factual record of AI-assisted work. Do not include credentials, tokens, or patient information. Add one entry per task ID and phase.

## Phase 00 — Baselines and plan

### Task record

- P0.1 — Required Kendo docs read first; sibling paths resolved; MUI/Kendo router, dependencies, tokens and feature imports spot-checked.
- P0.2 — Baseline routes/features, framework-neutral copy scope, MUI/Kendo deltas, chart/forms and Kendo review lessons documented.
- P0.3 — Diagnostix brass/graphite direction chosen; hue distances calculated by sRGB-to-HSL conversion.
- P0.4 — Architecture, stack, folder layout, accessibility, performance, risk and owner decisions documented.
- P0.5 — P00–P12 phase branches, estimates, task acceptance and paths documented.
- P0.6 — Compact CLAUDE.md created with authority, rules, conventions and phase routine.
- P0.7 — Kendo GIT_WORKFLOW copied/adapted; dependency proposal and documentation shells created; minimal `.gitignore` added for safe handoff/secret handling.
- P0.8 — Phase evidence and commit handoff recorded; stopped before implementation.

## Phase 01 — Scaffold and tooling

### Task records

- Date: 2026-10-03; tool/model: Codex (desktop agent).
- Owner approved the complete exact dependency matrix, including the OFL-1.1 exception for the two self-hosted font packages.
- P1.1 — Added strict React/Vite SPA scaffold, TS path aliases, Tailwind v4 Vite plugin, shadcn configuration and local class utility. shadcn init CLI options verified; its preset API was unreachable, so `components.json` was written locally using the selected Nova/Radix/Lucide settings.
- P1.2 — Added ESLint TypeScript, React Hooks and jsx-a11y rules; Prettier uses the Tailwind class sorter. Pins preserve the peer compatibility noted in the dependency matrix.
- P1.3 — Added required verification/token scan scripts, completed ignores, updated approval/license records and evidence.
- Dependencies installed: approved P01 runtime and tooling packages. `npm install` printed 7 high severity advisories; subsequent `npm audit` reported 0 vulnerabilities.
- Verification: `npm run verify` passed (ESLint, app and node TypeScript checks, Vite production build, token scanner). A sandboxed first build attempt hit Windows helper-process `EPERM`; rerunning the exact gate with the needed process permission passed. Manual browser review not performed; `shadcn init` preset endpoint was unavailable due `ECONNREFUSED 127.0.0.1:9`.

- Date: 2026-10-03
- Tool/model: Codex (desktop agent)
- Prompt: create documentation-only shadcn/Tailwind port plan with MUI parity and Kendo review; stop at Gate 0.
- Files: pending Phase 0 documentation set; see `docs/EVIDENCE.md`.
- Verification: initial repository check passed on clean `main`; created `docs/p00-baselines-and-plan`; route/package/token and MUI feature references spot-checked. Official shadcn Vite and Tailwind v4 installation docs consulted.
- Limitation: npm registry is cache-only in this environment (`npm view` returned ENOTCACHED); exact package versions, release dates, and weekly downloads remain `[NEEDS VERIFICATION]`. No application code or dependencies changed.
