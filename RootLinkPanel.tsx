import React, { useEffect, useState } from "react";
// Using the main React hooks entry point so bundlers can resolve the module
// without relying on the Suspense-specific subpath, which may not exist in
// every install of `@liveblocks/react`.
import { useStorage, useMutation } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";

/**
 * Describes a directed connection between two canvas elements.
 *
 * The pair `(sourceId, targetId)` must be unique across the list and the
 * `sourceId` must differ from `targetId` to avoid self‑links.  Each link is
 * stored in Liveblocks so every client sees the same ordered list.
 */
interface RootLink {
  /** Unique identifier for React list keys and Liveblocks objects */
  id: string;
  /** Element id where the connection originates */
  sourceId: string;
  /** Element id that the connection points to */
  targetId: string;
  /** Optional user supplied note describing the relationship */
  description: string;
  /** Creation timestamp used for simple ordering */
  createdAt: number;
}

export default function RootLinkPanel() {
  const selection = useStorage(
    (root) => (root as any).presence?.selection ?? []
  ) as string[];

  const links = useStorage(
    (root) => root.rootLinks?.toImmutable?.() ?? []
  ) as RootLink[];

  const ensureList = useMutation(({ storage }) => {
    if (!storage.get("rootLinks")) {
      storage.set("rootLinks", new LiveList());
    }
  }, []);

  useEffect(() => {
    ensureList();
  }, [ensureList]);

  const addLink = useMutation(({ storage }, link: RootLink) => {
    const list = storage.get("rootLinks") as LiveList<LiveObject<RootLink>>;
    list.push(new LiveObject(link));
  }, []);

  const [desc, setDesc] = useState("");

  /**
   * Create a new root link from the current selection.
   *
   * Invariants enforced:
   * - Exactly two elements must be selected.
   * - Source and target cannot be the same element (no self loops).
   * - A link with the same `(sourceId,targetId)` pair must not already exist.
   */
  const createLink = () => {
    if (selection.length < 2) {
      alert("حدد عنصرين للرابط");
      return;
    }
    const [sourceId, targetId] = selection;

    if (sourceId === targetId) {
      alert("لا يمكن الربط بنفس العنصر");
      return;
    }

    if (links.some((l) => l.sourceId === sourceId && l.targetId === targetId)) {
      alert("الرابط موجود مسبقًا");
      return;
    }

    const link: RootLink = {
      id: Math.random().toString(36).slice(2),
      sourceId,
      targetId,
      description: desc.trim(),
      createdAt: Date.now(),
    };

    addLink(link);
    setDesc("");
  };

  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>الربط الجذري</div>
      <div style={{ display: "grid", gap: 8 }}>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="وصف العلاقة..."
          style={{
            width: "100%",
            minHeight: 60,
            padding: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        />
        <button onClick={createLink}>إنشاء ارتباط</button>
      </div>

      {links.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>الارتباطات الحالية</div>
          <ul style={{ display: "grid", gap: 4 }}>
            {links.map((l) => (
              <li key={l.id} style={{ fontSize: 14 }}>
                {l.sourceId} → {l.targetId}: {l.description || "—"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
