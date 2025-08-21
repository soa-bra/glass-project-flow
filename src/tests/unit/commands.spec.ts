import { describe, it, expect } from "vitest";
import { insertCommand } from "@/src/modules/commands/insert";
import { moveCommand } from "@/src/modules/commands/move";

describe("commands", () => {
  it("insert adds a widget", () => {
    const state = { widgets: [] as any[] };
    const res = insertCommand(state, { id:"w1", x:0, y:0, w:100, h:60, type:"shape" });
    expect(res.widgets.find(w=>w.id==="w1")).toBeTruthy();
  });
  it("move shifts by dx/dy", () => {
    const state = { widgets: [{id:"w1", x:0,y:0,w:10,h:10}] as any[] };
    const res = moveCommand(state, { ids:["w1"], dx:5, dy:-3 });
    const w = res.widgets.find((n:any)=>n.id==="w1");
    expect(w.x).toBe(5); expect(w.y).toBe(-3);
  });
});
