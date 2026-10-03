# Licensing and maintenance review

The owner approved the dependency matrix on 2026-10-03, including an explicit OFL-1.1 exception for the two self-hosted font packages. For every direct/transitive dependency, record exact version, license, source URL, latest release date, npm weekly downloads, maintenance evidence, use site, and review date. Review generated shadcn registry source and preserve required notices. Do not treat the absence of a package import as evidence of use.

| Dependency | Proposed exact version | License | Maintenance signal | Phase / status |
|---|---:|---|---|---|
| `react` | 19.3.0 | MIT | Release 2026-09-09 | P01 — approved by owner 2026-10-03 |
| `react-dom` | 19.3.0 | MIT | Release 2026-09-09 | P01 — approved by owner 2026-10-03 |
| `react-router-dom` | 7.18.4 | MIT | Release 2026-09-15 | P01 — approved by owner 2026-10-03 |
| `vite` | 8.3.2 | MIT | Release 2026-10-01 | P01 — approved by owner 2026-10-03 |
| `typescript` | 6.0.3 | Apache-2.0 | Release 2026-04-16; TS peer-compatible | P01 — approved by owner 2026-10-03 |
| `@vitejs/plugin-react` | 6.1.1 | MIT | Release 2026-08-28 | P01 — approved by owner 2026-10-03 |
| `tailwindcss` | 4.3.3 | MIT | Release 2026-07-16 | P01 — approved by owner 2026-10-03 |
| `@tailwindcss/vite` | 4.3.3 | MIT | Release 2026-07-16 | P01 — approved by owner 2026-10-03 |
| `shadcn` CLI | 4.21.1 | MIT | Release 2026-10-01 | P01/P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-alert-dialog` | 1.1.23 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-checkbox` | 1.3.11 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-collapsible` | 1.1.20 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-dialog` | 1.1.23 | MIT | Release 2026-07-24 | P04/P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-dropdown-menu` | 2.1.24 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-label` | 2.1.15 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-popover` | 1.1.23 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-select` | 2.3.7 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-separator` | 1.1.15 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-slot` | 1.3.3 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-switch` | 1.3.7 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-tabs` | 1.1.21 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `@radix-ui/react-tooltip` | 1.2.16 | MIT | Release 2026-07-24 | P05 — approved by owner 2026-10-03 |
| `class-variance-authority` | 0.7.1 | Apache-2.0 | Old release 2024-11-26; repository unarchived and pushed 2026-10-03 | P01 — review update recency |
| `clsx` | 2.1.1 | MIT | Old release 2024-04-23; repo unarchived, last pushed 2024-06-10 | P01 — stable, low update recency |
| `tailwind-merge` | 3.7.0 | MIT | Release 2026-09-12 | P01 — approved by owner 2026-10-03 |
| `@tanstack/react-table` | 9.2.4 | MIT | Release 2026-08-28 | P05 — approved by owner 2026-10-03 |
| `recharts` | 3.10.1 | MIT | Release 2026-07-25 | P05 — approved by owner 2026-10-03 |
| `lucide-react` | 1.51.0 | ISC | Release 2026-10-03 | P04 — approved by owner 2026-10-03 |
| `sonner` | 2.0.8 | MIT | Release 2026-08-09 | P05 — approved by owner 2026-10-03 |
| `cmdk` | 1.1.1 | MIT | Old release 2025-03-14; repo unarchived, pushed 2025-10-29 | P04 — review update recency |
| `react-hook-form` | 7.89.0 | MIT | Release 2026-09-26 | P05/P09 — approved by owner 2026-10-03 |
| `zod` | 4.6.5 | MIT | Release 2026-09-13 | P05/P09 — approved by owner 2026-10-03 |
| `@hookform/resolvers` | 5.9.1 | MIT | Release 2026-08-17 | P05/P09 — approved by owner 2026-10-03 |
| `react-day-picker` | 10.0.2 | MIT | Release 2026-09-30 | P05/P10 — approved by owner 2026-10-03 |
| `date-fns` | 4.4.0 | MIT | Release 2026-05-29 | P05/P10 — approved by owner 2026-10-03 |
| `@dnd-kit/core` | 6.3.1 | MIT | Old release 2024-12-05; repo unarchived, pushed 2026-09-12 | P10 — review package release age |
| `@dnd-kit/sortable` | 10.0.0 | MIT | Old release 2024-12-04; repo unarchived, pushed 2026-09-12 | P10 — review package release age |
| `@dnd-kit/utilities` | 3.2.2 | MIT | Old release 2023-11-06; repo unarchived, pushed 2026-09-12 | P10 — review package release age |
| `react-odontogram` | 0.6.0 | MIT | Release 2026-09-08; repo unarchived, pushed 2026-09-08; embedded assets need review | P08/P09 — approved by owner 2026-10-03 |
| `@fontsource/dm-sans` | 5.3.0 | **OFL-1.1** | Release 2026-07-19; repo unarchived, pushed 2026-09-27 | P02 — **blocked; license disallowed** |
| `@fontsource/ibm-plex-mono` | 5.3.0 | **OFL-1.1** | Release 2026-07-19; repo unarchived, pushed 2026-09-27 | P02 — **blocked; license disallowed** |
| `eslint` | 9.39.5 | MIT | Release 2026-07-10; chosen for jsx-a11y peer range | P01 — approved by owner 2026-10-03 |
| `@eslint/js` | 9.39.5 | MIT | Release 2026-07-10 | P01 — approved by owner 2026-10-03 |
| `typescript-eslint` | 8.71.0 | MIT | Release 2026-09-28; peer supports TS `<6.1` | P01 — approved by owner 2026-10-03 |
| `eslint-plugin-react-hooks` | 7.1.1 | MIT | Release 2026-04-17 | P01 — approved by owner 2026-10-03 |
| `eslint-plugin-jsx-a11y` | 6.10.2 | MIT | Old release 2024-10-26; repo unarchived, pushed 2026-01-06; ESLint peer ends at 9 | P01 — compatibility documented |
| `globals` | 17.13.0 | MIT | Release 2026-10-01 | P01 — approved by owner 2026-10-03 |
| `prettier` | 3.9.9 | MIT | Release 2026-09-23 | P01 — approved by owner 2026-10-03 |
| `prettier-plugin-tailwindcss` | 0.8.1 | MIT | Release 2026-07-15 | P01 — approved by owner 2026-10-03 |
| `@types/node` | 22.20.5 | MIT | Release 2026-10-01; aligns Node 22 | P01 — approved by owner 2026-10-03 |
| `@types/react` | 19.3.0 | MIT | Release 2026-09-09 | P01 — approved by owner 2026-10-03 |
| `@types/react-dom` | 19.3.0 | MIT | Release 2026-09-09 | P01 — approved by owner 2026-10-03 |

Full per-package release dates and weekly download counts are in [DEPENDENCIES.md](../DEPENDENCIES.md). Weekly count period: 2026-09-25 through 2026-10-01. No package installs have run. This direct-dependency review does not claim each transitive dependency has been individually audited.
| `react-router-dom` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Routing / URL state | P01 — pending |
| `vite`, `typescript`, `@vitejs/plugin-react` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Build/compiler | P01 — pending |
| `tailwindcss` | 4.3.3 observed | MIT observed | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | CSS utility framework | P01 — pending |
| `@tailwindcss/vite`, `shadcn` CLI | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Vite CSS integration / source generation | P01 — pending |
| `@radix-ui/react-*` selected primitives | `[NEEDS VERIFICATION]` per package | `[NEEDS VERIFICATION]` per package | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Accessible components; only packages actually generated | P01/P05 — pending |
| `class-variance-authority`, `clsx`, `tailwind-merge` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | shadcn styling utilities | P01 — pending |
| `@tanstack/react-table` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Shared data table | P05 — pending |
| `recharts` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Tokenized charts | P05 — pending |
| `lucide-react`, `sonner`, `cmdk` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Icons, toast, command palette | P04/P05 — pending |
| `react-hook-form`, `zod`, `@hookform/resolvers` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Forms and schema validation | P05/P09 — pending |
| `react-day-picker`, `date-fns` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Calendar/date filters | P05/P10 — pending |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Optional workflow-board drag | P10 — pending |
| `react-odontogram` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Existing MUI teeth chart behavior; inspect package and embedded asset licenses | P08/P09 — pending |
| `@fontsource/dm-sans`, `@fontsource/ibm-plex-mono` | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Self-hosted type; separately record bundled font asset license | P02 — pending |
| ESLint, TypeScript ESLint, hooks, jsx-a11y, globals, Prettier, Tailwind sorter, type declarations | `[NEEDS VERIFICATION]` each | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Static quality and declarations | P01 — pending |
