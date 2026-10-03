# Licensing and maintenance review

No packages were installed in Phase 0. For every approved direct/transitive dependency, record exact version, license, source URL, latest release date, npm weekly downloads, maintenance evidence, use site, and review date. Allowed licenses: MIT, Apache-2.0, ISC, BSD only. Review generated shadcn registry source and preserve required notices. Do not treat the absence of a package import as evidence of use.

| Dependency | Planned version | License | Latest release | Weekly downloads | Maintenance / use | Phase / status |
|---|---|---|---|---|---|---|
| `react`, `react-dom` | 19.3.0 observed / exact pair to pin | MIT observed | `[NEEDS VERIFICATION]` | `[NEEDS VERIFICATION]` | Core runtime | P01 — pending |
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
