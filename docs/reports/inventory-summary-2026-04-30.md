# Inventory Summary — 2026-04-30

## Scope
- Static inventory across `src/` to seed Phase 1 of the cleanup plan.
- Focus: naming collisions, likely duplication hotspots, and execution blockers.

## Key Findings
1. **Large monorepo-style frontend surface** with >1000 source files and mixed domains in a single app tree.
2. **High duplicate filename density** across domain folders (e.g., many `OverviewTab.tsx`, `ReportsTab.tsx`, `TemplatesTab.tsx`).
3. **Potential functional duplicates** discovered by path/name overlap:
   - `src/components/ProjectPanel/ExpenseModal.tsx`
   - `src/components/custom/ExpenseModal.tsx`
   - `src/features/planning/elements/diagram/ShapeRenderer.tsx`
   - `src/features/planning/elements/shared/ShapeRenderer.tsx`
   - `src/engine/canvas/math/snapEngine.ts`
   - `src/engine/canvas/interaction/snapEngine.ts`
4. **Validation pipeline partially blocked** in current environment:
   - `typecheck` passes.
   - `lint` blocked by missing module resolution (`@eslint/js`) due to dependency installation restriction.

## Immediate Priority Buckets
- **P0 (Safety/Correctness):** canvas engines/hook call-sites, duplicated core renderers/engines.
- **P1 (Maintainability):** duplicated modal/tab implementations with similar responsibilities.
- **P2 (Hygiene):** naming normalization and index/export hygiene.

## Next Outputs to Produce
- `duplication-matrix.md` (implemented in this batch).
- `hooks-callgraph.md` (implemented in this batch, initial pass).
- Follow-up automated unused-export report after CI dependency fix.
