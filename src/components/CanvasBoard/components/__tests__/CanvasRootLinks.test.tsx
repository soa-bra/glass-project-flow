import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Canvas } from "../Canvas/Canvas";

// mock hooks used by Canvas
const elements = [
  {
    id: "a",
    position: { x: 10, y: 20 },
    size: { width: 30, height: 40 },
    type: "rect",
  },
  {
    id: "b",
    position: { x: 110, y: 120 },
    size: { width: 30, height: 40 },
    type: "rect",
  },
];

let rootLinksData: any[] = [];

vi.mock("@liveblocks/react/suspense", () => ({
  useStorage: (selector: any) =>
    selector({ rootLinks: { toImmutable: () => rootLinksData } }),
}));

vi.mock("../../hooks/useCanvasElements", () => ({
  useCanvasElements: () => ({
    elements,
    addElement: () => {},
    updateElement: () => {},
    deleteElement: () => {},
  }),
}));

vi.mock("../../hooks/useCanvasHistory", () => ({
  useCanvasHistory: () => ({ saveToHistory: () => {} }),
}));

vi.mock("../../hooks/useUnifiedSelection", () => ({
  useUnifiedSelection: () => ({
    selectedElementIds: [],
    isSelected: () => false,
    clearSelection: () => {},
    selectMultiple: () => {},
    selectElement: () => {},
  }),
}));

vi.mock("../../hooks/useSimplifiedCanvasInteraction", () => ({
  useSimplifiedCanvasInteraction: () => ({}),
}));

vi.mock("../../hooks/useRefactoredCanvasEventHandlers", () => ({
  useRefactoredCanvasEventHandlers: () => ({
    handleCanvasMouseDown: () => {},
    handleCanvasMouseMove: () => {},
    handleCanvasMouseUp: () => {},
    handleCanvasClick: () => {},
    handleWheelZoom: () => {},
    enhancedSmartPenTool: null,
    toolCursor: { getCursorStyle: () => "default" },
    handleElementMouseDown: () => {},
    handleElementMouseMove: () => {},
    handleElementMouseUp: () => {},
  }),
}));

vi.mock("../CanvasElement", () => ({ CanvasElement: () => null }));
vi.mock("../SimplifiedSelectionBoundingBox", () => ({ SimplifiedSelectionBoundingBox: () => null }));
vi.mock("../CanvasDiagnostics", () => ({ CanvasDiagnostics: () => null }));
vi.mock("../Canvas/InfiniteCanvas", () => ({
  InfiniteCanvas: React.forwardRef(({ children }: any) => <div>{children}</div>),
  InfiniteCanvasRef: {} as any,
}));

describe("Canvas root link rendering", () => {
  beforeEach(() => {
    rootLinksData = [];
  });
  const baseProps = {
    selectedTool: "",
    selectedSmartElement: "",
    zoom: 100,
    canvasPosition: { x: 0, y: 0 },
    showGrid: false,
    snapEnabled: false,
  };

    it("renders line between linked elements", () => {
      rootLinksData = [
        { id: "1", sourceId: "a", targetId: "b", description: "", createdAt: 0 },
      ];
      const { container } = render(<Canvas {...baseProps} />);
      const line = container.querySelector("line");
    expect(line).toBeInTheDocument();
    expect(line?.getAttribute("x1")).toBe("25");
    expect(line?.getAttribute("y1")).toBe("40");
    expect(line?.getAttribute("x2")).toBe("125");
    expect(line?.getAttribute("y2")).toBe("140");
  });

    it("renders nothing when targets are missing", () => {
      rootLinksData = [
        { id: "1", sourceId: "a", targetId: "missing", description: "", createdAt: 0 },
      ];
      const { container } = render(<Canvas {...baseProps} />);
      expect(container.querySelectorAll("line").length).toBe(0);
    });

    it("deduplicates mirrored links", () => {
      rootLinksData = [
        { id: "1", sourceId: "a", targetId: "b", description: "", createdAt: 0 },
        { id: "2", sourceId: "b", targetId: "a", description: "", createdAt: 0 },
      ];
      const { container } = render(<Canvas {...baseProps} />);
      expect(container.querySelectorAll("line").length).toBe(1);
    });

    it("skips self links", () => {
      rootLinksData = [
        { id: "1", sourceId: "a", targetId: "a", description: "", createdAt: 0 },
      ];
      const { container } = render(<Canvas {...baseProps} />);
      expect(container.querySelectorAll("line").length).toBe(0);
    });
  });
