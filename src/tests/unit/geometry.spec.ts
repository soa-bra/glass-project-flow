import { describe, it, expect } from "vitest";
import { clamp, rectIntersects } from "@/src/features/planning/utils/geometry";

describe("geometry", () => {
  it("clamp works", () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });
  it("rectIntersects detects overlap", () => {
    expect(rectIntersects({x:0,y:0,w:10,h:10}, {x:5,y:5,w:10,h:10})).toBe(true);
    expect(rectIntersects({x:0,y:0,w:2,h:2}, {x:5,y:5,w:1,h:1})).toBe(false);
  });
});
