# Manual evidence checklist

Record build/hash, viewport, theme, keyboard/mouse path, expected behavior, observed result, and screenshot path. A checkbox is complete only with evidence. User-only checks remain unchecked.

## Phase 00

- [x] Clean Git preflight and requested branch established.
- [x] MUI and Kendo route/package/source spot-checks recorded.
- [x] Theme hue distance computed and documented.
- [x] Owner accepted the dependency matrix, including the OFL-1.1 font exception (2026-10-03).
- [x] npm versions, package licenses, latest publication dates, and weekly download counts recorded in DEPENDENCIES.md.
- [x] Owner resolved the OFL-1.1 @fontsource license exception and approved the exact dependency set.
- [ ] Owner resolves the open parity decisions in PLAN.md.

## Phase 02

- [x] Token source, generated CSS and contrast report updated to Royal Navy / Opal (static gates pass).
- [ ] Owner manually reviews `/dev/theme-check` in light/dark/system + OS change, opens every overlay (dialog, popover, select, toast), and sweeps 360/768/1024/1536 with no page overflow.

## Phase 03

- [x] Seed identity: `npm run check:seed` reports 13/13 files identical to `../mui/src/data/seed`.
- [ ] Owner manually loads `/dev/theme-check` with `?sim=loading` (collections never resolve), `?sim=error` (all collections fail with Retry), `?sim=empty` (all collections empty), and `?sim=error&simTarget=orders` (only orders fail); reload restores normal state.

## Phase 04

- [x] Dev-server route smoke: `/`, `/login`, `/dashboard`, `/orders`, `/does-not-exist`, `/dev/theme-check` all serve 200 (SPA fallback).
- [x] Production build emits lazy route chunks: LoginPage, ThemeCheckPage, NotFoundPage, StubPage split from the main bundle.
- [ ] Owner verifies at 360/768/1024/1536: drawer / rail / full sidebar, overlay focus trap + Esc, Cmd/Ctrl+K palette with order lookup, sign-in/out with deep-link return, keyboard-only sidebar + menus.

## Future phases

## Future phases

- [ ] P01: start the Vite app, inspect the Diagnostix placeholder at 360, 768, 1024 and 1536 px; confirm no page overflow and verify `.handoff/`, `.env*`, and license files are ignored.

| Phase / screen | Viewports | Themes | Keyboard / screen reader | Simulation / state | Evidence |
|---|---|---|---|---|---|
| P01–P12 | 360, 768, 1024, 1280, 1536 | Light, dark, system | Record per flow | Loading/error/empty/normal | Pending |
