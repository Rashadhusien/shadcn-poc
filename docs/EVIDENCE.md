# Evidence log

Append a dated phase entry with facts only: files and approximate LOC changed; custom components; dependency additions and reason; configuration steps; commands and output; screenshots/manual checks; workarounds; pain points; unverified items. Never claim a check that was not performed.

## Phase 00 — 2026-10-03

- Minimal `.gitignore` introduced in P00 to keep the required `.handoff` artifact and secret/license files out of the commit; P01 will complete it with tooling-specific ignores.

- Documentation authored: BASELINES, THEME_PROPOSAL, PLAN, TASKS, CLAUDE, GIT_WORKFLOW, DEPENDENCIES, parity/copy/deviation/evidence/licensing shells, AI usage log.
- Repository preflight: clean `main` with HEAD `14822bc1376e4aed689c98b7d6a6fb283fb07a20`; branch created as requested.
- Reused: Kendo MUI baseline/parity/review/tasks; spot-checked routers, package dependency names, source feature imports. MUI source count 189 files; Kendo 239 files. Node v22.20.0, npm 11.6.1.
- Official setup references: shadcn Vite install and CLI docs; Tailwind Vite installation docs. `npm view` failed with `ENOTCACHED`; dependency release dates/download counts unavailable.
- Application code changed: none. Dependencies installed: none. Automated tests: none run.
