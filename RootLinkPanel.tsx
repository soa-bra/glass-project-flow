import React, { useEffect, useState } from "react";
import { useStorage, useMutation } from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";

interface RootLink {
  id: string;
  sourceId: string;
  targetId: string;
  description: string;
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

  const createLink = () => {
    if (selection.length < 2) {
      alert("حدد عنصرين للرابط");
      return;
    }

    const link: RootLink = {
      id: Math.random().toString(36).slice(2),
      sourceId: selection[0],
      targetId: selection[1],
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
