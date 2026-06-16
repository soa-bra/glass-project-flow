## Goal
Bring the project back to a clean `tsc` build by resolving every TS2304 / TS2305 / TS2339 / TS2352 / TS2677 / TS1117 / TS2345 / TS2322 / TS2300 error reported. Most are simple missing imports; the rest are small type/refactor fixes contained to the files already touched.

## Diff table

| # | File | Issue | Required fix |
|---|------|-------|--------------|
| 1 | `src/components/DepartmentTabs/Financial/FinancialDashboard.tsx` | `LinkIndicator` not imported | Add `import { LinkIndicator } from '@/components/shared/LinkIndicator';` |
| 2 | `src/components/DepartmentTabs/Financial/InvoicesTab.tsx` | `projectEventBus` + `LinkIndicator` not imported | Add `import { projectEventBus } from '@/features/projects/events/projectEventBus.service';` and `import { LinkIndicator } from '@/components/shared/LinkIndicator';` |
| 3 | `src/features/projects/events/projectEventBus.service.ts` | Class is defined but no `projectEventBus` singleton export exists | Append `export const projectEventBus = new ProjectEventBusService();` |
| 4 | `src/components/DepartmentTabs/Legal/LicensesTab.tsx` | `license.authority` missing on `License` type | Change accessor to existing field (e.g. `license.issuingAuthority` or fall back via `(license as any).authority ?? ''`); pick the field already present on the `License` mock type after reading it |
| 5 | `src/components/DepartmentTabs/Legal/RisksTab.tsx` | `risk.severity` missing on local risk object | Replace `risk.severity` with the existing `risk.riskLevel` field |
| 6 | `src/components/ProjectsColumn/AddProjectModal.tsx` | `'project.tasks.generate'` not in `AIActionName` union | Replace with a valid registered action name (verify in `aiActionRegistry.ts`), or register a new `project.tasks.generate` entry there if it should exist |
| 7 | `src/features/ai/gateway/aiGateway.client.ts` (line 173) | `data as AIGatewayErrorPayload` unsafe cast | Cast via `unknown`: `(data as unknown) as AIGatewayErrorPayload \| null` |
| 8 | `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` (line 545) | `readableAIElements` undefined | Either import the helper from its source or replace the reference with the in-scope variable (likely `sanitizedAIElements` / `elements`); inspect line 540-550 and pick correct local variable |
| 9 | `src/features/planning/elements/smart/ContextSmartMenu.tsx` | Missing imports: `SmartElementType`, `useContextSmartActions`, `areContextSmartMenuSelectionIdsPersisted`, `TRANSFORM_OPTIONS`, plus undefined `handleSuggestConversion` / `handleGenerateSmartDoc` / `handleTransform` | Add imports: `SmartElementType` from `@/features/planning/domain/types/smart.types`; `useContextSmartActions`, `areContextSmartMenuSelectionIdsPersisted`, `CONTEXT_SMART_TRANSFORM_OPTIONS as TRANSFORM_OPTIONS` from `./useContextSmartActions`. Replace the three `handle*` calls with their existing destructured equivalents from `useContextSmartActions` (`suggestConversion`, `generateSmartDoc`, `transform`) wrapped in `closeAfter(...)` |
| 10 | `src/features/planning/hooks/usePlanningCanvasReadyState.ts` | Missing `useMemo` import + `PlanningCanvasReadyReason` / `PlanningCanvasReadyInput` types not defined or exported | Add `import { useMemo } from 'react';`; define and export the two missing types (`PlanningCanvasReadyReason = 'missing-board' \| 'hydrating-elements' \| 'persistence-error' \| 'ready'`, and `PlanningCanvasReadyInput` interface with `boardId`, `canEdit`, `hydrationStatus`, `persistenceStatus`, `realtimeStatus`). Also export `PlanningCanvasHydrationStatus` alias (`'idle' \| 'loading' \| 'ready' \| 'error'`) consumed by `usePlanningStoreSync` |
| 11 | `src/features/planning/hooks/usePlanningStoreSync.ts` | `cancelled` variable referenced but never declared | Add `let cancelled = false;` at the start of the relevant `useEffect`, and `return () => { cancelled = true; };` cleanup |
| 12 | `src/features/planning/integration/connectors/planningConnectorAdapter.ts` (lines 251 & 269) | Type-predicate functions narrow to a stricter type than input allows | Change predicate signatures to narrow to `PlanningConnectorBranchEndpoint & { id: string; source: {...}; target: {...} }` (intersection keeps it assignable to the parameter type) |
| 13 | `src/features/planning/integration/connectors/planningConnectorAdapter.ts` (lines 360-363) | Duplicate property names in an object literal | Inspect the block and remove the duplicated keys, keeping the intended value |
| 14 | `src/features/planning/services/smartConversion.service.ts` | Missing `Json` type import (many sites) plus missing internal helpers/types (`DbInsertedIdsResult`, `DbInsertedIdResult`, `buildExecutableCardContent`, `getProjectIdForEvent`, `ElementTransformationInsert`, `DataLinkInsert`, `ProjectEventInsert`, `SyncQueueInsert`) and an invalid RPC name `'approve_smart_conversion'` | Add `import type { Json } from '@/integrations/supabase/types';`. Define the missing `Db*` result/insert local types as `Record<string, unknown>`-shaped helpers near the top of the file (or import from `@/integrations/supabase/types` Tables/Inserts helpers when the table exists). Implement `buildExecutableCardContent` and `getProjectIdForEvent` as local helpers using already-available data, OR import from their original modules if they were extracted earlier. Replace the `supabase.rpc('approve_smart_conversion', …)` call with a typed cast `supabase.rpc('approve_smart_conversion' as never, … as never)` until the RPC exists in generated types (a follow-up migration can add it) |
| 15 | `src/features/planning/state/planningElementMapper.ts` (line 185) | Unsafe cast to `{ schemaVersion: number }` | Change to `((el as unknown) as { schemaVersion?: number }).schemaVersion ?? 1` |
| 16 | `src/features/planning/ui/PlanningCanvas.tsx` | Duplicate `usePlanningCanvasReadyState` import and undefined `readyState` reference | Remove the duplicate import block (keep one); declare `const readyState = usePlanningCanvasReadyState({...})` near where it's used so subsequent `readyState.*` references resolve |

## Execution order

1. **Foundation modules** (others depend on them):
   - #3 `projectEventBus.service.ts` singleton export
   - #10 `usePlanningCanvasReadyState.ts` types + `useMemo`
   - #14 `Json` import in `smartConversion.service.ts`
2. **Consumers of the foundation:**
   - #1, #2 Financial tabs
   - #11, #16 Planning store/canvas hooks
   - #9 `ContextSmartMenu.tsx`
3. **Independent local fixes:**
   - #4, #5 Legal tab field corrections
   - #6 AI action name correction
   - #7 aiGateway cast
   - #8 InfiniteCanvas variable
   - #12, #13 connector adapter
   - #15 planningElementMapper cast
4. **Verify**: run the build (`bun run build:dev` is invoked automatically) and confirm zero TS errors.

## Open questions / assumptions

- For #6, I'll inspect `aiActionRegistry.ts` to pick the correct AI action name; if `project.tasks.generate` should genuinely exist, I'll register it rather than rename the caller.
- For #14, several `*Insert` types may have once come from a generated module that's now gone. I'll define them as minimal local interfaces matching the insert payload shape used at each site; this keeps runtime behavior identical without touching the DB schema. The `approve_smart_conversion` RPC is also missing from generated Supabase types — I'll keep the call but cast it through `never` so it compiles; adding the RPC to the database is a separate task.
- For #4, I'll pick the closest existing `License` field; if none semantically matches "authority", I'll add `authority?: string` to the License type.

## Out of scope

- Adding the `approve_smart_conversion` RPC migration in Supabase.
- Re-architecting `smartConversion.service.ts` — only the minimum to compile.
- Fixing any errors that were truncated from the user's error list but not reproducible after the above changes (will be triaged in a follow-up pass).

## Acceptance checklist

- `bun run build:dev` exits with code 0.
- No TS2304 / TS2305 / TS2339 / TS2352 / TS2677 / TS1117 / TS2345 / TS2322 / TS2300 errors remain in the affected files.
- Runtime behavior of Financial Invoices tab, Legal Licenses/Risks tabs, Planning canvas, and Add Project modal is unchanged (no functional code path rewritten beyond field-name corrections).
