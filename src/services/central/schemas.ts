/**
 * Central Schemas — Public barrel for Zod validators (P2).
 *
 * The canonical definitions live in `@/types/central` so that the Row/Insert/
 * Update database types and their Zod input schemas stay co-located. This
 * barrel exists to satisfy the P2 spec (`src/services/central/schemas.ts`)
 * and gives feature code a stable import path.
 *
 * Import via `@/services/central/schemas` for runtime validation, or
 * `@/types/central` for both types + schemas in one shot.
 */
export {
  projectCreateSchema,
  projectUpdateSchema,
  taskCreateSchema,
  taskUpdateSchema,
  departmentCreateSchema,
  centralBoardCreateSchema,
  toolCreateSchema,
  engineJobCreateSchema,
} from "@/types/central";

export type {
  ProjectCreateInput,
  ProjectUpdateInput,
  TaskCreateInput,
  TaskUpdateInput,
  DepartmentCreateInput,
  CentralBoardCreateInput,
  ToolCreateInput,
  EngineJobCreateInput,
} from "@/types/central";

export {
  planningBoardCreateSchema,
  planningBoardUpdateSchema,
  planningElementCreateSchema,
  planningElementUpdateSchema,
} from "./planningBoards.service";
