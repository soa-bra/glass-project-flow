import React from "react";
import TopToolbar from "./TopToolbar";
import BottomToolbar from "./BottomToolbar";
import SelectionPanel from "./SelectionPanel";
import SmartPenPanel from "./SmartPenPanel";
import FileUploadPanel from "./FileUploadPanel";
import CommentPanel from "./CommentPanel";
import TextPanel from "./TextPanel";
import ShapesPanel from "./ShapesPanel";
import SmartElementsPanel from "./SmartElementsPanel";
import RootLinkPanel from "./RootLinkPanel";
import SmartAssistantPanel from "./SmartAssistantPanel";
import CollaborationPanel from "./CollaborationPanel";
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
          {inspector}
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

=======
import { LiveCursorsOverlay } from "./LiveCursorsOverlay";
import { ToolProvider, useTooling } from "./ToolState";

function ActiveInspector() {
  const { activeTool } = useTooling();
  switch (activeTool) {
    case "selection_tool":
      return <SelectionPanel />;
    case "smart_pen":
      return <SmartPenPanel />;
    case "file_uploader":
      return <FileUploadPanel />;
    case "comment_tool":
      return <CommentPanel />;
    case "text_tool":
      return <TextPanel />;
    case "shapes_tool":
      return <ShapesPanel />;
    case "smart_element_tool":
      return <SmartElementsPanel />;
    case "root_link_tool":
      return <RootLinkPanel />;
    default:
      return null;
  }
}

export default function PlanningPanel() {
  return (
    <ToolProvider>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Canvas placeholder */}
        <div style={{ position: "absolute", inset: 0 }} />
        <LiveCursorsOverlay camera={{ x: 0, y: 0 }} />

        {/* Top and bottom toolbars */}
        <TopToolbar canUndo={false} canRedo={false} undo={() => {}} redo={() => {}} />
        <BottomToolbar />

        {/* Right sidebar */}
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
            <ActiveInspector />
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#ffffffd9",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CollaborationPanel />
            <SmartAssistantPanel />
          </div>
        </div>
      </div>
    </ToolProvider>
  );
}
