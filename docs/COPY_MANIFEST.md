# Copy manifest

Every copied file is listed with source path and truncated SHA-256 (12 chars) of source
and destination after any import-alias changes. “identical” means matching full hash;
“modified” requires the patch/reason below. Seed check compares 13/13 files with
`../mui/src/data/seed` via `npm run check:seed`.

| Destination | MUI source | Source SHA-256 | Destination SHA-256 | Status / patch |
|---|---|---|---|---|
| src/domain/catalog.ts | ../mui/src/domain/catalog.ts | 1feee06cb54b | 1feee06cb54b | identical |
| src/domain/formatters.ts | ../mui/src/domain/formatters.ts | 33837dddaff6 | 33837dddaff6 | identical |
| src/domain/models.ts | ../mui/src/domain/models.ts | 99a226842ef9 | 99a226842ef9 | identical |
| src/domain/notifications.ts | ../mui/src/domain/notifications.ts | bbe6e5b0b6bf | bbe6e5b0b6bf | identical |
| src/domain/priority.ts | ../mui/src/domain/priority.ts | 87a3f65675c7 | 87a3f65675c7 | identical |
| src/domain/status.ts | ../mui/src/domain/status.ts | fb6da638ee52 | fb6da638ee52 | identical |
| src/domain/rules/billing.ts | ../mui/src/domain/rules/billing.ts | 914cf0e74ee9 | 914cf0e74ee9 | identical |
| src/domain/rules/directory.ts | ../mui/src/domain/rules/directory.ts | 405ea9ad5a98 | 405ea9ad5a98 | identical |
| src/domain/rules/files.ts | ../mui/src/domain/rules/files.ts | e990779e2bdd | e990779e2bdd | identical |
| src/domain/rules/metrics.ts | ../mui/src/domain/rules/metrics.ts | 0d09a0f3b473 | 0d09a0f3b473 | identical |
| src/domain/rules/order-creation.ts | ../mui/src/domain/rules/order-creation.ts | 0168190a2707 | 2c81bd317104 | modified — patch P03-A |
| src/domain/rules/order-edit.ts | ../mui/src/domain/rules/order-edit.ts | cb30d2989af8 | cb30d2989af8 | identical |
| src/domain/rules/order-filters.ts | ../mui/src/domain/rules/order-filters.ts | c1bf45c4975c | c1bf45c4975c | identical |
| src/domain/rules/orders.ts | ../mui/src/domain/rules/orders.ts | c45dab82d572 | c45dab82d572 | identical |
| src/domain/rules/relations.ts | ../mui/src/domain/rules/relations.ts | 3600ebe8f33b | 3600ebe8f33b | identical |
| src/domain/rules/reporting.ts | ../mui/src/domain/rules/reporting.ts | 11852d3771f9 | 0f53805681f6 | modified — patches P03-B, P03-C |
| src/domain/rules/settings.ts | ../mui/src/domain/rules/settings.ts | 8baed44a8b33 | 8baed44a8b33 | identical |
| src/domain/rules/sub-orders.ts | ../mui/src/domain/rules/sub-orders.ts | 9b77a20b4745 | 9b77a20b4745 | identical |
| src/domain/rules/table.ts | ../mui/src/domain/rules/table.ts | 365e13cbbe5e | 365e13cbbe5e | identical |
| src/data/api.ts | ../mui/src/data/api.ts | bb5a90ab1023 | bb5a90ab1023 | identical |
| src/data/app-data-context.ts | ../mui/src/data/app-data-context.ts | 950ca5d6634d | 950ca5d6634d | identical |
| src/data/app-data-reducer.ts | ../mui/src/data/app-data-reducer.ts | 044a109f0483 | 6881da0386dd | modified — patch P03-D |
| src/data/AppDataProvider.tsx | ../mui/src/data/AppDataProvider.tsx | 1e6928edd6f3 | 1e6928edd6f3 | identical |
| src/data/fixtures.ts | ../mui/src/data/fixtures.ts | 1466ea07fa29 | 1466ea07fa29 | identical |
| src/data/seed/billing.json | ../mui/src/data/seed/billing.json | 43241018ab0c | 43241018ab0c | identical |
| src/data/seed/cases.json | ../mui/src/data/seed/cases.json | a2cf52ceac94 | a2cf52ceac94 | identical |
| src/data/seed/change-requests.json | ../mui/src/data/seed/change-requests.json | fe95b641e941 | fe95b641e941 | identical |
| src/data/seed/clinics.json | ../mui/src/data/seed/clinics.json | d50048c22f42 | d50048c22f42 | identical |
| src/data/seed/dashboard-volume.json | ../mui/src/data/seed/dashboard-volume.json | 8208c0d900ec | 8208c0d900ec | identical |
| src/data/seed/doctors.json | ../mui/src/data/seed/doctors.json | 5c8d8b1921be | 5c8d8b1921be | identical |
| src/data/seed/documents.json | ../mui/src/data/seed/documents.json | 553e2314337d | 553e2314337d | identical |
| src/data/seed/notifications.json | ../mui/src/data/seed/notifications.json | c5115cc6baeb | c5115cc6baeb | identical |
| src/data/seed/orders.json | ../mui/src/data/seed/orders.json | c1119ffd82b5 | c1119ffd82b5 | identical |
| src/data/seed/patients.json | ../mui/src/data/seed/patients.json | bacd287edad8 | bacd287edad8 | identical |
| src/data/seed/reporting.json | ../mui/src/data/seed/reporting.json | 71b94c902ae9 | 71b94c902ae9 | identical |
| src/data/seed/scan-centers.json | ../mui/src/data/seed/scan-centers.json | 4dfa5fab5830 | 4dfa5fab5830 | identical |
| src/data/seed/sub-orders.json | ../mui/src/data/seed/sub-orders.json | 569e3bb96006 | 569e3bb96006 | identical |
| src/lib/download.ts | ../mui/src/lib/download.ts | ce7f02d83d96 | ce7f02d83d96 | identical |
| src/hooks/useTableControls.ts | ../mui/src/hooks/useTableControls.ts | 1b0157bab1d9 | 1b0157bab1d9 | identical |
| src/hooks/useTabParam.ts | ../mui/src/hooks/useTabParam.ts | ed6971127990 | 42b5ef5c38f3 | modified — patch P03-E |
| src/app/auth.ts | ../mui/src/app/auth.ts | 84593e09c872 | 84593e09c872 | identical |
| src/app/routes.ts | ../mui/src/app/routes.ts | dd39b5be965a | dd39b5be965a | identical |
| src/app/breadcrumbs.ts | ../mui/src/app/breadcrumbs.ts | 4238a061112d | 4238a061112d | identical |

39/43 files byte-identical. No MUI JSX translated; `@/` import paths work unchanged.

## Patches (all type-only, behavior-preserving, required by `noUncheckedIndexedAccess`)

- P03-A (`src/domain/rules/order-creation.ts`): guard parallel-array indexing — early-return
  the detail unchanged when `built.subOrders[index]` or `subOrderInputs[index]` is
  `undefined`; same guard before `refreshSubOrderCounts(row, details[index])`. Arrays are
  built in lockstep so the guards never trigger at runtime.
- P03-B (`src/domain/rules/reporting.ts`): `if (service === undefined) continue` for the
  seeded service lookup (seed list is non-empty at runtime).
- P03-C (`src/domain/rules/reporting.ts`): `MONTH_NAMES[month - 1] ?? ''` (months are 1–12).
- P03-D (`src/data/app-data-reducer.ts`): look up `next.subOrderDetails[row.id]` once and
  require it to be defined before `refreshSubOrderCounts` (details are built for every row).
- P03-E (`src/hooks/useTabParam.ts`): throw when `tabs` is empty so `tabs[0]` narrows to
  `V` (all callers pass a non-empty tuple).
