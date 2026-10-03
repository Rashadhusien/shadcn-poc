# Approved dependency matrix — Gate 0

The owner approved the exact matrix on 2026-10-03, including an explicit OFL-1.1 exception for the two self-hosted font packages. Read-only npm metadata was retrieved on 2026-10-03; weekly download counts cover 2026-09-25 through 2026-10-01. Use the exact package pins in the authoritative matrix below. Recheck in `docs/LICENSING_REVIEW.md` at P12. `shadcn` CLI is used for locally owned source generation; it is not a runtime component library.

**Approval status: approved.** The owner accepted the full matrix, including the OFL-1.1 font-license exception. The first package table below is a planning-scope summary; exact package pins and metadata are in the authoritative matrix that follows.

| Package | Exact planned version | License | Latest release date | Weekly downloads | Why needed / alternative considered | Phase |
|---|---|---|---|---|---|---|
| `react`, `react-dom` | 19.3.0 (registry latest observed; pin exact pair at Gate 0) | MIT (registry metadata) | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | SPA runtime; same framework as baselines. Alternative: framework change rejected. | P01 |
| `react-router-dom` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Same route model, nested shell and URL state; alternative: another router rejected for parity. | P01 |
| `vite`, `typescript`, `@vitejs/plugin-react` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Requested SPA toolchain; alternative: Next.js rejected. | P01 |
| `tailwindcss` | 4.3.3 (registry latest observed; pin exact at Gate 0) | MIT (registry metadata) | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Utility CSS foundation requested; alternative: existing MUI/Kendo CSS systems rejected. | P01 |
| `@tailwindcss/vite` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Official Tailwind v4 Vite integration; alternative: PostCSS setup unnecessary. | P01 |
| `shadcn` CLI (ephemeral) | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Generate editable registry components; alternative: manual primitive implementation. | P01/P05 |
| `@radix-ui/react-*` primitives selected by shadcn (`alert-dialog`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `label`, `popover`, `select`, `separator`, `slot`, `switch`, `tabs`, `tooltip`, and only others required by the chosen registry components) | `[NEEDS VERIFICATION]` per package | `[NEEDS VERIFICATION]` per package | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Accessible primitive behavior under owned shadcn source; alternatives: Base UI or hand-built ARIA behavior. Do not install unneeded primitives. | P01/P05 |
| `class-variance-authority`, `clsx`, `tailwind-merge` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | shadcn variants and class merging; alternative: handwritten class concatenation. | P01 |
| `@tanstack/react-table` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Sorting, paging, row selection, visibility; alternative: bespoke table state. | P05 |
| `recharts` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Shadcn chart pattern for dashboard/reports; alternative: MUI X Charts retained for closer library parity. Owner decision. | P05 |
| `lucide-react` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Single icon system used by shadcn; alternative: mixed UI-kit icons rejected. | P04 |
| `sonner` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Toasts; alternative: custom live-region toaster. | P05 |
| `cmdk` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | shadcn Command for global keyboard palette; alternative: custom filtered dialog. | P04 |
| `react-hook-form`, `zod`, `@hookform/resolvers` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Schema-backed accessible forms while preserving MUI domain messages; alternative: MUI-style local state. | P05/P09 |
| `react-day-picker`, `date-fns` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Calendar/date popover where baseline uses date filtering; alternative: native OS date controls. | P05/P10 |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Board pointer drag enhancement with accessible keyboard move menu; alternative: no drag (owner decision) or inaccessible HTML5-only drag. | P10 |
| `react-odontogram` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | MUI read-only teeth chart behavior; alternative: custom dental SVG (not a logo) only if dependency is unapproved or unmaintained. Verify package and embedded asset licenses. | P08/P09 |
| `@fontsource/dm-sans`, `@fontsource/ibm-plex-mono` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Self-hosted interface and numeric/identifier fonts; alternatives: Inter/JetBrains (both ports already use these) or remote fonts (disallowed). Check bundled font licenses. | P02 |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `globals` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Type, hook, and accessibility lint. Kendo report noted jsx-a11y peer compatibility issue with ESLint 10; choose a compatible ESLint major if required. | P01 |
| `prettier`, `prettier-plugin-tailwindcss` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | Format code and canonicalize Tailwind classes; alternative: no class-order enforcement. | P01 |
| `@types/node`, `@types/react`, `@types/react-dom` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | TypeScript compiler declarations; alternatives: none suitable. | P01 |

### Verified package matrix — 2026-10-03

Weekly download period: 2026-09-25 to 2026-10-01. Exact version publication dates were read from npm metadata. “Recent” means a release in the last 12 months. Stale-release packages below have an official repository active/unarchived check where noted; a few stable packages still need a final maintenance check. Package versions are exact pins.

| Package | Exact pin | License | Release date | Downloads / week | Purpose; alternative considered | Phase / maintenance |
|---|---|---|---|---:|---|---|
| `react` | 19.3.0 | MIT | 2026-09-09 | 218,142,744 | SPA runtime; same framework as baselines | P01 recent |
| `react-dom` | 19.3.0 | MIT | 2026-09-09 | 205,683,116 | React DOM renderer | P01 recent |
| `react-router-dom` | 7.18.4 | MIT | 2026-09-15 | 55,054,243 | Route model and URL state; alternative router rejected for parity | P01 recent |
| `vite` | 8.3.2 | MIT | 2026-10-01 | 225,080,956 | Requested SPA builder; alternative SSR rejected | P01 recent |
| `typescript` | 6.0.3 | Apache-2.0 | 2026-04-16 | 354,808,929 | TS strict; 7.0.2 is outside typescript-eslint's supported `<6.1` range | P01 recent |
| `@vitejs/plugin-react` | 6.1.1 | MIT | 2026-08-28 | 113,385,850 | React integration for Vite | P01 recent |
| `tailwindcss` | 4.3.3 | MIT | 2026-07-16 | 158,877,679 | Requested utility CSS; no second UI kit | P01 recent |
| `@tailwindcss/vite` | 4.3.3 | MIT | 2026-07-16 | 59,163,590 | Official Tailwind v4 Vite plugin; PostCSS alternative rejected | P01 recent |
| `shadcn` | 4.21.1 | MIT | 2026-10-01 | 12,774,625 | Generate locally owned components; manual primitive implementation alternative | P01/P05 recent |
| `@radix-ui/react-alert-dialog` | 1.1.23 | MIT | 2026-07-24 | 57,440,814 | Accessible destructive confirmation primitive | P05 recent |
| `@radix-ui/react-checkbox` | 1.3.11 | MIT | 2026-07-24 | 63,431,541 | Accessible table/form selection; hand-built ARIA alternative | P05 recent |
| `@radix-ui/react-collapsible` | 1.1.20 | MIT | 2026-07-24 | 64,886,054 | Accessible sidebar/disclosure control | P05 recent |
| `@radix-ui/react-dialog` | 1.1.23 | MIT | 2026-07-24 | 89,251,464 | Dialog, sheet and command palette base | P04/P05 recent |
| `@radix-ui/react-dropdown-menu` | 2.1.24 | MIT | 2026-07-24 | 70,236,198 | Accessible action menus; custom menu alternative | P05 recent |
| `@radix-ui/react-label` | 2.1.15 | MIT | 2026-07-24 | 68,211,870 | Control labels; native label alternative | P05 recent |
| `@radix-ui/react-popover` | 1.1.23 | MIT | 2026-07-24 | 70,093,078 | Calendar and filter popover base | P05 recent |
| `@radix-ui/react-select` | 2.3.7 | MIT | 2026-07-24 | 68,420,716 | Themed select; native OS popup alternative rejected | P05 recent |
| `@radix-ui/react-separator` | 1.1.15 | MIT | 2026-07-24 | 67,738,677 | Sidebar and menu divider semantics | P05 recent |
| `@radix-ui/react-slot` | 1.3.3 | MIT | 2026-07-24 | 216,415,984 | shadcn polymorphic button/slot primitive | P05 recent |
| `@radix-ui/react-switch` | 1.3.7 | MIT | 2026-07-24 | 62,814,219 | Settings switches | P05 recent |
| `@radix-ui/react-tabs` | 1.1.21 | MIT | 2026-07-24 | 73,561,293 | URL-backed page/detail tabs | P05 recent |
| `@radix-ui/react-tooltip` | 1.2.16 | MIT | 2026-07-24 | 69,850,578 | Accessible hover/focus tooltip | P05 recent |
| `class-variance-authority` | 0.7.1 | Apache-2.0 | 2024-11-26 | 81,207,006 | shadcn class variants; handwritten variants alternative. Repo active/unarchived, pushed 2026-10-03 | P01 older package release |
| `clsx` | 2.1.1 | MIT | 2024-04-23 | 152,047,631 | Conditional class composition; string concatenation alternative. Repo unarchived, last pushed 2024-06-10 | P01 older stable release; low update recency |
| `tailwind-merge` | 3.7.0 | MIT | 2026-09-12 | 104,097,229 | Resolve conflicting utility classes | P01 recent |
| `@tanstack/react-table` | 9.2.4 | MIT | 2026-08-28 | 26,046,809 | Sorting/page/select/visibility; bespoke grid alternative | P05 recent |
| `recharts` | 3.10.1 | MIT | 2026-07-25 | 69,619,240 | shadcn chart pattern; MUI X Charts alternative for library parity | P05 recent |
| `lucide-react` | 1.51.0 | ISC | 2026-10-03 | 131,769,853 | One icon family; mixed kits rejected | P04 recent |
| `sonner` | 2.0.8 | MIT | 2026-08-09 | 62,144,461 | Toasts; custom toaster alternative | P05 recent |
| `cmdk` | 1.1.1 | MIT | 2025-03-14 | 53,655,935 | shadcn Command; custom filtered dialog alternative. Repo active/unarchived, pushed 2025-10-29 | P04 older release |
| `react-hook-form` | 7.89.0 | MIT | 2026-09-26 | 69,090,162 | Accessible form state; per-page local state alternative rejected | P05/P09 recent |
| `zod` | 4.6.5 | MIT | 2026-09-13 | 373,908,324 | Runtime schema validation; handwritten validators alternative rejected | P05/P09 recent |
| `@hookform/resolvers` | 5.9.1 | MIT | 2026-08-17 | 57,711,024 | RHF/Zod bridge | P05/P09 recent |
| `react-day-picker` | 10.0.2 | MIT | 2026-09-30 | 54,489,248 | shadcn Calendar; native date popup alternative rejected | P05/P10 recent |
| `date-fns` | 4.4.0 | MIT | 2026-05-29 | 120,484,994 | Date formatting/calendar utilities | P05/P10 recent |
| `@dnd-kit/core` | 6.3.1 | MIT | 2024-12-05 | 32,482,661 | Workflow pointer-drag enhancement; keyboard Move to is complete path. Repo active/unarchived, pushed 2026-09-12 | P10 older package release |
| `@dnd-kit/sortable` | 10.0.0 | MIT | 2024-12-04 | 31,450,146 | Board lane/card sorting; same accessible menu alternative | P10 older package release |
| `@dnd-kit/utilities` | 3.2.2 | MIT | 2023-11-06 | 32,432,799 | dnd-kit transforms/helpers. Repo active/unarchived, pushed 2026-09-12 | P10 older package release |
| `react-odontogram` | 0.6.0 | MIT | 2026-09-08 | 21,627 | Read-only tooth chart matching MUI; custom dental SVG alternative if rejected. Repo active/unarchived, pushed 2026-09-08 | P08/P09 recent; check embedded assets |
| `@fontsource/dm-sans` | 5.3.0 | **OFL-1.1** | 2026-07-19 | 572,733 | Self-hosted body font; owner approved exception | P02 approved exception |
| `@fontsource/ibm-plex-mono` | 5.3.0 | **OFL-1.1** | 2026-07-19 | 2,638,064 | Self-hosted mono font; owner approved exception | P02 approved exception |
| `eslint` | 9.39.5 | MIT | 2026-07-10 | 193,336,881 | ESLint 10 rejected: jsx-a11y peer range ends at 9 | P01 recent |
| `@eslint/js` | 9.39.5 | MIT | 2026-07-10 | 171,902,358 | Match ESLint 9 config major | P01 recent |
| `typescript-eslint` | 8.71.0 | MIT | 2026-09-28 | 108,953,857 | TS lint; supports TS `>=4.8.4 <6.1.0` | P01 recent |
| `eslint-plugin-react-hooks` | 7.1.1 | MIT | 2026-04-17 | 117,759,257 | React Hooks lint | P01 recent |
| `eslint-plugin-jsx-a11y` | 6.10.2 | MIT | 2024-10-26 | 57,895,667 | Accessibility lint; peer supports ESLint through 9. Repo active/unarchived, pushed 2026-01-06 | P01 older release |
| `globals` | 17.13.0 | MIT | 2026-10-01 | 320,588,437 | ESLint global environment definitions | P01 recent |
| `prettier` | 3.9.9 | MIT | 2026-09-23 | 165,273,649 | Formatter | P01 recent |
| `prettier-plugin-tailwindcss` | 0.8.1 | MIT | 2026-07-15 | 11,375,828 | Sort utility classes | P01 recent |
| `@types/node` | 22.20.5 | MIT | 2026-10-01 | 535,387,792 | Node 22 declarations to match runtime | P01 recent |
| `@types/react` | 19.3.0 | MIT | 2026-09-09 | 199,812,361 | React 19 declarations | P01 recent |
| `@types/react-dom` | 19.3.0 | MIT | 2026-09-09 | 171,309,570 | React DOM 19 declarations | P01 recent |

The exact version license/date results came from `npm view <name>@<version> version license --json` and `npm view <name>@<version> time --json`; downloads came from npm's `downloads/point/last-week` API. GitHub archive/last-push checks were made for listed older packages with repository dates. Recent-release packages use their release date as the maintenance signal. This direct-dependency review does not claim every transitive dependency has been individually audited.

### Approval

Status: **not approved / incomplete**. Gate 0 owner review required. Any later library must meet the same criteria and appear in that phase's handoff. No MUI, Kendo, Ant, Chakra, Mantine, or other second UI kit may be added.
