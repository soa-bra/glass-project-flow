import { describe, it, expect } from "vitest";
import { BoardSchema, FrameSchema, WidgetSchema, ConnectorSchema } from "@/src/schemas";

describe("schemas", () => {
  it("board validates", () => {
    const b = BoardSchema.parse({ id:"b1", name:"Demo", ownerId:"u1" });
    expect(b.id).toBe("b1");
  });
  it("frame requires positive size", () => {
    expect(()=> FrameSchema.parse({ id:"f1", name:"F", x:0, y:0, w:0, h:10, boardId:"b1" }))
      .toThrow();
  });
  it("widget minimal", () => {
    const w = WidgetSchema.parse({
      id:"w1", type:"shape", parentId:null, x:0,y:0,w:10,h:10, zIndex:0,
      createdBy:"u1", updatedAt: Date.now()
    });
    expect(w.type).toBe("shape");
  });
  it("connector valid", () => {
    const c = ConnectorSchema.parse({ id:"c1", sourceId:"w1", targetId:"w2", boardId:"b1" });
    expect(c.id).toBe("c1");
  });
});
