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
