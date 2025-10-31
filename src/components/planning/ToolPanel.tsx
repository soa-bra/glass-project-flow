import React from "react";
import { useTooling } from "./ToolState";
import SelectionPanel from "./panels/SelectionPanel";
import SmartPenPanel from "./panels/SmartPenPanel";
import FileUploadPanel from "./panels/FileUploadPanel";
import TextPanel from "./panels/TextPanel";
import ShapesPanel from "./panels/ShapesPanel";
import SmartElementsPanel from "./panels/SmartElementsPanel";

export default function ToolPanel() {
  const { activeTool } = useTooling();

  const renderPanel = () => {
    switch (activeTool) {
      case "selection_tool":
        return <SelectionPanel />;
      case "smart_pen":
        return <SmartPenPanel />;
      case "file_uploader":
        return <FileUploadPanel />;
      case "text_tool":
        return <TextPanel />;
      case "shapes_tool":
        return <ShapesPanel />;
      case "smart_element_tool":
        return <SmartElementsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute right-4 top-20 bottom-20 w-80 z-10">
      <div className="h-full bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl p-4 shadow-lg overflow-y-auto">
        {renderPanel()}
      </div>
    </div>
  );
}
