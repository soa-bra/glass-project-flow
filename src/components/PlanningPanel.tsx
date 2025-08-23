import React, { useState } from "react";
import TopToolbar from "../../TopToolbar";
import BottomToolbar from "../../BottomToolbar";
import SelectionPanel from "../../SelectionPanel";
import SmartPenPanel from "../../SmartPenPanel";
import ZoomPanel from "../../ZoomPanel";
import PanPanel from "../../PanPanel";
import FileUploadPanel from "../../FileUploadPanel";
import CommentPanel from "../../CommentPanel";
import TextPanel from "../../TextPanel";
import ShapesPanel from "../../ShapesPanel";
import SmartElementsPanel from "../../SmartElementsPanel";
import RootLinkPanel from "../../RootLinkPanel";
import { useTooling } from "../../ToolState";
import type { ToolId } from "../../panels";

const toolPanels: Record<ToolId, React.FC> = {
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

export default function PlanningPanel() {
  const { activeTool, grid } = useTooling();
  const ActivePanel = toolPanels[activeTool] ?? (() => null);

  const [history, setHistory] = useState<unknown[]>([]);
  const [pointer, setPointer] = useState(-1);

  const undo = () => {
    if (pointer >= 0) setPointer(pointer - 1);
  };
  const redo = () => {
    if (pointer < history.length - 1) setPointer(pointer + 1);
  };

  const canUndo = pointer >= 0;
  const canRedo = pointer < history.length - 1;

  const onNew = () => {
    setHistory([]);
    setPointer(-1);
  };
  const onSave = () => console.log("save board");
  const onExport = () => console.log("export board");
  const onOpen = () => console.log("open board");
  const onDuplicate = () => console.log("duplicate board");
  const onGenerateProject = () => console.log("generate project");

  const gridStyle: React.CSSProperties = grid.visible
    ? grid.type === "dots"
      ? {
          backgroundSize: `${grid.size}px ${grid.size}px`,
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`,
        }
      : {
          backgroundSize: `${grid.size}px ${grid.size}px`,
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        }
    : {};

  return (
    <div className="relative h-full w-full">
      <TopToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        onNew={onNew}
        onSave={onSave}
        onExport={onExport}
        onOpen={onOpen}
        onDuplicate={onDuplicate}
        onGenerateProject={onGenerateProject}
      />

      <div className="absolute inset-0 overflow-hidden" style={gridStyle}>
        {/* Canvas placeholder */}
      </div>

      <div className="absolute top-4 right-4 w-64 max-h-[80vh] overflow-auto rounded-lg border border-gray-200 bg-white/90 p-4">
        <ActivePanel />
      </div>

      <BottomToolbar />
    </div>
  );
}

