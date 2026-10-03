# Copy manifest

Every copied file is listed with source path and SHA-256 before any import-alias changes. “Identical” means matching hash; “modified” requires listing the patch/reason and both source and destination hashes. Seed check is expected to compare 13/13 files with `../mui/src/data/seed`.

| Destination | MUI source | Source SHA-256 | Destination SHA-256 | Status / patch |
|---|---|---|---|---|
| — | — | — | — | No files copied in Phase 0. P03 must enumerate every copied file. |

Planned roots: `src/domain/**`, `src/data/**` including all seed JSON, `src/lib/download.ts`, `src/hooks/useTableControls.ts`, `src/hooks/useTabParam.ts`, `src/app/auth.ts`, `src/app/routes.ts`, `src/app/breadcrumbs.ts`. Preserve seed bytes exactly. Type-only compatibility fixes required by `noUncheckedIndexedAccess` must be listed individually.
