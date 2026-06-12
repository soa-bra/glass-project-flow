import { beforeEach, describe, expect, it, vi } from "vitest";
import { approveSmartConversion } from "./smartConversion.service";

const supabaseMocks = vi.hoisted(() => ({
  rpc: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: supabaseMocks.rpc,
  },
}));

describe("approveSmartConversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates approval to the atomic database operation and returns its result", async () => {
    const rpcResult = {
      entity: {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Delivery project",
        state: "draft",
        priority: "medium",
      },
      linkedElements: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          board_id: "44444444-4444-4444-8444-444444444444",
          element_type: "entity_card",
          metadata: {
            linkedEntityType: "project",
            linkedEntityId: "33333333-3333-4333-8333-333333333333",
          },
          content: { title: "Delivery project" },
        },
      ],
      auditEventId: "99999999-9999-4999-8999-999999999999",
      traceReferences: {
        transformationIds: ["55555555-5555-4555-8555-555555555555"],
        dataLinkIds: ["66666666-6666-4666-8666-666666666666"],
        syncQueueId: "77777777-7777-4777-8777-777777777777",
        projectEventId: "88888888-8888-4888-8888-888888888888",
      },
    };
    supabaseMocks.rpc.mockResolvedValue({ data: rpcResult, error: null });

    const payload = {
      boardId: "44444444-4444-4444-8444-444444444444",
      sourceElementIds: ["22222222-2222-4222-8222-222222222222"],
      targetEntityType: "project" as const,
      suggestedData: {
        name: "Delivery project",
      },
      approval: {
        approved: true,
      },
    };

    const result = await approveSmartConversion(payload);

    expect(supabaseMocks.rpc).toHaveBeenCalledTimes(1);
    expect(supabaseMocks.rpc).toHaveBeenCalledWith("approve_smart_conversion", {
      p_payload: payload,
    });
    expect(result).toEqual(rpcResult);
  });

  it("does not call the database operation for unapproved payloads", async () => {
    await expect(
      approveSmartConversion({
        boardId: "44444444-4444-4444-8444-444444444444",
        sourceElementIds: ["22222222-2222-4222-8222-222222222222"],
        targetEntityType: "project",
        suggestedData: {
          name: "Delivery project",
        },
        approval: {
          approved: false,
        },
      }),
    ).rejects.toThrow("Smart conversion must be approved");

    expect(supabaseMocks.rpc).not.toHaveBeenCalled();
  });
});

const USER_ID = "11111111-1111-4111-8111-111111111111";
const BOARD_ID = "44444444-4444-4444-8444-444444444444";
const SOURCE_ID = "22222222-2222-4222-8222-222222222222";
const PROJECT_ID = "33333333-3333-4333-8333-333333333333";
const TASK_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("approveSmartConversion approval gates and task linking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMocks.authGetUser.mockResolvedValue({
      data: { user: { id: USER_ID } },
      error: null,
    });
    supabaseMocks.rpc.mockResolvedValue({ data: true, error: null });
  });

  it("does not create records when a note-to-task conversion has not been approved", async () => {
    await expect(
      approveSmartConversion({
        boardId: BOARD_ID,
        sourceElementIds: [SOURCE_ID],
        targetEntityType: "task",
        suggestedData: {
          linked_project_id: PROJECT_ID,
          name: "Follow up from note",
        },
        approval: { approved: false },
      }),
    ).rejects.toThrow("approved");

    expect(supabaseMocks.authGetUser).not.toHaveBeenCalled();
    expect(supabaseMocks.from).not.toHaveBeenCalled();
  });

  it("approving a note-to-task conversion creates the task and links planning metadata with linkedEntityId", async () => {
    const inserts: Record<string, unknown[]> = {};
    const updates: Record<string, unknown[]> = {};
    const rememberInsert = (table: string, payload: unknown) => {
      inserts[table] = [...(inserts[table] ?? []), payload];
    };
    const rememberUpdate = (table: string, payload: unknown) => {
      updates[table] = [...(updates[table] ?? []), payload];
    };

    function trackedQuery(table: string, resolvers: Partial<Record<string, QueryResolver>> = {}) {
      const query = createQuery(resolvers);
      const baseInsert = query.insert;
      const baseUpdate = query.update;
      query.insert = vi.fn((payload: unknown) => {
        rememberInsert(table, payload);
        return baseInsert(payload);
      });
      query.update = vi.fn((payload: unknown) => {
        rememberUpdate(table, payload);
        return baseUpdate(payload);
      });
      return query;
    }

    let planningElementsCall = 0;
    supabaseMocks.from.mockImplementation((table: string) => {
      if (table === "planning_boards") {
        return trackedQuery(table, {
          maybeSingle: async () => ({ data: { owner_id: USER_ID }, error: null }),
        });
      }

      if (table === "tasks") {
        return trackedQuery(table, {
          single: async () => ({
            data: {
              id: TASK_ID,
              linked_project_id: PROJECT_ID,
              name: "Follow up from note",
              state: "draft",
              priority: "high",
              estimated_cost: 1200,
            },
            error: null,
          }),
        });
      }

      if (table === "planning_elements") {
        planningElementsCall += 1;
        if (planningElementsCall === 1) {
          return trackedQuery(table, {
            in: async () => ({
              data: [
                {
                  id: SOURCE_ID,
                  board_id: BOARD_ID,
                  element_type: "sticky",
                  metadata: { source: "note" },
                  content: { title: "Follow up" },
                },
              ],
              error: null,
            }),
          });
        }

        return trackedQuery(table, {
          single: async () => ({
            data: {
              id: SOURCE_ID,
              board_id: BOARD_ID,
              element_type: "entity_card",
              metadata: {
                source: "note",
                linkedEntityType: "task",
                linkedEntityId: TASK_ID,
              },
              content: {
                title: "Follow up from note",
                linkedEntityType: "task",
                linkedEntityId: TASK_ID,
              },
            },
            error: null,
          }),
        });
      }

      if (table === "element_transformations") {
        return trackedQuery(table, {
          select: async () => ({ data: [{ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }], error: null }),
        });
      }

      if (table === "data_links") {
        return trackedQuery(table, {
          select: async () => ({ data: [{ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" }], error: null }),
        });
      }

      if (table === "sync_queue") {
        return trackedQuery(table, {
          single: async () => ({ data: { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd" }, error: null }),
        });
      }

      if (table === "project_events") {
        return trackedQuery(table, {
          single: async () => ({ data: { id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee" }, error: null }),
        });
      }

      if (table === "audit_events") {
        return trackedQuery(table, {
          single: async () => ({ data: { id: "ffffffff-ffff-4fff-8fff-ffffffffffff" }, error: null }),
        });
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const result = await approveSmartConversion({
      boardId: BOARD_ID,
      sourceElementIds: [SOURCE_ID],
      targetEntityType: "task",
      suggestedData: {
        linked_project_id: PROJECT_ID,
        name: "Follow up from note",
        priority: "high",
        estimated_cost: 1200,
      },
      approval: { approved: true },
    });

    expect(result.entity.id).toBe(TASK_ID);
    expect((inserts.tasks[0] as Record<string, unknown>)).toMatchObject({
      linked_project_id: PROJECT_ID,
      name: "Follow up from note",
      estimated_cost: 1200,
    });
    expect((updates.planning_elements[0] as Record<string, any>).metadata).toMatchObject({
      canvasType: "smart",
      smartType: "task_card",
      linkedEntityType: "task",
      linkedEntityId: TASK_ID,
    });
    expect(result.linkedElements[0].metadata).toMatchObject({
      linkedEntityId: TASK_ID,
    });
    expect(result.traceReferences.projectEventId).toBe("eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee");
  });

  it("keeps a sync_queue record for retry visibility when project event handling fails", async () => {
    const syncInserts: unknown[] = [];

    supabaseMocks.from.mockImplementation((table: string) => {
      if (table === "planning_boards") {
        return createQuery({ maybeSingle: async () => ({ data: { owner_id: USER_ID }, error: null }) });
      }
      if (table === "tasks") {
        return createQuery({ single: async () => ({ data: { id: TASK_ID, linked_project_id: PROJECT_ID, name: "Budget task", state: "draft", priority: "medium" }, error: null }) });
      }
      if (table === "planning_elements") {
        return createQuery({
          in: async () => ({ data: [{ id: SOURCE_ID, board_id: BOARD_ID, element_type: "sticky", metadata: {}, content: {} }], error: null }),
          single: async () => ({ data: { id: SOURCE_ID, board_id: BOARD_ID, element_type: "entity_card", metadata: { linkedEntityId: TASK_ID }, content: {} }, error: null }),
        });
      }
      if (table === "element_transformations") {
        return createQuery({ select: async () => ({ data: [{ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }], error: null }) });
      }
      if (table === "data_links") {
        return createQuery({ select: async () => ({ data: [{ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" }], error: null }) });
      }
      if (table === "sync_queue") {
        const query = createQuery({ single: async () => ({ data: { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd" }, error: null }) });
        const baseInsert = query.insert;
        query.insert = vi.fn((payload: unknown) => {
          syncInserts.push(payload);
          return baseInsert(payload);
        });
        return query;
      }
      if (table === "project_events") {
        return createQuery({ single: async () => ({ data: null, error: new Error("handler failed") }) });
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    await expect(
      approveSmartConversion({
        boardId: BOARD_ID,
        sourceElementIds: [SOURCE_ID],
        targetEntityType: "task",
        suggestedData: { linked_project_id: PROJECT_ID, name: "Budget task", estimated_cost: 2000 },
        approval: { approved: true },
      }),
    ).rejects.toThrow("handler failed");

    expect(syncInserts).toHaveLength(1);
    expect(syncInserts[0]).toMatchObject({
      board_id: BOARD_ID,
      project_id: PROJECT_ID,
      entity_table: "tasks",
      entity_id: TASK_ID,
      status: "pending",
      operation: "planning.smart_conversion.approved",
    });
  });
});
