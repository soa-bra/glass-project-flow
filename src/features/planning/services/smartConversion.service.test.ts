import { beforeEach, describe, expect, it, vi } from "vitest";
import { approveSmartConversion } from "./smartConversion.service";

const supabaseMocks = vi.hoisted(() => ({
  authGetUser: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: supabaseMocks.authGetUser,
    },
    from: supabaseMocks.from,
    rpc: supabaseMocks.rpc,
  },
}));

type QueryResolver = () => Promise<unknown>;

function createQuery(resolvers: Partial<Record<string, QueryResolver>> = {}) {
  const query: any = {
    insertPayload: undefined,
    updatePayload: undefined,
    select: vi.fn(() => resolvers.select?.() ?? query),
    eq: vi.fn(() => query),
    insert: vi.fn((payload: unknown) => {
      query.insertPayload = payload;
      return query;
    }),
    update: vi.fn((payload: unknown) => {
      query.updatePayload = payload;
      return query;
    }),
    in: vi.fn(() => resolvers.in?.() ?? Promise.resolve({ data: null, error: null })),
    maybeSingle: vi.fn(() => resolvers.maybeSingle?.() ?? Promise.resolve({ data: null, error: null })),
    single: vi.fn(() => resolvers.single?.() ?? Promise.resolve({ data: null, error: null })),
  };

  return query;
}

describe("approveSmartConversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMocks.authGetUser.mockResolvedValue({
      data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
      error: null,
    });
    supabaseMocks.rpc.mockResolvedValue({ data: true, error: null });
  });

  it("returns trace references for the required conversion records", async () => {
    let planningElementsCall = 0;

    supabaseMocks.from.mockImplementation((table: string) => {
      if (table === "planning_boards") {
        return createQuery({
          maybeSingle: async () => ({
            data: { owner_id: "11111111-1111-4111-8111-111111111111" },
            error: null,
          }),
        });
      }

      if (table === "projects") {
        return createQuery({
          single: async () => ({
            data: {
              id: "33333333-3333-4333-8333-333333333333",
              name: "Delivery project",
              state: "draft",
              priority: "medium",
            },
            error: null,
          }),
        });
      }

      if (table === "planning_elements") {
        planningElementsCall += 1;
        if (planningElementsCall === 1) {
          return createQuery({
            in: async () => ({
              data: [
                {
                  id: "22222222-2222-4222-8222-222222222222",
                  board_id: "44444444-4444-4444-8444-444444444444",
                  element_type: "sticky",
                  metadata: {},
                  content: { title: "Source idea" },
                },
              ],
              error: null,
            }),
          });
        }

        return createQuery({
          single: async () => ({
            data: {
              id: "22222222-2222-4222-8222-222222222222",
              board_id: "44444444-4444-4444-8444-444444444444",
              element_type: "entity_card",
              metadata: {
                linkedEntityType: "project",
                linkedEntityId: "33333333-3333-4333-8333-333333333333",
              },
              content: { title: "Delivery project" },
            },
            error: null,
          }),
        });
      }

      if (table === "element_transformations") {
        return createQuery({
          select: async () => ({
            data: [{ id: "55555555-5555-4555-8555-555555555555" }],
            error: null,
          }),
        });
      }

      if (table === "data_links") {
        return createQuery({
          select: async () => ({
            data: [{ id: "66666666-6666-4666-8666-666666666666" }],
            error: null,
          }),
        });
      }

      if (table === "sync_queue") {
        return createQuery({
          single: async () => ({
            data: { id: "77777777-7777-4777-8777-777777777777" },
            error: null,
          }),
        });
      }

      if (table === "project_events") {
        return createQuery({
          single: async () => ({
            data: { id: "88888888-8888-4888-8888-888888888888" },
            error: null,
          }),
        });
      }

      if (table === "audit_events") {
        return createQuery({
          single: async () => ({
            data: { id: "99999999-9999-4999-8999-999999999999" },
            error: null,
          }),
        });
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const result = await approveSmartConversion({
      boardId: "44444444-4444-4444-8444-444444444444",
      sourceElementIds: ["22222222-2222-4222-8222-222222222222"],
      targetEntityType: "project",
      suggestedData: {
        name: "Delivery project",
      },
      approval: {
        approved: true,
      },
    });

    expect(result.entity.id).toBe("33333333-3333-4333-8333-333333333333");
    expect(result.linkedElements).toHaveLength(1);
    expect(result.auditEventId).toBe("99999999-9999-4999-8999-999999999999");
    expect(result.traceReferences).toEqual({
      transformationIds: ["55555555-5555-4555-8555-555555555555"],
      dataLinkIds: ["66666666-6666-4666-8666-666666666666"],
      syncQueueId: "77777777-7777-4777-8777-777777777777",
      projectEventId: "88888888-8888-4888-8888-888888888888",
    });
  });
});
