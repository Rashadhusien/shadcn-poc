# Baselines and porting decisions

Snapshot date: 2026-10-03. The MUI port is the behavior authority. Kendo is a later independent port and a source of review lessons, not a replacement specification. Detailed MUI screen inventory is reused from `../kendo-react-app/docs/analysis/MUI_BASELINE.md`; comparison and review findings from `../kendo-react-app/docs/PARITY_VS_MUI.md` and `REVIEW_FINDINGS.md` were consulted first. Router, package names, token sources, and representative feature code were spot-checked with `rg`.

## MUI product surface

There are 30 routed pages plus the root redirect and wildcard route. Authentication is a mock sign-in; the app shell and data provider guard all routes except login. The domain models orders, sub-orders, patients, doctors, clinics, cases, documents, billing, change requests, scan centers, notifications, settings, reports, and workflow stages. Seed fixtures contain 13 JSON files. The data layer supports deterministic delayed/error/empty states through `?sim=`. URLs hold table search/filter/page/sort state and selected tabs where specified.

Exact router paths (the route count in the prior analysis counts page screens and treats the root redirect/wildcard separately): `/login`, `/`, `/dashboard`, `/orders`, `/orders/create`, `/orders/:id`, `/orders/:id/edit`, `/orders/:id/workflow`, `/orders/:id/files`, `/orders/:id/sub-orders/:subOrderId`, `/cases`, `/cases/:caseId`, `/workflow-board`, `/scan-center`, `/patients`, `/patients/:patientId`, `/doctors`, `/doctors/:doctorId`, `/clinics`, `/clinics/:clinicId`, `/documents`, `/billing`, `/change-requests`, `/reports`, `/reports/orders-range`, `/reports/quarterly-targets`, `/reports/quarterly-targets/:year/:quarter`, `/reports/team-performance`, `/notifications`, `/settings`, `/forms`, `/grid`, and `*`.

### Source counts, package names, and token structures

`rg --files` counts at Phase 0 (including nested files; each repo also has one root `src/main.tsx`):

| `src/` folder | MUI files | Kendo files |
|---|---:|---:|
| app | 7 | 7 |
| assets | 0 | — |
| components | 71 | 68 |
| data | 18 | 18 |
| domain | 19 | 19 |
| features | 58 | 97 |
| hooks | 2 | 2 |
| layout | — | 14 |
| lib | 1 | 4 |
| theme | 12 | 9 |
| **Total incl. root file** | **189** | **239** |

Runtime package names, split by role (versions are deliberately omitted here):

- **MUI UI / visual:** `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@mui/x-charts`, `@mui/x-date-pickers`, `react-odontogram`; fonts: `@fontsource/inter`, `@fontsource/jetbrains-mono`, `@fontsource/outfit`.
- **MUI app/runtime:** `react`, `react-dom`, `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, `dayjs`.
- **Kendo UI / visual:** `@progress/kendo-data-query`, `@progress/kendo-drawing`, `@progress/kendo-licensing`, `@progress/kendo-react-animation`, `@progress/kendo-react-buttons`, `@progress/kendo-react-charts`, `@progress/kendo-react-common`, `@progress/kendo-react-data-tools`, `@progress/kendo-react-dateinputs`, `@progress/kendo-react-dialogs`, `@progress/kendo-react-dropdowns`, `@progress/kendo-react-form`, `@progress/kendo-react-grid`, `@progress/kendo-react-indicators`, `@progress/kendo-react-inputs`, `@progress/kendo-react-intl`, `@progress/kendo-react-labels`, `@progress/kendo-react-layout`, `@progress/kendo-react-notification`, `@progress/kendo-react-popup`, `@progress/kendo-react-progressbars`, `@progress/kendo-react-taskboard`, `@progress/kendo-react-tooltip`, `@progress/kendo-react-upload`, `@progress/kendo-svg-icons`, `@progress/kendo-theme-default`, `lucide-react`, `react-odontogram`.
- **Kendo app/runtime:** `react`, `react-dom`, `react-router-dom`; fonts: `@fontsource/inter`, `@fontsource/jetbrains-mono`.
- Both use Vite/TypeScript and similar ESLint/Prettier toolchains; MUI also has React Compiler Babel/Rolldown tooling. Runtime package inventories were printed from the two `package.json` files during orientation; UI kit packages are not reusable in this port.

Token source structures share the semantic contract (colors, typography, spacing/layout, radius/shadow, breakpoints, focus/touch, table, charts, status badges). MUI's current `src/theme/tokens.ts` uses radiology blue `#0F5FA8` / dark `#6FB2F2`, cool blue-gray backgrounds `#F4F7FB` / `#0A0F17`, and includes primary hover/tint, semantic colors, backgrounds/surfaces/overlays/subtle surfaces, border/divider/input border, action overlays, text, typography, layout, chart series/categorical/stage/trend, badges, and focus/touch. Kendo's current file uses teal `#076F7A` / dark `#69CBD0`, cool green-gray backgrounds `#F2F8F8` / `#101C20`, and the same core keys plus explicit on-primary, scrim and z-index tokens. Both use the same type/spacing/breakpoint families, with app-specific values for surfaces and shadows.

**Snapshot discrepancy:** Kendo's latest visible `AI_USAGE_LOG.md` entry says the theme was changed to radiology blue, but the inspected current `src/theme/tokens.ts` still contains the teal palette. Treat checked-in token source as the implementation fact for this analysis; keep Diagnostix far from both hue families. Recheck if Kendo is rethemed before a future visual comparison.

| Screen group | Routes and principal behavior |
|---|---|
| Auth and home | `/login`; `/` redirects to `/dashboard`. Login validates fields, simulates sign-in, and returns to the requested route. |
| Dashboard | 7 KPI links, change-request alert, order-volume and workflow charts, 7 recent orders, 6 activity entries; independent loading/error/empty states. |
| Orders | `/orders` search, filters, sorting, paging, column visibility, row expansion, selection, bulk archive/delete, CSV export, refresh, and create action. `/orders/create` is a seven-step wizard with patient prefill. `/orders/:id`, `/edit`, `/workflow`, `/files`, and `/sub-orders/:subOrderId` cover details, edit, lifecycle, file upload/preview/download/delete, and four sub-order tabs. |
| Cases and workflow | `/cases` table/grid toggle; `/cases/:caseId` five tabs; `/workflow-board` search, status lanes, order actions, and phone lane tabs; `/scan-center` KPI cards, centers, and orders. |
| Directories | Patient/doctor/clinic lists with add dialogs and detail routes with overview and related-record tabs. |
| Operations | `/documents` upload/filter/preview/delete; `/billing` KPIs/table/CSV; `/change-requests` approve/reject; `/notifications` tabs, filters, and read actions; `/settings` six editable sections. |
| Reports and showcases | Reports hub; order date-range, quarterly target, quarter detail, and team-performance reports. `/forms` and `/grid` are unlinked showcases. `*` renders Not Found. |

Shared conventions: `PageHeader`; semantic status badge with icon and text; loading, empty, and error/retry states on data surfaces; confirmation for destructive actions; responsive table-to-card behavior; table search is case-insensitive contains, sort is single-column asc/desc, and changing a filter/search resets the page. Orders have a tailored filter draft with Apply/Cancel/Clear. Wizard validation and domain rules live under `src/domain/rules/`.

### Reusable non-UI layers

Copy from MUI byte-for-byte except import aliases, then record source SHA-256 values in `docs/COPY_MANIFEST.md`: `src/domain/**`; `src/data/**` including seed JSON, reducers, selectors, repositories, and simulation; `src/lib/download.ts`; `src/hooks/useTableControls.ts` and `useTabParam.ts`; `src/app/auth.ts`, `routes.ts`, and `breadcrumbs.ts`. These modules have no dependency on MUI components; data/context modules use React but are UI-kit agnostic. The table-state hook depends on shared domain table rules, not MUI. Do not translate MUI JSX mechanically. The current MUI `tsconfig.app.json` does not enable `noUncheckedIndexedAccess`; its baseline audit found 13 additional errors under that option (mostly in copyable rules/hooks/reducer). Phase 0 recommends narrowly documented type-safety edits if the strict option is retained; the observable domain behavior and messages must remain unchanged.

### Shared component kit and shell

MUI groups reusable primitives in `components/basic`, app compositions in `components/composite` and `components/business`, data-display (including `ResponsiveDataTable`, column layout, pager and board) in `components/data-display`, charts in `components/charts`, feedback in `components/feedback`, and shell pieces in `components/layout`. The shell includes auth boundary/layout, sidebar/navigation, header/search, breadcrumbs, page header, user and notification menus, skip link, data status, and toast provider. The shadcn port should retain these responsibilities while moving generated primitives to `src/components/ui` and product compositions to `src/components/app` and feature folders.

MUI installed `react-hook-form`, `zod`, and `@hookform/resolvers` but had zero imports in the audited snapshot; forms are predominantly controlled by page/component code and domain rule functions. Ported forms will use the requested RHF/Zod integration while preserving MUI's field rules, error order, and exact user-facing messages. MUI charts use `@mui/x-charts` via `components/charts/BarChartView.tsx` and a shared chart card. Kendo uses Kendo Charts; both use the same domain reports. The chosen shadcn chart pattern uses Recharts; record the library-change decision and keep chart data, labels, and alternative data-table views identical.

## MUI versus Kendo differences

Default is **MUI** for behavior and content. A Kendo deviation is a decision item only when it is a visible, clear UX/accessibility improvement; no silent parity drift.

| Feature or behavior | MUI baseline | Kendo port | Follow / decision |
|---|---|---|---|
| Routes and page inventory | 30 pages plus root/wildcard | Same routes after parity audit | Follow MUI. |
| Domain, seed records, simulation | Shared Angular-derived models, 13 seeds, `?sim=` | Copied model/data behavior | Follow MUI byte-for-byte. |
| Orders list behavior | Search, filters, selection, bulk actions, table/card layout | Parity implementation with Kendo Grid | Follow MUI behavior and labels. |
| Table breakpoint behavior | Cards below 640; progressively disclosed columns above | Kendo-specific grid/stacked implementation | Follow MUI content priorities; implement at requested 768 card cutoff and record difference. |
| Order creation | Seven-step wizard; same domain planner/gating | Seven steps | Follow MUI rules, copy domain messages. |
| Forms | Hand-rolled controls, shared domain validation | Hand-rolled despite Kendo Form installed | Use RHF/Zod per approved plan, preserve MUI behavior. |
| Charts | MUI X Charts, chart/table alternatives | Kendo Charts, chart/table alternatives | Decision: Recharts shadcn chart wrapper is recommended; preserve series and labels. |
| Workflow board keyboard path | Board with pointer interaction and status actions | Adds explicit “Move to…” menu and Undo affordance | **Decision: adopt keyboard Move to path; recommendation yes for accessibility.** Log the deliberate parity delta; Undo can be retained only if the owner accepts behavior expansion. |
| Board drag implementation | App-owned board | Kendo TaskBoard after a spike; custom cards/columns | Follow MUI semantics, use dnd-kit only if pointer drag remains and keyboard path is equivalent. |
| Status stepper | Future steps are neutral | Review found future steps rendered as errors (`G1`) | Follow MUI; explicitly prevent error styling on incomplete future steps. |
| Icons | MUI icon set | Mixed Kendo SVG and Lucide systems (`I1–I3`) | Use lucide-react only, one 16/20/24 size scale. |
| Loading, empty, error | Shared states and per-surface retries | Mostly parity; later compacted KPI state | Follow MUI state coverage and retry behavior. |
| Destructive confirmation | Confirm dialog in key destructive flows | Confirm dialog in key flows | Follow MUI; require AlertDialog for every destructive action. |
| Theme coverage | Theme tokens and provider | Later dark portal/system-mode fixes | Follow semantic intent; class on `html` must theme every portal and toast from first theme phase. |
| Theme hues | Radiology blue primary | Teal primary in prior snapshot, later changed to radiology blue | Avoid both colors; use warm diagnostic brass with warm neutral surfaces. |
| Page header | Shared PageHeader | Shared PageHeader, consistently used | Follow one shared pattern. |
| Search | Header global search and order lookup | Header search parity | Implement command palette on Cmd/Ctrl+K with real routes and order results. |
| Date selection | MUI date-picker provider present; no picker rendered in baseline | Native inputs remained in several screens | Use shadcn Calendar/date picker only where MUI has date selection behavior; ensure themed popover. |
| File upload | Client-side simulation and validation | Kendo Upload pipeline; validation retained | Follow MUI validation, messages, and simulation. |
| Motion/resize | MUI components | Review found a resize-listener layout implementation before later cleanup | Use CSS/container-aware responsive behavior and reduced-motion support. |
| Bundle splitting | Baseline router not lazy-loaded | Review found no route-level lazy splitting before fix | Add route-level lazy loading and report build output by phase. |

## Lessons from the Kendo review → build rules

| Review pattern | Build rule here |
|---|---|
| Future workflow steps accidentally receive error state (`G1`) | Define status mapping centrally; incomplete is neutral, and status always has icon plus text. |
| Installed form/date/grid/upload packages went unused (`K1–K3`) | Every dependency must have a named use in DEPENDENCIES and licensing review; remove proposals before approval if no concrete use. Use RHF/Zod, Calendar, DataTable, and upload behavior intentionally. |
| Native selects/date inputs left operating-system popup styling (`K2`) | Use themed shadcn controls and inspect the rendered portal/popover in both themes. |
| Mixed icon families and inconsistent sizes (`I1–I3`) | lucide-react only; shared icon sizing tokens. |
| Dark-mode fixes had to reach dialogs, date popups and toasts | Put `.dark` on `html`; verify dialogs, popovers, selects, command palette and Sonner portals. `color-scheme` and prepaint script are part of the theme. |
| Grid behavior became dependent on premium/custom grid features | Build one TanStack DataTable with documented column priorities and card fallback under 768px. |
| Responsive columns and sidebar resize drift | Use CSS media queries/shared breakpoints; avoid per-render `innerWidth` and untracked resize listeners. |
| Literal colors and ad hoc z-index made polish inconsistent | One token source generates CSS mappings; no feature/component color literals; central layer scale. |
| Chart labels/series did not consistently follow theme | Chart wrapper consumes semantic chart tokens; test mounted charts after theme changes and provide a table alternative. |
| Shared page chrome and state behavior varied | One PageHeader, one feedback-state kit, one confirm pattern; every data surface has loading, empty, error and Retry. |
| Heavy initial bundle and delayed chunk cleanup | Lazy load every route; record production bundle sizes each phase and address oversized chunks. |
| Accessible board movement was not guaranteed by drag-and-drop | Keyboard “Move to…” menu is the complete accessible path; drag is an enhancement. Respect reduced motion. |

## Dependencies shared by both ports

Framework/core: `react`, `react-dom`, `react-router-dom`, Vite, TypeScript. Shared app-specific data dependencies include `react-odontogram` (used for a read-only teeth chart); inspect licensing and maintenance before accepting reuse. MUI has RHF/Zod packages installed but unused. Neither app's UI kit is reusable here. Kendo's installed package family is UI-specific and must not be copied. The two existing ports share font packages only partially (Inter and JetBrains Mono); this port proposes self-hosted DM Sans and IBM Plex Mono instead.
