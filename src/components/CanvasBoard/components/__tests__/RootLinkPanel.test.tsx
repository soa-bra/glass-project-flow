import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import RootLinkPanel from "../../../../RootLinkPanel";
import { LiveList, LiveObject } from "@liveblocks/client";

// Mock liveblocks hooks
let selection: string[] = [];
let rootLinksList: LiveList<LiveObject<any>> | undefined;

vi.mock("@liveblocks/react", () => ({
  useStorage: (selector: any) =>
    selector({
      presence: { selection },
      rootLinks: rootLinksList ?? { toImmutable: () => [] },
    }),
  useMutation: (fn: any) =>
    (...args: any[]) =>
      fn(
        {
          storage: {
            get: (key: string) =>
              key === "rootLinks" ? rootLinksList : undefined,
            set: (key: string) => {
              if (key === "rootLinks") {
                rootLinksList = new LiveList<LiveObject<any>>();
              }
            },
          },
        },
        ...args,
      ),
}));

vi.mock("@liveblocks/client", () => {
  class LiveObject<T> {
    constructor(private data: T) {}
    toImmutable() {
      return this.data;
    }
  }
  class LiveList<T> {
    private items: T[] = [];
    push(item: T) {
      this.items.push(item);
    }
    get length() {
      return this.items.length;
    }
    get(index: number) {
      return (this.items as any)[index];
    }
    toImmutable() {
      return (this.items as any).map((i: any) =>
        i.toImmutable ? i.toImmutable() : i,
      );
    }
  }
  return { LiveObject, LiveList };
});

describe("RootLinkPanel", () => {
  beforeEach(() => {
    selection = [];
    rootLinksList = undefined;
  });

  it("stores a new root link when two elements are selected", () => {
    selection = ["a", "b"];
    const { getByPlaceholderText, getByText } = render(<RootLinkPanel />);
    fireEvent.change(getByPlaceholderText("وصف العلاقة..."), {
      target: { value: "rel" },
    });
    fireEvent.click(getByText("إنشاء ارتباط"));
    expect(rootLinksList?.length).toBe(1);
    const stored = (rootLinksList?.get(0) as LiveObject<any>).toImmutable();
    expect(stored).toMatchObject({
      sourceId: "a",
      targetId: "b",
      description: "rel",
    });
  });

  it("alerts and does not store link when selection is insufficient", () => {
    selection = ["a"];
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { getByText } = render(<RootLinkPanel />);
    fireEvent.click(getByText("إنشاء ارتباط"));
    expect(rootLinksList).toBeUndefined();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("prevents duplicate links", () => {
    selection = ["a", "b"];
    rootLinksList = new LiveList<LiveObject<any>>();
    rootLinksList.push(new LiveObject({
      id: "1",
      sourceId: "a",
      targetId: "b",
      description: "",
      createdAt: 0,
    }));
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { getByText } = render(<RootLinkPanel />);
    fireEvent.click(getByText("إنشاء ارتباط"));
    expect(rootLinksList.length).toBe(1);
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("prevents circular links", () => {
    selection = ["a", "a"];
    rootLinksList = new LiveList<LiveObject<any>>();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { getByText } = render(<RootLinkPanel />);
    fireEvent.click(getByText("إنشاء ارتباط"));
    expect(rootLinksList.length).toBe(0);
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
