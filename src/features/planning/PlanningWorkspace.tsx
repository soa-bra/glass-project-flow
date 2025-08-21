import React, { useEffect } from "react";
import { PlanningPanel } from "./PlanningPanel";
import { useCanvasStore } from "./store/canvas.store"; // إذا اسم الاستور مختلف عندك عدله

export default function PlanningWorkspace() {
  const init = useCanvasStore((s:any)=> s.init);
  const widgets = useCanvasStore((s:any)=> s.scene?.widgets ?? []);
  const frames  = useCanvasStore((s:any)=> s.scene?.frames ?? []);

  useEffect(() => {
    // لو المشهد فاضي نضيف إطار وعنصرين تجريبيين
    if (!frames?.length && !widgets?.length) {
      init({
        frames: [{ id: "frame_main", name: "Frame A", x: 80, y: 80, w: 1200, h: 700, boardId: "b1" }],
        widgets: [
          { id: "w1", type: "shape", parentId: "frame_main", x: 160, y: 160, w: 200, h: 120, zIndex: 1,
            style:{ fill:"#ffffff", stroke:"#111", radius:12 }, data:{ text:"مرحبا 👋" }, createdBy:"seed", updatedAt: Date.now()
          },
          { id: "w2", type: "sticky", parentId: "frame_main", x: 420, y: 220, w: 180, h: 120, zIndex: 2,
            style:{ fill:"#FFD86B", stroke:"#333", radius:8 }, data:{ text:"ابدأ من هنا" }, createdBy:"seed", updatedAt: Date.now()
          }
        ],
        connectors: [{ id:"c1", sourceId:"w1", targetId:"w2", boardId:"b1" }]
      });
    }
  }, [init, frames?.length, widgets?.length]);

  return (
    <div data-testid="planning-workspace" className="w-full h-full">
      <PlanningPanel />
    </div>
  );
}
