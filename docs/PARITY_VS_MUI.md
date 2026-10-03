# Parity vs MUI

One row per route/screen group, behavior, shared composition, and cross-cutting state. MUI is authoritative unless a row is explicitly marked as a pending owner decision. `verified` requires manual evidence in `docs/EVIDENCE_CHECKLIST.md`.

| ID | MUI source | shadcn target | Components / libraries | Effort | Phase | Status |
|---|---|---|---|---:|---|---|
| INFRA-01 | `vite.config.ts`, `package.json`, `tsconfig.app.json` | strict Vite/Tailwind v4/shadcn scaffold and common quality gate | React, Vite, TypeScript, ESLint, Prettier | M | P01 | done |
| CORE-01 | `src/domain/**`, `src/data/**` | byte-identical domain, seeds, data state | copied modules, React context | L | P03 | todo |
| CORE-02 | `src/hooks/useTableControls.ts`, `useTabParam.ts` | same URL table/tab state | React Router hooks | M | P03 | todo |
| SHELL-01 | `src/app/router.tsx`, `components/layout/*` | guarded SPA, lazy routes, responsive shell | React Router, Sidebar, Sheet, ErrorBoundary | L | P04 | todo |
| SHELL-02 | `components/layout/Header.tsx`, `GlobalSearch.tsx` | search command palette + routes/order lookup | Command/cmdk, Dialog | M | P04 | todo |
| KIT-01 | `components/basic/*`, `business/*` | shared StatusBadge, indicators, cards | shadcn Badge, lucide-react | M | P05 | todo |
| KIT-02 | `components/data-display/ResponsiveDataTable.tsx` | shared responsive DataTable and mobile cards | TanStack Table, shadcn Table | XL | P05 | todo |
| KIT-03 | `components/composite/ConfirmDialog.tsx`, feedback | confirm, toast, loading/empty/error | AlertDialog, Sonner, Skeleton | M | P05 | todo |
| KIT-04 | `components/charts/*` | token-aware charts and table views | Recharts / shadcn chart | M | P05 | todo |
| AUTH-01 | `features/auth/LoginPage.tsx` | mock sign-in and return route | RHF, Zod, shadcn Form | M | P04 | todo |
| ORD-01 | `features/orders/list/*` | orders search/filter/sort/page/select/columns/actions | DataTable, URL state | XL | P06 | todo |
| DASH-01 | `features/dashboard/DashboardPage.tsx` | KPIs, alert, charts, recent orders, activity | chart wrapper, DataTable | L | P07 | todo |
| ORD-02 | `features/orders/view/*`, `workflow/*`, `files/*`, `sub-order/*` | details, lifecycle, files, tabs and states | Stepper composition, upload, AlertDialog | XL | P08 | todo |
| ORD-03 | `features/orders/create/*`, `edit/*`; `domain/rules/order-*` | seven-step create + edit validation | RHF, Zod, Calendar, teeth chart | XL | P09 | todo |
| REC-01 | `features/cases/*`, `workflow-board/*`, `scan-center/*` | cases, board, scan center | DataTable, dnd-kit (if approved), Tabs | XL | P10 | todo |
| REC-02 | `features/{patients,doctors,clinics,directory}/*` | lists, add dialogs, detail tabs and relations | DataTable, Dialog, Tabs | XL | P10 | todo |
| REC-03 | `features/{documents,billing,change-requests}/*` | upload, CSV, approvals/rejections | DataTable, AlertDialog | L | P10 | todo |
| OPS-01 | `features/{notifications,settings}/*` | notifications and six settings sections | Tabs, Switch, forms | L | P10 | todo |
| RPT-01 | `features/reports/*` | reports hub + four report pages and states | Recharts, Calendar, DataTable | XL | P10 | todo |
| DEMO-01 | `features/showcase/*`, `features/errors/*` | /forms, /grid, Not Found | kit showcase | M | P10 | todo |
| THEME-01 | `src/theme/tokens.ts`, `ThemeModeSelect.tsx` | Diagnostix tokens, provider, mode controls | CSS variables, html class | L | P02 | todo |

Status: todo → in-progress → done; `verified` only after manual pass; `deviated` links a row in DEVIATIONS.md. Proposed Kendo keyboard board enhancement is not parity-approved yet.
