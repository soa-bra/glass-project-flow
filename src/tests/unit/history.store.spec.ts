import { describe, it, expect } from "vitest";
import { useHistoryStore } from "@/src/features/planning/store/history.store";
import { act } from "react-dom/test-utils";

describe("history.store", () => {
  it("push and undo/redo", () => {
    const st = useHistoryStore.getState();
    act(()=> st.push({ label:"init", snapshot:{ frames:[], widgets:[], connectors:[] } as any }));
    const before = st.pointer;
    act(()=> st.undo());
    expect(useHistoryStore.getState().pointer).toBe(before - 1);
    act(()=> st.redo());
    expect(useHistoryStore.getState().pointer).toBe(before);
  });
});
