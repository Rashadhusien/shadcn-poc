# Theme proposal: Diagnostix

**Direction: Warm graphite + diagnostic brass.** Diagnostix is a calm, precise workspace for clinicians and dental-lab staff reviewing cases throughout a long shift. A restrained brass action color takes a cue from the 3D Diagnostix muted-gold brand hint; warm mineral neutrals, ink-blue text, and flat outlined surfaces make the product feel distinct from both existing cool-blue/teal ports. It is not a radiology viewer and will not imitate the MUI port's blue identity.

No complete official logo asset was found in either app's `public/` inventory (only existing favicons/icons). Use a text wordmark “Diagnostix”; do not redraw or invent an official mark. If a supplied official mark is surfaced in a later phase, use it as provided.

## Hue separation

Hues use standard HSL conversion from the listed sRGB hex colors; distance is the shorter arc on the 0–360° circle. The primary choice is `#80602B` (muted brass, 37.4°); MUI primary `#0F5FA8` computes to 208.6°; Kendo primary `#076F7A` computes to 185.7°.

| Pair | Hue 1 | Hue 2 | Shortest hue distance | Requirement |
|---|---:|---:|---:|---|
| Diagnostix brass vs MUI primary | 37.4° | 208.6° | 171.2° | ≥35° — pass |
| Diagnostix brass vs Kendo primary | 37.4° | 185.7° | 148.3° | ≥35° — pass |

The primary is deliberately muted (about 49% HSL saturation) and used in limited action areas. Success, warning, error, and info have distinct, subdued semantic hues; no neon fills. Warm parchment/stone neutrals differ in temperature from both existing cool blue-tinted and blue-green neutral systems.

## Palette intent

These are direction-setting examples, not the final token table. Phase 2 must encode every light/dark value in a single typed token source and prove WCAG contrast with the dependency-free script before sign-off.

| Role | Light intent | Dark intent |
|---|---|---|
| Primary | muted brass `#80602B`, deeper hover, pale brass tint, dark ink on-color | pale brass action on graphite surfaces, dark ink on-color |
| Background | warm limestone / paper `#F6F4EF` | warm charcoal `#171918` |
| Surface | soft ivory `#FCFBF8`; elevated surface only slightly lighter | layered graphite `#202321` and `#282B28` |
| Text | deep warm charcoal `#262923`, secondary mineral gray | soft warm gray `#E7E5DC`, secondary `#B7B5AA`; never pure white |
| Borders | warm stone `#D9D5CB`; inputs use stronger boundary color | quiet but visible warm-gray boundary |
| Focus | accessible brass/ink ring, 2px with offset | light brass ring against dark surfaces |
| Charts | nine balanced categorical colors; brass trend line and translucent area | adjusted lightness for contrast; never rely on hue alone |

The examples may change after the contrast script is run; visual preference never overrides the contrast thresholds. Dark surfaces are intentionally layered, never pure black; text is never pure white. Keep cards flat, use subtle borders and minimal shadows, compact-but-generous typography, and the same scale/breakpoints as the baseline. Font proposal: self-hosted DM Sans for interface text and IBM Plex Mono for order identifiers/numeric diagnostics; no remote font requests.

**Runner-up:** “Porcelain & cobalt” would emphasize imaging precision with pale stone surfaces and a subdued deep cobalt action. It is rejected because MUI already occupies the cool blue diagnostic direction, while the muted brass cue has stronger product ownership and more clearly distinguishes this port in side-by-side comparison.

## Token contract

One source (`src/theme/tokens.ts`) owns values. A generator or deterministic mapping emits shadcn CSS variables and semantic utilities. Map semantic names to `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1`…`--chart-9`, `--sidebar-*`, plus `--success`, `--warning`, and `--info`. Also preserve the MUI semantic contract for primary hover/tint/on-color, secondary, success/warning/error/info, surface/elevated, border/divider/input-border, text primary/secondary/disabled, hover/selected, table header/hover/selected, status badge pairs (success/warning/error/info/neutral), trend area and sidebar.

No values are duplicated manually in CSS or components. Type, spacing, breakpoint and touch scales are comparison constraints: body 14/20, secondary 13/18, caption/table header 12/16, section 16/24, page title 22/28, KPI 24/32; spacing 4/8/12/16/24/32/48; breakpoints 768/1024/1280/1536; minimum 12px text and 44px touch target. Preserve those even where the old MUI implementation used a 640px table-card edge; document the comparison delta.

## Verification gates

- Script reads the same token source as the CSS generator. WCAG 2.2 AA: body text 4.5:1; large text and UI boundaries 3:1; input boundaries 3:1; status badge pairs 4.5:1; categorical chart distinction 3:1; focus ring 3:1. If OKLCH is emitted, script must convert it first.
- Theme runs as `light`, `dark`, or `system`, stored at `app-theme`. Prepaint initialization prevents flash; system mode subscribes to OS changes. `color-scheme` tracks active mode.
- `.dark` lives on `html`, so shadcn portals, Radix overlays, command palette, calendar, and Sonner toasts inherit the same variables.
- Full values and pair-by-pair contrast report belong in `docs/DESIGN_TOKENS.md` in Phase 2.
