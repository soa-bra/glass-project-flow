import { useEffect } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { isTypingTarget } from "./canvasUtils";

export function useCanvasKeyboard() {
  const store = useCanvasStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (store.typingMode) return;

      if (e.key === "Escape") {
        store.clearSelection();
        store.setActiveTool("selection_tool");
      }
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as any);
  }, [store]);
}
