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
