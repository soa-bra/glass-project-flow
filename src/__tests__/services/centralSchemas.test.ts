/**
 * Central Schemas — Zod validation tests (P2).
 *
 * Locks the create/update schema contracts for the central services so that
 * accidental relaxations (or required-field removals) are caught in CI.
 */
import { describe, expect, it } from "vitest";
import {
  centralBoardCreateSchema,
  departmentCreateSchema,
  engineJobCreateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  taskCreateSchema,
  toolCreateSchema,
} from "@/services/central/schemas";

const UUID = "00000000-0000-0000-0000-000000000000";

describe("central schemas", () => {
  it("projectCreateSchema requires a name", () => {
    expect(projectCreateSchema.safeParse({}).success).toBe(false);
    expect(projectCreateSchema.safeParse({ name: "Apollo" }).success).toBe(true);
  });

  it("projectUpdateSchema accepts partial patches", () => {
    expect(projectUpdateSchema.safeParse({}).success).toBe(true);
    expect(
      projectUpdateSchema.safeParse({ name: "x", priority: "high" }).success,
    ).toBe(true);
  });

  it("taskCreateSchema enforces name + linked_project_id", () => {
    expect(taskCreateSchema.safeParse({ name: "T" }).success).toBe(false);
    expect(
      taskCreateSchema.safeParse({
        name: "Design review",
        linked_project_id: UUID,
      }).success,
    ).toBe(true);
  });

  it("taskCreateSchema rejects invalid priority", () => {
    const res = taskCreateSchema.safeParse({
      name: "x",
      linked_project_id: UUID,
      priority: "urgent",
    });
    expect(res.success).toBe(false);
  });

  it("departmentCreateSchema requires name + code", () => {
    expect(departmentCreateSchema.safeParse({ name: "Marketing" }).success).toBe(false);
    expect(
      departmentCreateSchema.safeParse({ name: "Marketing", code: "MKT" }).success,
    ).toBe(true);
  });

  it("centralBoardCreateSchema requires name + code", () => {
    expect(centralBoardCreateSchema.safeParse({ name: "Ops" }).success).toBe(false);
    expect(
      centralBoardCreateSchema.safeParse({ name: "Ops", code: "OPS" }).success,
    ).toBe(true);
  });

  it("toolCreateSchema requires name + kind + central_board_id", () => {
    expect(toolCreateSchema.safeParse({ name: "x", kind: "workflow_tool" }).success).toBe(false);
    expect(
      toolCreateSchema.safeParse({
        name: "Exporter",
        kind: "workflow_tool",
        central_board_id: UUID,
      }).success,
    ).toBe(true);
  });

  it("engineJobCreateSchema requires name + kind", () => {
    expect(engineJobCreateSchema.safeParse({}).success).toBe(false);
    expect(
      engineJobCreateSchema.safeParse({ name: "Replay", kind: "automation" })
        .success,
    ).toBe(true);
  });
});
