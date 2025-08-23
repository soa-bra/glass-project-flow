import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ToolId, GridSettings } from "../types/panels";

type ToolCtx = {
  activeTool: ToolId;
  setActiveTool: (t: ToolId) => void;
  grid: GridSettings;
  setGrid: (g: GridSettings) => void;
  openHistoryList: () => void;
};

const ToolContext = createContext<ToolCtx | null>(null);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const [activeTool, setActiveTool] = useState<ToolId>("selection_tool");
  const [grid, setGrid] = useState<GridSettings>({
    visible: false,
    snap: false,
    size: 16,
    type: "dots",
  });

  const openHistoryList = useCallback(() => {
    const evt = new CustomEvent("soabra:open-history-list");
    window.dispatchEvent(evt);
  }, []);

  const value = useMemo(() => ({ activeTool, setActiveTool, grid, setGrid, openHistoryList }), [activeTool, grid, openHistoryList]);
  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
}

export function useTooling() {
  const ctx = useContext(ToolContext);
  if (!ctx) throw new Error("useTooling must be used within ToolProvider");
  return ctx;
}
