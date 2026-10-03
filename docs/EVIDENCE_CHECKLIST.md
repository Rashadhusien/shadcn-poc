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

## Future phases

- [ ] P01: start the Vite app, inspect the Diagnostix placeholder at 360, 768, 1024 and 1536 px; confirm no page overflow and verify `.handoff/`, `.env*`, and license files are ignored.

| Phase / screen | Viewports | Themes | Keyboard / screen reader | Simulation / state | Evidence |
|---|---|---|---|---|---|
| P01–P12 | 360, 768, 1024, 1280, 1536 | Light, dark, system | Record per flow | Loading/error/empty/normal | Pending |
