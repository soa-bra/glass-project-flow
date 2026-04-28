import { describe, expect, it } from "vitest";
import { assertBackwardCompatibleChange, ProjectCreatedV1 } from "./contracts";
import { validateCommandInput, validateEventInput } from "./validation";
import { z } from "zod";

describe("shared events validation", () => {
  it("enforces mandatory governance fields for events with defaults", () => {
    const result = validateEventInput({
      name: "ProjectCreated",
      version: 1,
      payload: {
        project_id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Project Aurora",
        client_id: "550e8400-e29b-41d4-a716-446655440001",
        project_type: "research",
        budget: 10000,
        start_date: "2026-01-10",
        end_date: "2026-04-10",
        assigned_team: ["550e8400-e29b-41d4-a716-446655440002"],
        created_by: "550e8400-e29b-41d4-a716-446655440003",
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBeTruthy();
      expect(result.data.state).toBe("active");
      expect(result.data.audit.created_by).toBe("system");
      expect(result.data.links).toEqual([]);
      expect(result.data.board_refs).toEqual([]);
    }
  });

  it("validates command payload contracts", () => {
    const result = validateCommandInput({
      name: "ApproveExpense",
      version: 1,
      payload: {
        expense_id: "550e8400-e29b-41d4-a716-446655440010",
        approver_id: "550e8400-e29b-41d4-a716-446655440011",
      },
    });

    expect(result.ok).toBe(true);
  });

  it("reports incompatible schema changes", () => {
    const next = ProjectCreatedV1.extend({ extra_note: z.string().optional() });
    const removed = next.omit({ name: true });

    const compatibility = assertBackwardCompatibleChange(ProjectCreatedV1, removed);
    expect(compatibility.compatible).toBe(false);
    expect(compatibility.reasons[0]).toContain("Removed fields are breaking");
  });
});
