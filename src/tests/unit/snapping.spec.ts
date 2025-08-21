import { describe, it, expect } from "vitest";
import { snapPoint } from "@/src/features/planning/utils/snapping";

describe("snapping", () => {
  it("snaps to grid", () => {
    expect(snapPoint({x:7,y:9}, 8)).toEqual({x:8, y:8});
    expect(snapPoint({x:15,y:17}, 8)).toEqual({x:16, y:16});
  });
});
