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

  it("taskCreateSchema enforces title + linked_project_id", () => {
    expect(
      taskCreateSchema.safeParse({ title: "T" }).success,
    ).toBe(false);
    expect(
      taskCreateSchema.safeParse({
        title: "Design review",
        linked_project_id: "00000000-0000-0000-0000-000000000000",
      }).success,
    ).toBe(true);
  });

  it("taskCreateSchema rejects invalid priority", () => {
    const res = taskCreateSchema.safeParse({
      title: "x",
      linked_project_id: "00000000-0000-0000-0000-000000000000",
      priority: "urgent",
    });
    expect(res.success).toBe(false);
  });

  it("departmentCreateSchema requires a name", () => {
    expect(departmentCreateSchema.safeParse({}).success).toBe(false);
    expect(departmentCreateSchema.safeParse({ name: "Marketing" }).success).toBe(true);
  });

  it("centralBoardCreateSchema requires a name", () => {
    expect(centralBoardCreateSchema.safeParse({}).success).toBe(false);
    expect(centralBoardCreateSchema.safeParse({ name: "Ops" }).success).toBe(true);
  });

  it("toolCreateSchema requires name + kind", () => {
    expect(toolCreateSchema.safeParse({ name: "x" }).success).toBe(false);
    expect(
      toolCreateSchema.safeParse({ name: "Exporter", kind: "exporter" }).success,
    ).toBe(true);
  });

  it("engineJobCreateSchema requires name + kind", () => {
    expect(engineJobCreateSchema.safeParse({}).success).toBe(false);
    expect(
      engineJobCreateSchema.safeParse({ name: "Replay", kind: "event_replay" })
        .success,
    ).toBe(true);
  });
});
