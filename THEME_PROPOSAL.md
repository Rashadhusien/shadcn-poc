# Theme proposal: Diagnostix — Royal Navy / Opal (owner-directed)

**Direction: Royal Navy + Opal neutrals.** Owner instruction on 2026-10-03 replaces the
prior warm-graphite/brass proposal. Diagnostix is a premium dental enterprise dashboard:
deep Royal Navy actions, clean opal surfaces, dark navy sidebar in both modes, restrained
semantic colors, no neon, no gradients. Status is never color-only.

No complete official logo asset was found in either app's `public/` inventory (only existing
favicons/icons). Use a text wordmark “Diagnostix”; do not redraw or invent an official mark.
If a supplied official mark is surfaced in a later phase, use it as provided.

## Hue separation

Hues use standard HSL conversion from the listed sRGB hex colors; distance is the shorter arc
on the 0–360° circle. The primary choice is `#223C81` (Royal Navy, 223.6°); prior brass
proposal `#80602B` computes to ~37°; Kendo teal `#076F7A` computes to ~186°.

| Pair | Hue 1 | Hue 2 | Shortest hue distance | Requirement |
|---|---|---:|---:|---|
| Royal Navy vs prior brass proposal | 223.6° | 37° | 173.4° | ≥35° — pass |
| Royal Navy vs Kendo teal | 223.6° | 186° | 37.6° | ≥35° — pass |

The primary is restrained (about 58% HSL saturation in light mode) and used in limited action
areas. Success, warning, error, and info have distinct, subdued semantic hues; warning is
muted to stay at or below the 75% saturation ceiling. Cool slate neutrals differ in
temperature from both the retired brass direction and the Kendo teal system.

## Palette intent

Supplied owner values are HSL triplets converted to hex in `src/theme/tokens.json`, with
documented accessibility adjustments (see `docs/DEVIATIONS.md`): boundaries darkened to meet
the 3:1 UI-boundary gate, light focus ring set to `#5A6FB0` so it stays legible on both opal
surfaces and the dark navy sidebar, and warning muted for the saturation ceiling.

| Role | Light | Dark |
|---|---|---|
| Primary | Royal Navy `#223C81`, hover `#1B3169`, tint `#DDE2EE`, white on-color | navy-indigo `#7E96DD`, dark ink on-color `#111522` |
| Background | opal `#F6F7F9` | deep navy-ink `#0E121B` |
| Surface | white `#FFFFFF`; elevated white | layered navy `#141924` and `#191D29` |
| Text | deep navy-ink `#181F2F`, secondary slate `#60697B` | soft slate `#E9ECF1`, secondary `#9AA2B1`; never pure white |
| Borders | slate `#848DA0`; inputs stronger `#767F92` | visible slate `#6B7488` / `#5F6879` / `#848DA0` |
| Focus | `#5A6FB0`, 3px with offset, legible on light and sidebar | light navy-indigo ring on dark surfaces |
| Charts | nine restrained categorical colors; navy trend line | adjusted lightness for contrast; never hue alone |

Font direction: Inter for interface text and JetBrains Mono for order identifiers/numeric
diagnostics (token stacks only; self-hosted packages pending approval — see DEVIATIONS
DEV-03). Radius `0.5rem` (8px). Scale/breakpoints unchanged: body 14/20, secondary 13/18,
caption 12/16, section 16/24, page title 22/28, KPI 24/32; spacing 4/8/12/16/24/32/48;
breakpoints 768/1024/1280/1536; minimum 12px text and 44px touch target.

**Superseded:** the “warm graphite + diagnostic brass” direction and the “Porcelain &
cobalt” runner-up are retired by this owner instruction.

## Token contract

One source (`src/theme/tokens.json`, typed by `src/theme/tokens.ts`) owns values. The
deterministic generator `scripts/build-theme-css.mjs` emits shadcn CSS variables and semantic
utilities. Map semantic names to `--background`, `--foreground`, `--card`, `--popover`,
`--primary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`,
`--chart-1`…`--chart-9`, `--sidebar-*`, plus `--success`, `--warning`, and `--info`. Also
preserve the MUI semantic contract for primary hover/tint/on-color, secondary,
success/warning/error/info, surface/elevated, border/divider/input-border, text
primary/secondary/disabled, hover/selected, table header/hover/selected, status badge pairs
(success/warning/error/info/neutral), trend area and sidebar.

No values are duplicated manually in CSS or components. Type, spacing, breakpoint and touch
scales are comparison constraints listed above. Preserve those even where the old MUI
implementation used a 640px table-card edge; document the comparison delta.

## Verification gates

- Script reads the same token source as the CSS generator. WCAG 2.2 AA: body text 4.5:1;
  large text and UI boundaries 3:1; input boundaries 3:1; status badge pairs 4.5:1;
  categorical chart distinction 3:1; focus ring 3:1 (checked on surfaces and sidebar).
- Theme runs as `light`, `dark`, or `system`, stored at `app-theme`. Prepaint initialization
  prevents flash; system mode subscribes to OS changes. `color-scheme` tracks active mode.
- `.dark` lives on `html`, so shadcn portals, Radix overlays, command palette, calendar, and
  Sonner toasts inherit the same variables.
- Full values and pair-by-pair contrast report belong in `docs/DESIGN_TOKENS.md` in Phase 2.
