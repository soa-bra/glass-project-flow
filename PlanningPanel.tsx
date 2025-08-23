import React from "react";
import TopToolbar from "./TopToolbar";
import BottomToolbar from "./BottomToolbar";
import SelectionPanel from "./SelectionPanel";
import SmartPenPanel from "./SmartPenPanel";
import ZoomPanel from "./ZoomPanel";
import PanPanel from "./PanPanel";
import FileUploadPanel from "./FileUploadPanel";
import CommentPanel from "./CommentPanel";
import TextPanel from "./TextPanel";
import ShapesPanel from "./ShapesPanel";
import SmartElementsPanel from "./SmartElementsPanel";
import RootLinkPanel from "./RootLinkPanel";
import SmartAssistantPanel from "./SmartAssistantPanel";
import CollaborationPanel from "./CollaborationPanel";
import { ToolProvider, useTooling } from "./ToolState";
import type { GridSettings, ToolId } from "./panels";
import { LiveCursorsOverlay } from "./LiveCursorsOverlay";

// Map between active tool and corresponding inspector component
const panelMap: Record<ToolId, React.ComponentType | undefined> = {
  selection_tool: SelectionPanel,
  smart_pen: SmartPenPanel,
  zoom_tool: ZoomPanel,
  pan_tool: PanPanel,
  file_uploader: FileUploadPanel,
  comment_tool: CommentPanel,
  text_tool: TextPanel,
  shapes_tool: ShapesPanel,
  smart_element_tool: SmartElementsPanel,
  root_link_tool: RootLinkPanel,
};

// Render grid background depending on settings
function gridBackground(g: GridSettings): string {
  const size = g.size;
  switch (g.type) {
    case "grid":
      return `linear-gradient(#e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px,
              linear-gradient(90deg, #e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px`;
    case "isometric":
      return `linear-gradient(30deg, #e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px,
              linear-gradient(150deg, #e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px,
              linear-gradient(90deg, #e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px`;
    case "hex": {
      const h = size * 0.866; // height of hexagon
      return `radial-gradient(circle, #e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${h}px,
              radial-gradient(circle, #e5e7eb 1px, transparent 1px) ${size / 2}px ${h / 2}px/ ${size}px ${h}px`;
    }
    case "dots":
    default:
      return `radial-gradient(#e5e7eb 1px, transparent 1px) 0 0/ ${size}px ${size}px`;
  }
}

function CanvasSurface() {
  const { grid } = useTooling();
  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: grid.visible ? gridBackground(grid) : "#fff",
    backgroundColor: grid.visible ? undefined : "#fff",
  };
  return <div style={style} />;
}

function InnerPanel() {
  const { activeTool } = useTooling();
  const Inspector = panelMap[activeTool];
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Canvas placeholder */}
      <CanvasSurface />
      {/* live cursors overlay (camera origin at 0,0 for now) */}
      <LiveCursorsOverlay camera={{ x: 0, y: 0 }} />
      {/* Toolbars */}
      <TopToolbar canUndo={false} canRedo={false} undo={() => {}} redo={() => {}} />
      <BottomToolbar />
      {/* Right side panels */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          bottom: 8,
          width: 280,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#ffffffd9",
            backdropFilter: "blur(8px)",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
          }}
        >
          {Inspector ? <Inspector /> : null}
        </div>
        <SmartAssistantPanel />
        <CollaborationPanel />
      </div>
    </div>
  );
}

export default function PlanningPanel() {
  return (
    <ToolProvider>
      <InnerPanel />
    </ToolProvider>
  );
}

